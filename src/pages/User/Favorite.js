import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Header from '../../components/common/header';
import Footer from '../../components/common/footer';

const Favorite = () => {
    const [favorite, setFavorite] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3030/favorite', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const updatedFavorite = response.data.favoriteList.map(item => {
                    const imageData = new Uint8Array(item.ani_img.data);
                    const blob = new Blob([imageData], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(blob);
                    return { ...item, imageUrl };
                });
                setFavorite(updatedFavorite);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Favorite:', error);
                setLoading(false);
            });

        return () => {
            favorite.forEach(item => URL.revokeObjectURL(item.imageUrl));
        };
    }, []);

    const removeFromFavorite = (aniId) => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`http://localhost:3030/anime/${aniId}/remove-from-favorite`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    swal({
                        title: 'Remove favorites!',
                        text: 'Removed from favorites successfully',
                        icon: "success",
                    })
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error removing from favorite:', error);
                    swal({
                        title: 'Remove favorites!',
                        text: 'Error removing from favorites',
                        icon: "error",
                    })
                });
        } else {
            console.error('Token not found in localStorage');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <main>
                <article>
                    <section className="top-rated">
                        <div className="container">
                            <h2 className="h2 section-title">Favorite</h2>
                            {favorite.length === 0 ? (
                                <div style={{ color: "white" }}>No Favorite available</div>
                            ) : (
                                <ul className="wishlist-list">
                                    {favorite.map((item, index) => (
                                        <li key={index} className="wishlist-item">
                                            <span className="index">{index + 1}</span>
                                            <img className="wishlist-image" src={item.imageUrl} alt={item.ani_name} />
                                            <Link to={`/anime/${item.ani_id}`}>
                                                <div className="wishlist-details">
                                                    <h3 className="wishlist-title">{item.ani_name}</h3>
                                                </div>
                                            </Link>
                                            <button className="delete-button" onClick={() => removeFromFavorite(item.ani_id)}>Delete</button>
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

export default Favorite;
