const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3030;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webanime'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');

    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    db.query(createUserTableQuery, (err, result) => {
        if (err) throw err;
        console.log('User table created successfully');
    });
});

app.use(bodyParser.json());

function getUserIdFromToken(token) {
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        return decodedToken.userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length == 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        try {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(402).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

            const insertSessionSql = 'INSERT INTO sessions (token, user_id) VALUES(?, ?)ON DUPLICATE KEY UPDATE token = VALUES(token);';
            db.query(insertSessionSql, [token, user.id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                return res.status(200).json({ message: 'Login successful', token, userName: user.name, userEmail: user.email });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error registering user');
            return;
        }
        console.log('User registered successfully');
        res.status(200).send('User registered successfully');
    });
});

app.post('/check-email', (req, res) => {
    const { email } = req.body;
    const sql = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error checking email');
            return;
        }
        const emailExists = result[0].count > 0;
        res.status(200).json({ exists: emailExists });
    });
});

app.get('/profile', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const userId = decodedToken.userId;

        const sql = 'SELECT * FROM users WHERE id = ?';
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = results[0];
            return res.status(200).json(user);
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});

app.post('/profile', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const userId = decodedToken.userId;

        const { name, password } = req.body;

        const sql = 'UPDATE users SET name = ?, password = ? WHERE id = ?';
        db.query(sql, [name, password, userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(200).json({ message: 'Profile updated successfully' });
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});


app.get('/upcoming-anime', (req, res) => {
    let type = req.query.type; // Lấy loại anime từ yêu cầu
    let sql;
    if (type) {
        sql = `SELECT id, ani_name, ani_img, ani_type FROM anime WHERE ani_type = '${type}'`;
    } else {
        sql = 'SELECT id, ani_name, ani_img, ani_type FROM anime';
    }
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(results);
    });
});


app.get('/ani-genre', (req, res) => {
    const sql = 'SELECT id, ani_genry FROM anime_genry';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(results);
    });
});

app.get('/anime-by-genre/:genreId', (req, res) => {
    const genreId = req.params.genreId;

    const sql = `
        SELECT anime.id, anime.ani_name, anime.ani_img, ani_genry
        FROM anime
        INNER JOIN anime_genry ON FIND_IN_SET(anime_genry.id, REPLACE(REPLACE(JSON_EXTRACT(anime.ani_genres_id, '$[*]'), '[', ''), ']', '')) > 0
        WHERE anime_genry.id = ?;      
    `;

    db.query(sql, [genreId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        res.status(200).json(results);
    });
});

app.get('/anime/:id', (req, res) => {
    const animeId = req.params.id;

    const sql = `
        SELECT * 
        FROM anime
        INNER JOIN anime_video ON FIND_IN_SET(anime_video.ani_id, anime.id)
        WHERE anime_video.ani_id = ?`;
    db.query(sql, [animeId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }

        const movie = results[0];
        res.status(200).json(movie);
    });
});

app.get('/anime-video', (req, res) => {
    const animeId = req.params.id;

    const sql = 'SELECT ani_id, video_url FROM anime_video';
    db.query(sql, [animeId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }

        const movie = results[0];
        res.status(200).json(movie);
    });
});

app.post('/anime/:id/increment-view', (req, res) => {
    const animeId = req.params.id;

    const sqlGetViews = 'SELECT ani_views FROM anime WHERE id = ?';
    db.query(sqlGetViews, [animeId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Anime not found' });
            return;
        }

        const currentViews = results[0].ani_views;

        const updatedViews = currentViews + 1;
        const sqlUpdateViews = 'UPDATE anime SET ani_views = ? WHERE id = ?';
        db.query(sqlUpdateViews, [updatedViews, animeId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            res.status(200).json({ message: 'View count incremented successfully' });
        });
    });
});

app.post('/anime/:id/feedback', (req, res) => {
    const { id } = req.params;
    const { feedback, userName } = req.body;

    const sql = 'INSERT INTO anime_commands (ani_id, user_name, command) VALUES (?, ?, ?)';
    db.query(sql, [id, userName, feedback], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Feedback saved successfully');
        res.status(200).json({ message: 'Feedback saved successfully' });
    });
});

app.get('/anime/:id/feedback', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT user_name, command FROM anime_commands WHERE ani_id = ? ORDER BY create_At DESC';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Feedback retrieved successfully');
        // console.log(results);
        res.status(200).json(results);
    });
});

app.get('/search', (req, res) => {
    const { searchQuery } = req.query;

    // Check if searchQuery is empty or not provided
    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    let sql = `SELECT id, ani_name, ani_director, ani_img FROM anime WHERE ani_name LIKE '%${searchQuery}%' OR ani_director LIKE '%${searchQuery}%'`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});

app.post('/anime/:id/update', (req, res) => {
    const animeId = req.params.id;
    const { newName, newType, newDirector, newEpisodes, newRating, newSeason, newStudio, newGenres, newOverview, videoUrl } = req.body;

    const sqlUpdateAnime = `
        UPDATE anime
        SET ani_name = ?, ani_type = ?, ani_director = ?, ani_episodes = ?, ani_rating = ?, ani_season = ?, ani_studio = ?, ani_genres_id = ?, ani_overview = ?
        WHERE id = ?
    `;
    db.query(sqlUpdateAnime, [newName, newType, newDirector, newEpisodes, newRating, newSeason, newStudio, newGenres, newOverview, animeId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const sqlUpdateVideoUrl = 'UPDATE anime_video SET video_url = ? WHERE ani_id = ?';
        db.query(sqlUpdateVideoUrl, [videoUrl, animeId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Anime information updated successfully' });
        });
    });
});

