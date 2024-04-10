import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import Header from '../../components/common/header';
import Footer from '../../components/common/footer';

const Search = () => {
    const { searchQuery } = useParams();
    const [animeBySearch, setAnimeBySearch] = useState([]);
    const [liked, setLiked] = useState({});
    const [bookmarked, setBookmarked] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:3030/search?searchQuery=${searchQuery}`)
            .then(response => {
                const updatedAnimeData = response.data.map(anime => {
                    if (anime.ani_img && anime.ani_img.data) {
                        const blob = new Blob([new Uint8Array(anime.ani_img.data)], { type: 'image/jpeg' });
                        const imageUrl = URL.createObjectURL(blob);
                        return { ...anime, imageUrl };
                    } else {
                        return anime;
                    }
                });
                setAnimeBySearch(updatedAnimeData);
                console.log(updatedAnimeData);
            })
            .catch(error => {
                console.error('Error fetching anime by search:', error);
            });
    }, [searchQuery]);


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
        <div>
            <Header />
            <main>
                <article>
                    <section className="top-rated">
                        <div className="container">
                            <h2 className="h2 section-title">Search Results</h2>
                            {animeBySearch.length === 0 ? (
                                <div className='movie-card'>
                                    <h3>No anime found</h3>
                                </div>
                            ) : (
                                <ul className="movies-list">
                                    {animeBySearch.map(anime => (
                                        <li key={anime.id}>
                                            <div className='movie-card'>
                                                <figure className='card-banner'>
                                                    <img src={anime.imageUrl} alt={anime.ani_name} />
                                                    <div className="icons">
                                                        <FontAwesomeIcon icon={faHeart} className="favorite-icon" style={{ color: liked[anime.id] ? 'red' : 'white', fontSize: '24px' }} onClick={() => toggleLike(anime.id)} />
                                                        <FontAwesomeIcon icon={faBookmark} className="whitelist-icon" style={{ color: bookmarked[anime.id] ? 'blue' : 'white', fontSize: '24px' }} onClick={() => toggleBookmark(anime.id)} />
                                                    </div>
                                                </figure>
                                                <div className='title-wrapper'>
                                                    <Link to={`/anime/${anime.id}`}>
                                                        <h3>{anime.ani_name}</h3>
                                                    </Link>
                                                </div>
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

export default Search;
