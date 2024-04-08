import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

const AnimeVideo = () => {
    const { AnimeId } = useParams();
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [animeData, setAnimeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [watchTime, setWatchTime] = useState(0);
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [guestCounter, setGuestCounter] = useState(0);
    const [feedbackData, setFeedbackData] = useState([]);
    const [displayedFeedback, setDisplayedFeedback] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWhitelisted, setIsWhitelisted] = useState(false);


    useEffect(() => {
        axios.get(`http://localhost:3030/anime/${AnimeId}`)
            .then(response => {
                if (response.data) {
                    const anime = response.data;
                    const imageData = anime.ani_img ? new Uint8Array(anime.ani_img.data) : null;
                    const imageUrl = imageData ? URL.createObjectURL(new Blob([imageData], { type: 'image/jpeg' })) : null;
                    const updatedAnimeData = { ...anime, imageUrl };
                    setAnimeData(updatedAnimeData);
                    setLoading(false);
                } else {
                    console.error('Empty response from server');
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching anime data:', error);
                setLoading(false);
                setError(true);
            });

        axios.get(`http://localhost:3030/anime/${AnimeId}/feedback`)
            .then(response => {
                if (response.data) {
                    setFeedbackData(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching feedback:', error);
            });
    }, [AnimeId]);

    useEffect(() => {
        setDisplayedFeedback(feedbackData.slice(0, 5));
    }, [feedbackData]);


    useEffect(() => {
        if (animeData) {
            const videoLinks = animeData.video_url.split(',').map(link => link.trim());
            setSelectedVideos(videoLinks);
        }
    }, [animeData]);

    const extractVideoId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?t=))([\w\d_-]{11})/);
        return match ? match[1] : null;
    };

    const handleVideoButtonClick = (index) => {
        setSelectedVideoIndex(index);
        setWatchTime(0);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const storedUserName = localStorage.getItem('userName');
            setUserName(storedUserName);
        }
    }, []);

    const incrementViewCount = () => {
        setViewCount(prevCount => prevCount + 1);

        axios.post(`http://localhost:3030/anime/${AnimeId}/increment-view`, { viewCount: viewCount + 1 })
            .then(response => {
                console.log('View count updated successfully:', response.data);
            })
            .catch(error => {
                console.error('Error updating view count:', error);
            });
    };

    useEffect(() => {
        // Thiết lập một interval để theo dõi thời gian xem của video
        const interval = setInterval(() => {
            setWatchTime(prevWatchTime => prevWatchTime + 1); // Tăng thời gian xem lên mỗi giây
        }, 1000);

        // Kiểm tra nếu thời gian xem đã đạt đến 30 giây, thì tăng số lượt xem và cập nhật nó trong cơ sở dữ liệu
        if (watchTime === 30) {
            incrementViewCount();
        }

        // Xóa interval khi component unmount hoặc khi người dùng chuyển sang video mới
        return () => clearInterval(interval);
    }, [watchTime, selectedVideoIndex]);

    const submitFeedback = (feedback) => {
        const currentUserName = userName || `Guest ${guestCounter + 1}`;
        axios.post(`http://localhost:3030/anime/${AnimeId}/feedback`, { feedback, userName: currentUserName })
            .then(response => {
                console.log('Feedback submitted successfully:', response.data);
                if (!userName) {
                    setGuestCounter(prevCounter => prevCounter + 1);
                }
                // Update both feedbackData and displayedFeedback to include all feedback items
                axios.get(`http://localhost:3030/anime/${AnimeId}/feedback`)
                    .then(response => {
                        if (response.data) {
                            setFeedbackData(response.data);
                            setDisplayedFeedback(response.data.slice(0, 5));
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching feedback:', error);
                    });
            })
            .catch(error => {
                console.error('Error submitting feedback:', error);
            });
    };

    const loadMoreFeedback = () => {
        const currentLength = displayedFeedback.length;
        const nextBatch = feedbackData.slice(currentLength, currentLength + 5);
        setDisplayedFeedback(prevFeedback => [...prevFeedback, ...nextBatch]); // Append next batch to the end
    };

    const formatTimeDifference = (timestamp) => {
        const now = new Date();
        const commentTime = new Date(timestamp);
        const diff = now - commentTime;

        // Convert milliseconds to seconds
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} days ago`;
        } else if (hours > 0) {
            return `${hours} hours ago`;
        } else if (minutes > 0) {
            return `${minutes} minutes ago`;
        } else {
            return 'Just now';
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://localhost:3030/anime/${AnimeId}/favorite-status`)
                .then(response => {
                    if (response.data.isFavorite) {
                        setIsFavorite(true);
                    }
                })
                .catch(error => {
                    console.error('Error checking favorite status:', error);
                });

            axios.get(`http://localhost:3030/anime/${AnimeId}/whitelist-status`)
                .then(response => {
                    if (response.data.isWhitelisted) {
                        setIsWhitelisted(true);
                    }
                })
                .catch(error => {
                    console.error('Error checking whitelist status:', error);
                });
        }
    }, [AnimeId]);

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFromFavorite();
        } else {
            addToFavorite();
        }
    };

    const toggleWhitelist = () => {
        if (isWhitelisted) {
            removeFromWhitelist();
        } else {
            addToWhitelist();
        }
    };

    const addToFavorite = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`http://localhost:3030/anime/${AnimeId}/add-to-favorite`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setIsFavorite(true);
                    swal({
                        title: 'Added to favorites!',
                        text: 'Added to favorites successfully',
                        icon: "success",
                    })
                })
                .catch(error => {
                    console.error('Error adding to favorite:', error);
                    swal({
                        title: 'Added to favorites!',
                        text: 'Error adding to favorites',
                        icon: "error",
                    })
                });
        } else {
            console.error('Token not found in localStorage');
        }
    };

    const removeFromFavorite = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`http://localhost:3030/anime/${AnimeId}/remove-from-favorite`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setIsFavorite(false);
                    swal({
                        title: 'Remove favorites!',
                        text: 'Removed from favorites successfully',
                        icon: "success",
                    })
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

    const addToWhitelist = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`http://localhost:3030/anime/${AnimeId}/add-to-whitelist`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setIsWhitelisted(true);
                    swal({
                        title: 'Added to wishlist',
                        text: 'Added to whitelist successfully',
                        icon: "success",
                    })
                })
                .catch(error => {
                    console.error('Error adding to whitelist:', error);
                    swal({
                        title: 'Added to wishlist',
                        text: 'Error adding to whitelist',
                        icon: "error",
                    })
                });
        } else {
            console.error('Token not found in localStorage');
        }
    };

    const removeFromWhitelist = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`http://localhost:3030/anime/${AnimeId}/remove-from-whitelist`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setIsWhitelisted(false);
                    swal({
                        title: 'Removed wishlist',
                        text: 'Removed from whitelist successfully',
                        icon: "success",
                    })
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

    if (error) {
        return <div>Error fetching data. Please try again later.</div>;
    }

    if (!animeData) {
        return <div>Movie not found!</div>;
    }

    return (
        <main>
            <article>
                <section className="top-rated">
                    <div className="container">
                        <div className='container video-tab'>
                            <div className="anime-title">
                                <h2>{animeData.ani_name}</h2>
                            </div>
                            <div className='youtube-videos'>
                                <div className='youtube-video'>
                                    <YouTube key={selectedVideoIndex} videoId={extractVideoId(selectedVideos[selectedVideoIndex])} />
                                </div>
                            </div>
                            <div className='container episode'>
                                <div className='text'>
                                    <p>View: {animeData.ani_views}</p>
                                </div>
                                <div className="video-links">
                                    <h3>Episodes:</h3>
                                    {selectedVideos.map((videoUrl, index) => (
                                        <button key={index} onClick={() => handleVideoButtonClick(index)}>Episode {index}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='container overview'>
                            <div className='movie-info'>
                                <div className='image'>
                                    <figure className='card-info'>
                                        <img src={animeData.imageUrl} alt={animeData.ani_name} />
                                    </figure>
                                    <div className="button-wrapper">
                                        <button className="favorite-button" onClick={toggleFavorite}>{isFavorite ? 'Remove from Favorite' : 'Add to Favorite'}</button>
                                        <button className="whitelist-button" onClick={toggleWhitelist}>{isWhitelisted ? 'Remove from Whitelist' : 'Add to Whitelist'}</button>

                                    </div>
                                </div>
                                <div className='text'>
                                    <div className='info-name-wrapper'>
                                        <h3>{animeData.ani_name}</h3>
                                    </div>
                                    <div className='info-overview-wrapper'>
                                        <FontAwesomeIcon icon={faStar} /> {animeData.ani_score}
                                    </div>
                                    <div className='info-overview-wrapper'>
                                        <h3>Overview:</h3>
                                        <h3>{animeData.ani_overview}</h3>
                                    </div>
                                    <div className='info-overview-wrapper'>
                                        <h3>Director: {animeData.ani_director}</h3>
                                    </div>
                                    <div className='info-overview-wrapper'>
                                        <h3>Episodes: {selectedVideos.length - 1}/{animeData.ani_episodes}</h3>
                                    </div>
                                    <div className='info-overview-wrapper'>
                                        <h3>Type: {animeData.ani_type}</h3>
                                    </div>
                                    <div className='info-overview-wrapper'>
                                        <h3>Rating: {animeData.ani_rating}</h3>
                                    </div>
                                    <div className='info-overview-wrapper'>
                                        <h3>Season: {animeData.ani_season}</h3>
                                    </div>
                                    <div className='info-overview-wrapper'>
                                        <h3>Studio: {animeData.ani_studio}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='container comment-tab'>
                            <div className='add-comment-section'>
                                <h4>Comments:</h4>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const feedback = e.target.elements.feedback.value;
                                    submitFeedback(feedback);
                                    e.target.elements.feedback.value = '';
                                }}>
                                    <textarea name="feedback" placeholder="Enter your feedback"></textarea>
                                    <button type="submit">Submit</button>
                                </form>
                                <div className='comment-section'>
                                    <h4>Comments History:</h4>
                                    {displayedFeedback.length === 0 ? (
                                        <div className="feedback-item">
                                            <p>No comments available</p>
                                        </div>
                                    ) : (
                                        displayedFeedback.map((feedbackItem, index) => (
                                            <div key={index} className="feedback-item">
                                                <span>{feedbackItem.user_name}</span>
                                                <p>{feedbackItem.command}</p>
                                                <p>{formatTimeDifference(feedbackItem.create_At)}</p>
                                            </div>
                                        ))
                                    )}
                                    {feedbackData.length > displayedFeedback.length && (
                                        <button className="load-more-button" onClick={loadMoreFeedback}>Load More</button>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </section>
            </article>
        </main>
    );
};

export default AnimeVideo;
