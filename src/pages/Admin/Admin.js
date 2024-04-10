import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import HeaderAdmin from '../../components/common/headerAdmin';
import Sidebar from '../../components/common/SidebarMenu';
import '../../components/assets/css/admin1.css'; // Import CSS file for HeaderAdmin

const Admin = () => {
  
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [newName, setNewName] = useState('');
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

  useEffect(() => {
    fetchMovies();
  }, []);

  

  const fetchMovies = () => {
    axios.get('http://localhost:3030/upcoming-anime')
      .then(response => {
        const updatedMoviesData = response.data.map(movie => {
          const imageData = new Uint8Array(movie.ani_img.data);
          const blob = new Blob([imageData], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
          return { ...movie, imageUrl };
        });
        setMovies(updatedMoviesData);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  };

  const deleteMovie = (id) => {
    axios.delete(`http://localhost:3030/anime/${id}`)
      .then(response => {
        console.log('Movie deleted successfully');
        fetchMovies();
        swal('Success', 'Movie deleted successfully', 'success');
      })
      .catch(error => {
        console.error('Error deleting movie:', error);
        swal('Error', 'Failed to delete movie', 'error');
      });
  };

  const handleAddMovie = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3030/add-movie', {
        name: newName,
        type: newType,
        director: newDirector,
        episodes: newEpisodes,
        rating: newRating,
        season: newSeason,
        studio: newStudio,
        genres: newGenres,
        overview: newOverview,
        videoUrl: videoUrl
      });

      swal('Success', 'New Anime added successfully', 'success');

      console.log('New movie added successfully');
      setNewName('');
      setNewType('');
      setNewDirector('');
      setNewEpisodes('');
      setNewRating('');
      setNewSeason('');
      setNewStudio('');
      setNewGenres('');
      setNewOverview('');
      setVideoUrl('');

      fetchMovies();
    } catch (error) {
      console.error('Error adding new movie:', error);
      swal('Error', 'Failed to add new anime', 'error');
    }
  };

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
                  <button className={`nav-item ${activeTab === 'movies' ? 'active' : ''}`} onClick={() => setActiveTab('movies')}>Anime List</button>
                  <button className={`nav-item ${activeTab === 'addMovie' ? 'active' : ''}`} onClick={() => setActiveTab('addMovie')}>Add Anime</button>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className={`setActiveTab ${sidebarOpen ? 'active' : ''}`}>
          {activeTab === 'movies' && (
            <div>
              <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Movies List</h1>
              <ul className="list-movies">
                {movies.map((movie, index) => (
                  <li key={movie.id} className="movie-item">
                    <span className="index">{index + 1}</span>
                    <span className="movie-name">{movie.ani_name}</span>
                    <span className="movie-image">
                      <img src={movie.imageUrl} alt={movie.ani_name} />
                    </span>
                    <Link to={`/admin/edit/${movie.id}`} className="edit-button">Edit</Link>
                    <button className="delete-button" onClick={() => deleteMovie(movie.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'addMovie' && (
            <div>
              <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Add New Movie</h1>
              <div className="anime-details">
                <div className="anime-info">
                  <h3>Name: </h3>
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
                    onChange=""
                  />
                  {"anime.imageUrl" && (
                    <img src="" alt="" className="anime-image" />
                  )}
                </div>
                <div className="anime-info">
                  <h3>Type: </h3>
                  <input
                    type="text"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  />
                </div>
                <div className="anime-info">
                  <h3>Director: </h3>
                  <input
                    type="text"
                    value={newDirector}
                    onChange={(e) => setNewDirector(e.target.value)}
                  />
                </div>
                <div className="anime-info">
                  <h3>Episodes: </h3>
                  <input
                    type="number"
                    value={newEpisodes}
                    onChange={(e) => setNewEpisodes(e.target.value)}
                  />
                </div>
                <div className="anime-info">
                  <h3>Rating: </h3>
                  <input
                    type="text"
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                  />
                </div>
                <div className="anime-info">
                  <h3>Season: </h3>
                  <input
                    type="text"
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value)}
                  />
                </div>
                <div className="anime-info">
                  <h3>Studio: </h3>
                  <input
                    type="text"
                    value={newStudio}
                    onChange={(e) => setNewStudio(e.target.value)}
                  />
                </div>
                <div className="anime-info">
                  <h3>Genres: </h3>
                  <input
                    type="text"
                    value={newGenres}
                    onChange={(e) => setNewGenres(e.target.value)}
                  />
                </div>
                <div className="anime-info">
                  <h3>Overview: </h3>
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
              </div>
              <button type="submit" onClick={handleAddMovie}>Add Movie</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
