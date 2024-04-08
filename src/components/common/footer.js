import React from 'react';
import "../assets/css/style.css";
import "../assets/css/admin.css";
import { Link } from 'react-router-dom';
import logo from "../assets/images/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faPinterest, faLinkedin } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-top">
                <div className="container">

                    <div className="footer-brand-wrapper">

                        <Link to="/" className="logo">
                            <img src={logo} alt="Filmlane logo" />
                        </Link>

                        <ul className="footer-list">

                            <li>
                                <Link to="/" className="footer-link">Home</Link>
                            </li>


                            <li>
                                <a href="#" className="footer-link">Movie</a>
                            </li>

                            <li>
                                <a href="#" className="footer-link">TV Show</a>
                            </li>

                            <li>
                                <a href="#" className="footer-link">Web Series</a>
                            </li>

                            <li>
                                <a href="#" className="footer-link">Pricing</a>
                            </li>

                        </ul>

                    </div>

                    <div className="divider"></div>

                    <div className="quicklink-wrapper">

                        <ul className="quicklink-list">

                            <li>
                                <a href="#" className="quicklink-link">Faq</a>
                            </li>

                            <li>
                                <a href="#" className="quicklink-link">Help center</a>
                            </li>

                            <li>
                                <a href="#" className="quicklink-link">Terms of use</a>
                            </li>

                            <li>
                                <a href="#" className="quicklink-link">Privacy</a>
                            </li>

                        </ul>

                        <ul className="social-list">
                            <li>
                                <a href="#" className="social-link">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="social-link">
                                    <FontAwesomeIcon icon={faTwitter} />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="social-link">
                                    <FontAwesomeIcon icon={faPinterest} />
                                </a>
                            </li>
                            <li>
                                <a href="#" className="social-link">
                                    <FontAwesomeIcon icon={faLinkedin} />
                                </a>
                            </li>
                        </ul>


                    </div>

                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">

                    <p className="copyright">
                        &copy; 2022 <a href="#">codewithsadee</a>. All Rights Reserved
                    </p>

                    <img src="./assets/images/footer-bottom-img.png" alt="Online banking companies logo" className="footer-bottom-img" />

                </div>
            </div>

        </footer>

    );
};

export default Footer;
