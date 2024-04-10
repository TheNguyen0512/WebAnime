import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/common/header';
import Footer from '../../components/common/footer';



const Home = () => {
    const [upcomingAnime, setUpcomingAnime] = useState([]);
    const [selectedType, setSelectedType] = useState("");

    useEffect(() => {
        let isMounted = true;
        axios.get(`http://localhost:3030/upcoming-anime?type=${selectedType}`)
            .then(response => {
                const updatedAnimeData = response.data.map(anime => {
                    const imageData = new Uint8Array(anime.ani_img.data);
                    const blob = new Blob([imageData], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(blob);
                    return { ...anime, imageUrl };
                });
                setUpcomingAnime(updatedAnimeData);
            })
            .catch(error => {
                console.error('Error fetching upcoming anime:', error);
            });

        return () => {
            isMounted = false;
            upcomingAnime.forEach(anime => URL.revokeObjectURL(anime.imageUrl));
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
                    {/* HERO */}
                    <section className="hero">
                        <div className="container">

                            <div className="hero-content">
                                <p className="hero-subtitle">Anime World</p>
                                <h1 className="h1 hero-title">
                                    Unlimited <strong>Movie</strong>, TVs, & More.
                                </h1>

                                {/* Meta wrapper */}
                                <div className="meta-wrapper">
                                    {/* Badges */}
                                    <div className="badge-wrapper">
                                        <div className="badge badge-fill">PG 18</div>
                                        <div className="badge badge-outline">HD</div>
                                    </div>

                                    {/* Genre */}
                                    <div className="genre-wrapper">
                                        <a href="#">Romance,</a>
                                        <a href="#">Drama</a>
                                    </div>

                                    {/* Date and Time */}
                                    <div className="date-time">
                                        <div>
                                            <ion-icon name="calendar-outline"></ion-icon>
                                            <time dateTime="2022">2022</time>
                                        </div>
                                        <div>
                                            <ion-icon name="time-outline"></ion-icon>
                                            <time dateTime="PT128M">128 min</time>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <section className="top-rated">
                        <div className="container">
                            <p className="section-subtitle">Online Streaming</p>

                            <h2 className="h2 section-title">Anime Movies</h2>

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
                            {upcomingAnime.length === 0 ? (
                                <p>No anime available</p>
                            ) : (
                                <ul className="movies-list">
                                    {upcomingAnime.map(anime => (
                                        <li key={anime.id}>
                                            <div className='movie-card'>
                                                <Link to={`/anime/${anime.id}`}>
                                                    <figure className='card-banner'>
                                                        <img src={anime.imageUrl} alt={anime.ani_name} />
                                                    </figure>
                                                    <h3 style={{ color: "white" }}>{anime.ani_name}</h3>
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>

                    </section>

                </article>
            </main>
            <Footer />
        </div>

    );
};

export default Home
