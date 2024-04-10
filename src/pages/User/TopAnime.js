import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/common/header';
import Footer from '../../components/common/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye } from '@fortawesome/free-solid-svg-icons';


const TopAnime = () => {
    const [topAnime, setTopAnime] = useState([]);
    const [selectedType, setSelectedType] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3030/top-rated-anime?type=${selectedType}`)
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
    }, [selectedType]);

    const handleFilter = (type) => {
        if (selectedType !== type) {
            setSelectedType(type);
        }
    };

    return (
        <div>
            <Header />
            <main>
                <article>
                    <section className="top-rated">
                        <div className="container">
                            <h2 className="h2 section-title">Top Anime</h2>
                            <ul className="filter-list">
                                <li>
                                    <button className={`filter-btn ${selectedType === "All" ? "active" : ""}`} onClick={() => handleFilter("")}>All</button>
                                </li>
                                <li>
                                    <button className={`filter-btn ${selectedType === "Movies" ? "active" : ""}`} onClick={() => handleFilter("Movies")}>Movies</button>
                                </li>
                                <li>
                                    <button className={`filter-btn ${selectedType === "TV" ? "active" : ""}`} onClick={() => handleFilter("TV")}>TV Series</button>
                                </li>
                            </ul>
                            <ul className="top-list">
                                {topAnime.map((anime, index) => (
                                    <li key={anime.id} className="movie-row">
                                        <span style={{ color: "white" }} className="index">{index + 1}</span>
                                        <img style={{ color: "white" }} className="movie-top-image" src={anime.imageUrl} alt={anime.ani_name} />
                                        <div className="movie-title">
                                            <Link to={`/anime/${anime.id}`}>
                                                <h3 style={{ color: "white" }}>{anime.ani_name}</h3>
                                            </Link>
                                            <div className="movie-title">
                                                <h3 style={{ color: "white" }}>
                                                    <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} /> {anime.ani_score.toFixed(1)}
                                                </h3>

                                            </div>
                                            <div className="movie-title">
                                                <h3 style={{ color: "white" }}> <FontAwesomeIcon icon={faEye} style={{ color: "white" }} /> {anime.ani_views} views</h3>
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

export default TopAnime;
