import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faFilm, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import required icons
import '../assets/css/admin1.css';

const Sidebar = ({ setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav>
          <ul>
            <li>
              <button className="sidebar-button" onClick={() => setActiveTab('movies')}>
                <FontAwesomeIcon icon={faFilm} /> Movies
              </button>
            </li>
            <li>
              <button className="sidebar-button" onClick={() => setActiveTab('addMovie')}>
                <FontAwesomeIcon icon={faPlus} /> Add Movie
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
