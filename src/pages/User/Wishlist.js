import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3030/wishlist', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const updatedWishlist = response.data.wishlist.map(item => {
                    const imageData = new Uint8Array(item.ani_img.data);
                    const blob = new Blob([imageData], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(blob);
                    return { ...item, imageUrl };
                });
                setWishlist(updatedWishlist);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching wishlist:', error);
                setLoading(false);
            });

        return () => {
            wishlist.forEach(item => URL.revokeObjectURL(item.imageUrl));
        };
    }, []);

    const removeFromWhitelist = (AnimeId) => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`http://localhost:3030/anime/${AnimeId}/remove-from-whitelist`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    swal({
                        title: 'Removed wishlist',
                        text: 'Removed from whitelist successfully',
                        icon: "success",
                    })
                    window.location.reload();
                })
                .catch(error => {
                    swal({
                        title: 'Added to wishlist',
                        text: 'Error removing from whitelist',
                        icon: "error",
                    })
                    console.error('Error removing from whitelist:', error);
                });
        } else {
            console.error('Token not found in localStorage');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main>
            <article>
                <section className="top-rated">
                    <div className="container">
                        <h2 className="h2 section-title">Wishlist</h2>
                        {wishlist.length === 0 ? (
                            <div>No wishlist available</div>
                        ) : (
                            <ul className="wishlist-list">
                                {wishlist.map((item, index) => (
                                    <li key={index} className="wishlist-item">
                                        <span className="index">{index + 1}</span>
                                        <img className="wishlist-image" src={item.imageUrl} alt={item.ani_name} />
                                        <Link to={`/anime/${item.ani_id}`}>
                                            <div className="wishlist-details">
                                                <h3 className="wishlist-title">{item.ani_name}</h3>
                                            </div>
                                        </Link>
                                        <button className="delete-button" onClick={() => removeFromWhitelist(item.ani_id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </article>
        </main>
    );
};

export default Wishlist;
