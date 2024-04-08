import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';


const TopAnime = () => {
    const [topAnime, setTopAnime] = useState([]);
    const [liked, setLiked] = useState({});
    const [bookmarked, setBookmarked] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3030/top-rated-anime')
            .then(response => {
                const updatedAnimeData = response.data.map(anime => {

                    const imageData = new Uint8Array(anime.ani_img.data);

                    const blob = new Blob([imageData], { type: 'image/jpeg' });

                    const imageUrl = URL.createObjectURL(blob);

                    return { ...anime, imageUrl };
                });
                setTopAnime(updatedAnimeData);
            })
            .catch(error => {
                console.error('Error fetching top rated anime:', error);
            });

        return () => {
            topAnime.forEach(anime => URL.revokeObjectURL(anime.imageUrl));
        };
    }, []);


    const toggleLike = (id) => {
        setLiked(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const toggleBookmark = (id) => {
        setBookmarked(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <main>
            <article>
                <section className="top-rated">
                    <div className="container">
                        <h2 className="h2 section-title">Top Anime</h2>
                        <ul className="filter-list">
                            <li>
                                <button className="filter-btn">Movies</button>
                            </li>
                            <li>
                                <button className="filter-btn">TV Series</button>
                            </li>
                        </ul>
                        <ul className="top-list">
                            {topAnime.map((anime, index) => (
                                <li key={anime.id} className="movie-row">
                                    <span className="index">{index + 1}</span>
                                    <img className="movie-top-image" src={anime.imageUrl} alt={anime.ani_name} />
                                    <div className="movie-title">
                                        <Link to={`/anime/${anime.id}`}>
                                            <h3>{anime.ani_name}</h3>
                                        </Link>
                                        <div className="movie-title">
                                            <h3>{anime.ani_score}</h3>
                                        </div>
                                        <div className="movie-title">
                                            <h3>{anime.ani_views} views</h3>
                                        </div>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </article>
        </main>

    );
};

export default TopAnime;
