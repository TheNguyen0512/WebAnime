import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/header';
import Footer from '../../components/common/footer';

const AnimeGenres = () => {
    const { genreId } = useParams();
    const [selectedGenre, setSelectedGenre] = useState('');
    const [animeByGenre, setAnimeByGenre] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3030/anime-by-genre/${genreId}`)
            .then(response => {
                const updatedAnimeData = response.data.map(anime => {
                    const blob = new Blob([new Uint8Array(anime.ani_img.data)], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(blob);
                    return { ...anime, imageUrl };
                });
                setAnimeByGenre(updatedAnimeData);
                console.log(updatedAnimeData);
            })
            .catch(error => {
                console.error('Error fetching anime by genre:', error);
            });

        axios.get('http://localhost:3030/ani-genre')
            .then(response => {
                const foundGenre = response.data.find(genre => genre.id === parseInt(genreId));
                if (foundGenre) {
                    setSelectedGenre(foundGenre.ani_genry);
                    console.log(foundGenre.ani_genry);
                }
            })
            .catch(error => {
                console.error('Error fetching anime genres:', error);
            });
    }, [genreId]);
    return (
        <div>
            <Header />
            <main>
                <article>
                    <section className="top-rated">
                        <div className="container">
                            <p className="section-subtitle">Online Streaming</p>
                            <h2 className="h2 section-title">{selectedGenre}</h2>
                            <ul className="movies-list">
                                {animeByGenre.map(anime => (
                                    <li key={anime.id}>
                                        <div className='movie-card'>
                                            <figure className='card-banner'>
                                                <img src={anime.imageUrl} alt={anime.ani_name} />
                                            </figure>
                                            <div className='title-wrapper'>
                                                <Link to={`/anime/${anime.id}`}>
                                                    <h3 style={{ color: "white" }}>{anime.ani_name}</h3>
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default AnimeGenres;
