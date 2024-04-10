import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

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

  // Function to delete a movie by ID
  const deleteMovie = (id) => {
    // Send a request to delete the movie
    axios.delete(`http://localhost:3030/anime/${id}`)
      .then(response => {
        console.log('Movie deleted successfully');

        // Refresh movie list after deletion
        fetchMovies();

        // Display success notification
        swal('Success', 'Movie deleted successfully', 'success');
      })
      .catch(error => {
        console.error('Error deleting movie:', error);
        // Display error notification
        swal('Error', 'Failed to delete movie', 'error');
      });
  };


  // Function to handle the form submission for adding a new movie
  const handleAddMovie = async (event) => {
    event.preventDefault();

    // Thực hiện gửi yêu cầu POST để thêm bộ phim mới
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
      // Clear input fields
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

      // Refresh movie list after addition
      fetchMovies();
    } catch (error) {
      console.error('Error adding new movie:', error);
      swal('Error', 'Failed to add new anime', 'error');
    }
  };

  return (
    <section className="profile">
      <div className="profile container">
        <div>
          <div className="admin-navbar">
            <div className="nav-item-container">
              <button className={`nav-item ${activeTab === 'movies' ? 'active' : ''}`} onClick={() => setActiveTab('movies')}>Anime List</button>
              <button className={`nav-item ${activeTab === 'addMovie' ? 'active' : ''}`} onClick={() => setActiveTab('addMovie')}>Add Anime</button>
            </div>
          </div>
          <div className='nav-item active' >
            {activeTab === 'movies' && (
              <div>
                <h2>Movies List</h2>
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
                <h2>Add New Movie</h2>
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
                      onChange=""
                    />
                    {"anime.imageUrl" && (
                      <img src="" alt="" className="anime-image" />
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
                </div>

                <button type="submit" onClick={handleAddMovie}>Add Movie</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Admin;
