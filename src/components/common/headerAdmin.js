import React, { useState, useEffect } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/admin1.css'; // Import CSS file for HeaderAdmin
import logo from "../assets/images/logo.svg";

const HeaderAdmin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const [userName, setuserName] = useState(null);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const Name = localStorage.getItem('userName');

    if (Name) {
      setuserName(Name);
    }

    if (!token) {
      // If not logged in, redirect to login page if trying to access certain routes
      if (['/favorite', '/wishlist', '/profile'].includes(location.pathname) || location.pathname.startsWith('/admin')) {
        navigate('/login');
      }
    } else {
      // If logged in, prevent access to login and register pages based on user role
      if (isAdmin === 1) { // Check for admin role
        if (['/login', '/register'].includes(location.pathname)) {
          navigate('/admin');

        }
      } else if (isAdmin === 2) { // Check for user role
        if (['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin')) {
          navigate('/');
        }
      }
    }
  }, [location.pathname, isAdmin, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(null);
    navigate('/');
  };

  return (
    <header className="header1">
      <div className="header1-content">
        <div className="search-box">
          <img src={logo} alt="Filmlane logo" />
        </div>
        <div className="header-actions">
          <div className="profile-dropdown">
            <a href="#">
              <span className="user-info">
                <span>{userName}</span>
              </span>
              <span className="avatar"></span>
            </a>
          </div>
          <div className="dropdown-wrapper">
            <button onClick={handleDropdownToggle}>
              <FontAwesomeIcon icon={dropdownOpen ? faChevronUp : faChevronDown} />
            </button>
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <button onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
