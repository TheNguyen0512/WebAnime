import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import HeaderAdmin from '../../components/common/headerAdmin';
import Sidebar from '../../components/common/SidebarMenu';

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
    const [sidebarOpen, setSidebarOpen] = useState(false); // State to track the open/close state of Sidebar

    const [activeTab, setActiveTab] = useState('movies');

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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="admin-container">
            <HeaderAdmin toggleSidebar={toggleSidebar} />
            <div className="sidebar-wrapper">
                <Sidebar setActiveTab={setActiveTab} />
                <div className={`sidebar-content ${sidebarOpen ? 'active' : ''}`}>
                    <section className="profile">
                        <div className="profile ">
                            <div className="admin-navbar">
                                <div className="nav-item-container">
                                    <Link to="/admin" className={`nav-item ${activeTab === 'movies' ? 'active' : ''}`}>Anime List</Link>
                                    <button className={`nav-item ${activeTab === 'addMovie' ? 'active' : ''}`} onClick={() => setActiveTab('addMovie')}>Add Anime</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <section className="setActiveTab">
                    <Link to="/admin" className="back-button">Back</Link>
                    <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Edit Anime</h1>
                    <div className='container'>
                        <div className="anime-details">
                            <div className="anime-info">
                                <h3>Name:</h3>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div className="anime-info">
                                <h3>Image:</h3>
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
                                <h3>Type:</h3>
                                <input
                                    type="text"
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                />
                            </div>
                            <div className="anime-info">
                                <h3>Director:</h3>
                                <input
                                    type="text"
                                    value={newDirector}
                                    onChange={(e) => setNewDirector(e.target.value)}
                                />
                            </div>
                            <div className="anime-info">
                                <h3>Episodes:</h3>
                                <input
                                    type="number"
                                    value={newEpisodes}
                                    onChange={(e) => setNewEpisodes(e.target.value)}
                                />
                            </div>
                            <div className="anime-info">
                                <h3>Rating:</h3>
                                <input
                                    type="text"
                                    value={newRating}
                                    onChange={(e) => setNewRating(e.target.value)}
                                />
                            </div>
                            <div className="anime-info">
                                <h3>Season:</h3>
                                <input
                                    type="text"
                                    value={newSeason}
                                    onChange={(e) => setNewSeason(e.target.value)}
                                />
                            </div>
                            <div className="anime-info">
                                <h3>Studio:</h3>
                                <input
                                    type="text"
                                    value={newStudio}
                                    onChange={(e) => setNewStudio(e.target.value)}
                                />
                            </div>
                            <div className="anime-info">
                                <h3>Genres:</h3>
                                <input
                                    type="text"
                                    value={newGenres}
                                    onChange={(e) => setNewGenres(e.target.value)}
                                />
                            </div>
                            <div className="anime-info">
                                <h3>Overview:</h3>
                                <input
                                    type="text"
                                    value={newOverview}
                                    onChange={(e) => setNewOverview(e.target.value)}
                                />
                            </div>
                            <div className="anime-info-video">
                                <h3>Video URL:</h3>
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
            </div>
        </div>
    );
};

export default Edit;
