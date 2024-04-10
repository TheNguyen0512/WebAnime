import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../assets/css/style.css"
import "../assets/css/login.css"
import "../assets/css/topanime.css"
import logo from "../assets/images/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(null);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDropdownEnter = () => {
        setIsDropdownOpen(true);
    };

    const handleDropdownLeave = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3030/ani-genre');
                setGenres(response.data);
            } catch (error) {
                console.error('Error fetching anime genres:', error);
            }

            const token = localStorage.getItem('token');
            const userRole = parseInt(localStorage.getItem('isAdmin'));
            if (token) {
                setIsLoggedIn(true);
                setIsAdmin(userRole);
            }

            // Add event listeners
            const navOpenBtn = document.querySelector("[data-menu-open-btn]");
            const navCloseBtn = document.querySelector("[data-menu-close-btn]");
            const navbar = document.querySelector("[data-navbar]");
            const overlay = document.querySelector("[data-overlay]");

            const navElemArr = [navOpenBtn, navCloseBtn, overlay];

            for (let i = 0; i < navElemArr.length; i++) {
                navElemArr[i].addEventListener("click", function () {
                    navbar?.classList.toggle("active");
                    overlay?.classList.toggle("active");
                    document?.body.classList.toggle("active");
                });
            }

            const header = document.querySelector("[data-header]");
            window.addEventListener("scroll", function () {
                window.scrollY >= 10 ? header?.classList.add("active") : header?.classList.remove("active");
            });

            const goTopBtn = document.querySelector("[data-go-top]");
            window.addEventListener("scroll", function () {
                window.scrollY >= 500 ? goTopBtn?.classList.add("active") : goTopBtn?.classList.remove("active");
            });

            // Cleanup
            return () => {
                navElemArr.forEach(elem => {
                    elem.removeEventListener("click", () => {
                        navbar?.classList.toggle("active");
                        overlay?.classList.toggle("active");
                        document?.body.classList.toggle("active");
                    });
                });
                window.removeEventListener("scroll", () => {
                    window.scrollY >= 10 ? header?.classList.add("active") : header?.classList.remove("active");
                });
                window.removeEventListener("scroll", () => {
                    window.scrollY >= 500 ? goTopBtn?.classList.add("active") : goTopBtn?.classList.remove("active");
                });
            };
        };

        fetchData();

    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');

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

    const handleSearch = () => {
        axios.get(`http://localhost:3030/search?searchQuery=${searchQuery}`)
            .then(response => {
                navigate(`/search/${searchQuery}`);
            })
            .catch(error => {
                console.error('Error searching anime:', error);
            });
    };    

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setIsLoggedIn(false);
        setIsAdmin(null);
        navigate('/');
    };

    const handleGenreClick = (genreId) => {
        navigate(`/anime-genres/${genreId}`);
    };

    return (
        <header className="header" data-header>
            <div className="container">

                <div className="overlay" data-overlay></div>

                <Link to="/" className="logo">
                    <img src={logo} alt="Filmlane logo" />
                </Link>

                <div className="header-actions">
                    <div className="search-box">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search anime..."
                        />
                        <button type="submit1">
                            <FontAwesomeIcon icon={faSearch} size="lg" onClick={handleSearch} />
                        </button>
                    </div>
                    {isLoggedIn ? (
                        <>
                            <div
                                className="navbar-item"
                                onMouseEnter={handleDropdownEnter}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <FontAwesomeIcon icon={faUser} className="btn btn-second" />
                                {isDropdownOpen && (
                                    <ul className="dropdown-menu-btn">
                                        <li>
                                            <Link to="/profile" className="btn-third">
                                                Profile
                                            </Link>
                                            <Link to="/wishlist" className="btn-third">
                                                WishList
                                            </Link>
                                            <Link to="/favorite" className="btn-third">
                                                Favorite
                                            </Link>
                                            <Link to='/' className="btn-third" onClick={handleLogout}>
                                                Logout
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Sign in</Link>
                    )}
                </div>
                <button className="menu-open-btn" data-menu-open-btn>
                    <ion-icon name="reorder-two"></ion-icon>
                </button>
                <nav className="navbar" data-navbar>
                    <div className="navbar-top">
                        <Link to="/" className="logo">
                            <img src={logo} alt="Filmlane logo" />
                        </Link>
                        <button className="menu-close-btn" data-menu-close-btn>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <ul className="navbar-list">
                        <li>
                            <Link to="/" className="navbar-link">Home</Link>
                        </li>
                        <li className="navbar-item">
                            <span className="navbar-link">Anime Genre</span>
                            <ul className="dropdown-menu">
                                {genres.map(genre => (
                                    <li key={genre.id}>
                                        <button className="navbar-link" onClick={() => handleGenreClick(genre.id)}>{genre.ani_genry}</button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li>
                            <Link to="/top-anime" className="navbar-link">Top Anime</Link>
                        </li>
                    </ul>

                    <ul className="navbar-social-list">

                        <li>
                            <a href="#" className="navbar-social-link">
                                <ion-icon name="logo-twitter"></ion-icon>
                            </a>
                        </li>

                        <li>
                            <a href="#" className="navbar-social-link">
                                <ion-icon name="logo-facebook"></ion-icon>
                            </a>
                        </li>

                        <li>
                            <a href="#" className="navbar-social-link">
                                <ion-icon name="logo-pinterest"></ion-icon>
                            </a>
                        </li>

                        <li>
                            <a href="#" className="navbar-social-link">
                                <ion-icon name="logo-instagram"></ion-icon>
                            </a>
                        </li>

                        <li>
                            <a href="#" className="navbar-social-link">
                                <ion-icon name="logo-youtube"></ion-icon>
                            </a>
                        </li>

                    </ul>

                </nav>

            </div>
        </header>
    );
};
export default Header;