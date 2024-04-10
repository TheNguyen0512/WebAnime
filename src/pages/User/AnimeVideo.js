import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart, faBookmark, faEye } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';
import Header from '../../components/common/header';
import Footer from '../../components/common/footer';


const AnimeVideo = () => {
    const { AnimeId } = useParams();
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [animeData, setAnimeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [watchTime, setWatchTime] = useState(0);

    const [feedbackData, setFeedbackData] = useState([]);
    const [displayedFeedback, setDisplayedFeedback] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [hoverRating, setHoverRating] = useState(null);
    const navigate = useNavigate();

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



    const extractVideoId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?t=))([\w\d_-]{11})/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        if (animeData) {
            const videoLinks = animeData.video_url.split(',').map(link => link.trim());
            let trailers = [];
            let episodes = [];

            videoLinks.forEach((link, index) => {
                if (animeData.ani_type === 'TV' && index === 0) {
                    trailers.push(link);
                } else if (animeData.ani_type === 'Movie' && index === 0) {
                    trailers.push(link);
                } else {
                    episodes.push(link);
                }
            });

            const updatedSelectedVideos = [...trailers, ...episodes];
            setSelectedVideos(updatedSelectedVideos);

            // Check if there is a stored selected video index in localStorage
            const storedSelectedVideoIndex = localStorage.getItem(`selectedVideoIndex_${AnimeId}`);
            if (storedSelectedVideoIndex !== null) {
                setSelectedVideoIndex(parseInt(storedSelectedVideoIndex));
            }
        }
    }, [animeData, AnimeId]);

    useEffect(() => {
        setSelectedVideoIndex(0);
    }, []);

    const handleVideoButtonClick = (index) => {
        setSelectedVideoIndex(index);
        let url;
        if (animeData.ani_type === 'TV' && index === 0) {
            url = `/anime/${AnimeId}/trailer`;
        } else if (animeData.ani_type === 'Movies' && index === 0) {
            url = `/anime/${AnimeId}/trailer`;
        } else if (animeData.ani_type === 'Movies' && index === 1) {
            url = `/anime/${AnimeId}/movie`;
        } else {
            url = `/anime/${AnimeId}/episode-${index}`;
        }
        // Lưu trạng thái trang hiện tại
        const currentState = {
            selectedVideoIndex: selectedVideoIndex,
            url: window.location.href
        };
        window.history.pushState(currentState, "", currentState.url);
        // Điều hướng đến URL mới
        navigate(url);
        setWatchTime(0);
        // Store the selected episode index in localStorage
        localStorage.setItem(`selectedVideoIndex_${AnimeId}`, index);
    };

    // Thêm sự kiện lắng nghe cho sự kiện popstate của window
    useEffect(() => {
        const handlePopState = (event) => {
            const currentState = event.state;
            if (currentState && currentState.hasOwnProperty('selectedVideoIndex')) {
                setSelectedVideoIndex(currentState.selectedVideoIndex);
            } else {
                // If there's no selectedVideoIndex in the state, try to fetch it from localStorage
                const storedSelectedVideoIndex = localStorage.getItem(`selectedVideoIndex_${AnimeId}`);
                if (storedSelectedVideoIndex !== null) {
                    setSelectedVideoIndex(parseInt(storedSelectedVideoIndex));
                }
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [AnimeId]); // Add AnimeId to the dependencies array

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
        const interval = setInterval(() => {
            setWatchTime(prevWatchTime => prevWatchTime + 1);
        }, 1000);

        if (watchTime === 30) {
            incrementViewCount();
        }

        return () => clearInterval(interval);
    }, [watchTime, selectedVideoIndex]);



    const submitFeedback = (feedback) => {
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:3030/anime/${AnimeId}/feedback`, { feedback }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Feedback submitted successfully:', response.data);
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
                console.error('Error submitting feedback:', error.response.data.error);
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://localhost:3030/anime/${AnimeId}/favorite-status`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setIsFavorite(response.data.results.length > 0); // Set isFavorite based on the response
                })
                .catch(error => {
                    console.error('Error checking favorite status:', error);
                });

            axios.get(`http://localhost:3030/anime/${AnimeId}/whitelist-status`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setIsWhitelisted(response.data.results.length > 0); // Set isWhitelisted based on the response
                })
                .catch(error => {
                    console.error('Error checking whitelist status:', error);
                });
        }
    }, [AnimeId]);


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
                        text: 'Anime already exists in favorites',
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
                        text: 'Anime already exists in Wishlist',
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

    // Updated handleMouseEnter function to handle star hover effect
    const handleMouseEnter = (ratingValue) => {
        setHoverRating(ratingValue); // Update hoverRating state

        // Change color and size of stars based on hoverRating
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            const rating = index + 1;
            if (rating <= ratingValue) {
                star.style.color = "gold";
            } else {
                star.style.color = "gray";
            }
        });
    };

    // Updated handleMouseLeave function to reset star styles when mouse leaves
    const handleMouseLeave = () => {
        setHoverRating(null); // Reset hoverRating state

        // Reset star styles to reflect anime score
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.style.color = index < animeData.ani_score ? "gold" : "gray";
        });
    };

    // Updated handleRatingClick function to submit user rating
    const handleRatingClick = async (rating, AnimeId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            swal({
                title: 'Login Required!',
                text: 'Need to log in to rate points',
                icon: "error",
            }).then(() => {
                localStorage.setItem('previousPath', `/anime/${AnimeId}`);
                navigate('/login');
            });
            console.error('Token not found in localStorage');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:3030/anime/${AnimeId}/rate`,
                { rating: rating },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                console.log('Rating updated successfully');
                // Optionally, you can update the state to reflect the new rating
                setAnimeData(prevAnimeData => ({ ...prevAnimeData, ani_score: rating }));
                swal({
                    title: 'Score!',
                    text: 'Score successfully',
                    icon: "success",
                });
            } else {
                console.error('Failed to update rating');
            }
        } catch (error) {
            console.error('Error handling rating click:', error);
            // Handle errors appropriately, such as showing an error message to the user
            swal({
                title: 'Error!',
                text: 'Failed to update rating',
                icon: "error",
            });
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
        <div>
            <Header />
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
                                        <FontAwesomeIcon icon={faEye} style={{ color: "white" }} /> {animeData.ani_views}
                                    </div>
                                    <div className="video-links">
                                        <h3>Episodes:</h3>
                                        {selectedVideos.map((videoUrl, index) => (
                                            <button key={index} onClick={() => handleVideoButtonClick(index)}>
                                                {animeData.ani_type === 'TV' && index === 0 ? 'Trailer' : ''}
                                                {animeData.ani_type === 'Movies' && index === 0 ? 'Trailer' : ''}
                                                {animeData.ani_type === 'Movies' && index === 1 ? 'Movie' : ''}
                                                {animeData.ani_type === 'TV' && index > 0 ? `Episode ${index}` : ''}
                                                {animeData.ani_type === 'Movies' && index > 1 ? `Episode ${index}` : ''}
                                            </button>
                                        ))}

                                    </div>
                                </div>
                            </div>
                            <div className='container overview'>
                                <div className='movie-info'>
                                    <div className='image'>
                                        <figure className='card-info' style={{ width: '300px' }}>
                                            <img src={animeData.imageUrl} alt={animeData.ani_name} />
                                        </figure>
                                        <div className="button-wrapper">
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                className="favorite-button"
                                                onClick={toggleFavorite}
                                                style={{
                                                    color: isFavorite ? 'red' : 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '24px',
                                                    marginRight: '10px'
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faBookmark}
                                                className="whitelist-button"
                                                onClick={toggleWhitelist}
                                                style={{
                                                    color: isWhitelisted ? 'blue' : 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '24px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='text'>
                                        <div className='info-name-wrapper'>
                                            <h3>{animeData.ani_name}</h3>
                                        </div>
                                        <div className='info-overview-wrapper'>
                                            <h3>Score: {animeData.ani_score.toFixed(1)}</h3>
                                            <div className="star-rating">
                                                {[...Array(10)].map((star, index) => {
                                                    const ratingValue = index + 1;
                                                    return (
                                                        <FontAwesomeIcon
                                                            key={index}
                                                            icon={faStar}
                                                            className="star"
                                                            style={{
                                                                color: (hoverRating || animeData.ani_score) >= ratingValue ? "gold" : "gray", // Change color to gold if the rating value is less than or equal to the hoverRating or anime score
                                                                cursor: "pointer",
                                                                fontSize: "24px",
                                                                transition: "color 0.25s, font-size 0.25s",
                                                            }}
                                                            onMouseEnter={() => handleMouseEnter(ratingValue)}
                                                            onMouseLeave={() => handleMouseLeave()}
                                                            onClick={() => handleRatingClick(ratingValue, AnimeId)} // Pass userId and AnimeId to handleRatingClick function
                                                        />
                                                    );
                                                })}
                                            </div>

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
                                <div className='add-comment'>
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
                                                    <span>{feedbackItem.name}</span>
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
            <Footer />
        </div>
    );
};

export default AnimeVideo;