app.post('/add-movie', (req, res) => {
    const { name, type, director, episodes, rating, season, studio, genres, overview, videoUrl } = req.body;

    const sql = `
        INSERT INTO anime (ani_name, ani_type, ani_director, ani_episodes, ani_rating, ani_season, ani_studio, ani_genres_id, ani_overview)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [name, type, director, episodes, rating, season, studio, genres, overview], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const animeId = result.insertId;

        const insertVideoUrlSql = 'INSERT INTO anime_video (ani_id, video_url) VALUES (?, ?)';
        db.query(insertVideoUrlSql, [animeId, videoUrl], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Movie added successfully' });
        });
    });
});

// Route to delete a movie and its related data
app.delete('/anime/:id', (req, res) => {
    const animeId = req.params.id;

    // Delete the movie from the anime table
    const deleteAnimeSql = 'DELETE FROM anime WHERE id = ?';
    db.query(deleteAnimeSql, [animeId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Delete the corresponding entry from the anime_video table
        const deleteVideoSql = 'DELETE FROM anime_video WHERE ani_id = ?';
        db.query(deleteVideoSql, [animeId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Movie deleted successfully' });
        });
    });
});

app.post('/add-wishlist', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const userId = decodedToken.userId;

        const { animeId } = req.body;

        const sql = 'INSERT INTO user_anime_wishlist (user_id, anime_id) VALUES (?, ?)';
        db.query(sql, [userId, animeId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Anime added to wishlist successfully' });
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});

app.post('/add-favorite', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const userId = decodedToken.userId;

        const { animeId } = req.body;

        const sql = 'INSERT INTO user_anime_favorite (user_id, anime_id) VALUES (?, ?)';
        db.query(sql, [userId, animeId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'Anime added to favorites successfully' });
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});

app.get('/top-rated-anime', (req, res) => {
    const sql = 'SELECT id, ani_name, ani_img, ani_score, ani_views, ani_type FROM anime ORDER BY ani_score DESC, ani_views DESC LIMIT 10';

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(results);
    });
});

app.post('/anime/:id/add-to-favorite', (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (userId) {
        const sql = 'INSERT INTO user_anime_favorite (user_id, ani_id) VALUES (?, ?)';
        db.query(sql, [userId, id], (err, result) => {
            if (err) {
                console.error('Error adding to favorite:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ message: 'Anime added to favorites successfully' });
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

app.post('/anime/:id/add-to-whitelist', (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (userId) {
        const sql = 'INSERT INTO user_anime_wishlist (user_id, ani_id) VALUES (?, ?)';
        db.query(sql, [userId, id], (err, result) => {
            if (err) {
                console.error('Error adding to Wishlist:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ message: 'Anime added to Wishlist successfully' });
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Endpoint for adding anime to favorite list
app.post('/anime/:id/add-to-favorite', (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (userId) {
        const sql = 'INSERT INTO user_anime_favorite (user_id, ani_id) VALUES (?, ?)';
        db.query(sql, [userId, id], (err, result) => {
            if (err) {
                console.error('Error adding to favorite:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ message: 'Anime added to favorites successfully' });
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Endpoint for removing anime from favorite list
app.post('/anime/:id/remove-from-favorite', (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (userId) {
        const sql = 'DELETE FROM user_anime_favorite WHERE user_id = ? AND ani_id = ?';
        db.query(sql, [userId, id], (err, result) => {
            if (err) {
                console.error('Error removing from favorite:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ message: 'Anime removed from favorites successfully' });
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Endpoint for adding anime to whitelist
app.post('/anime/:id/add-to-whitelist', (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (userId) {
        const sql = 'INSERT INTO user_anime_wishlist (user_id, ani_id) VALUES (?, ?)';
        db.query(sql, [userId, id], (err, result) => {
            if (err) {
                console.error('Error adding to Wishlist:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ message: 'Anime added to Wishlist successfully' });
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Endpoint for removing anime from whitelist
app.post('/anime/:id/remove-from-whitelist', (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (userId) {
        const sql = 'DELETE FROM user_anime_wishlist WHERE user_id = ? AND ani_id = ?';
        db.query(sql, [userId, id], (err, result) => {
            if (err) {
                console.error('Error removing from Wishlist:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ message: 'Anime removed from Wishlist successfully' });
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Endpoint for getting user's favorite anime list
app.get('/favorite', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (userId) {
        const sql = `
            SELECT af.ani_id, a.ani_name, a.ani_img 
            FROM user_anime_favorite af 
            INNER JOIN anime a ON af.ani_id = a.id 
            WHERE af.user_id = ?
        `;
        db.query(sql, [userId], (err, result) => {
            if (err) {
                console.error('Error fetching favorite list:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ favoriteList: result });
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});


// Endpoint for getting user's wishlist
app.get('/wishlist', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (userId) {
        const sql = `
            SELECT aw.ani_id, a.ani_name, a.ani_img 
            FROM user_anime_wishlist aw 
            INNER JOIN anime a ON aw.ani_id = a.id 
            WHERE aw.user_id = ?
        `;
        db.query(sql, [userId], (err, result) => {
            if (err) {
                console.error('Error fetching wishlist:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ wishlist: result });
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
