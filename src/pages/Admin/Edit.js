import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

const Edit = () => {
    const { AnimeId } = useParams();
    const [anime, setAnime] = useState(null);
    const [newName, setNewName] = useState('');
    const [newImg, setNewImg] = useState('');
    const [newType, setNewType] = useState('');
    const [newDirector, setNewDirector] = useState('');
    const [newEpisodes, setNewEpisodes] = useState('');
    const [newRating, setNewRating] = useState('');
    const [newSeason, setNewSeason] = useState('');
    const [newStudio, setNewStudio] = useState('');
    const [newGenres, setNewGenres] = useState('');
    const [newOverview, setNewOverview] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        fetchAnime();
    }, []);

    const fetchAnime = () => {
        axios.get(`http://localhost:3030/anime/${AnimeId}`)
            .then(response => {
                const animeData = response.data;
                const imageData = new Uint8Array(animeData.ani_img.data);
                const blob = new Blob([imageData], { type: 'image/jpeg' });
                const imageUrl = URL.createObjectURL(blob);
                const animeWithImageUrl = { ...animeData, imageUrl };
                setAnime(animeWithImageUrl);
                setNewName(animeData.ani_name);
                setNewImg(animeData.ani_img);
                setNewType(animeData.ani_type);
                setNewDirector(animeData.ani_director);
                setNewEpisodes(animeData.ani_episodes);
                setNewRating(animeData.ani_rating);
                setNewSeason(animeData.ani_season);
                setNewStudio(animeData.ani_studio);
                setNewGenres(animeData.ani_genres_id);
                setNewOverview(animeData.ani_overview);
                setVideoUrl(animeData.video_url);
            })
            .catch(error => {
                console.error('Error fetching anime:', error);
            });
    };

    const handleEditAnime = () => {
        axios.post(`http://localhost:3030/anime/${AnimeId}/update`, {
            newName,
            newType,
            newDirector,
            newEpisodes,
            newRating,
            newSeason,
            newStudio,
            newGenres,
            newOverview,
            videoUrl
        })
            .then(response => {
                console.log('Anime updated successfully');
                swal('Success', 'Anime information updated successfully', 'success');
                fetchAnime();
            })
            .catch(error => {
                console.error('Error updating anime:', error);
                swal('Error', 'Failed to update anime information', 'error');
            });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const imageUrl = reader.result;
            setAnime({ ...anime, imageUrl }); // Cập nhật state của anime với URL mới
        };

        if (file) {
            reader.readAsDataURL(file); // Đọc dữ liệu của file hình ảnh
        }
    };

    if (!anime) {
        return <div>Loading...</div>;
    }

    return (
        <section className="profile">
            <h2>Edit Anime</h2>            
            <Link to="/admin" className="back-button">Back</Link>
            <div className='container'>
                <div className="anime-details">
                    <div className="anime-info">
                        <h4>Name:</h4>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div className="anime-info">
                        <h4>Image:</h4>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        {anime.imageUrl && (
                            <img src={anime.imageUrl} alt={anime.ani_name} className="anime-image" />
                        )}
                    </div>
                    <div className="anime-info">
                        <h4>Type:</h4>
                        <input
                            type="text"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                        />
                    </div>
                    <div className="anime-info">
                        <h4>Director:</h4>
                        <input
                            type="text"
                            value={newDirector}
                            onChange={(e) => setNewDirector(e.target.value)}
                        />
                    </div>
                    <div className="anime-info">
                        <h4>Episodes:</h4>
                        <input
                            type="number"
                            value={newEpisodes}
                            onChange={(e) => setNewEpisodes(e.target.value)}
                        />
                    </div>
                    <div className="anime-info">
                        <h4>Rating:</h4>
                        <input
                            type="text"
                            value={newRating}
                            onChange={(e) => setNewRating(e.target.value)}
                        />
                    </div>
                    <div className="anime-info">
                        <h4>Season:</h4>
                        <input
                            type="text"
                            value={newSeason}
                            onChange={(e) => setNewSeason(e.target.value)}
                        />
                    </div>
                    <div className="anime-info">
                        <h4>Studio:</h4>
                        <input
                            type="text"
                            value={newStudio}
                            onChange={(e) => setNewStudio(e.target.value)}
                        />
                    </div>
                    <div className="anime-info">
                        <h4>Genres:</h4>
                        <input
                            type="text"
                            value={newGenres}
                            onChange={(e) => setNewGenres(e.target.value)}
                        />
                    </div>
                    <div className="anime-info">
                        <h4>Overview:</h4>
                        <input
                            type="text"
                            value={newOverview}
                            onChange={(e) => setNewOverview(e.target.value)}
                        />
                    </div>
                    <div className="anime-info-video">
                        <h4>Video URL:</h4>
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    </div>
                    <button className="edit-button" onClick={handleEditAnime}>Edit</button>
                </div>
            </div>
        </section>
    );
};

export default Edit;
