import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [previousLocation, setPreviousLocation] = useState(null);

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const previousPath = localStorage.getItem('previousPath');
        if (previousPath && previousPath !== '/') {
            setPreviousLocation(previousPath);
        }
    }, []);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3030/login', {
                email,
                password
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);

                const userName = response.data.userName;
                localStorage.setItem('userName', userName);

                const userEmail = response.data.userEmail;
                localStorage.setItem('userEmail', userEmail);

                const Admin = response.data.isAdmin;
                localStorage.setItem('isAdmin', Admin);
                localStorage.setItem('previousPath', location.pathname);

                swal({
                    title: 'Login Successful!',
                    text: 'Welcome back ' + userName,
                    icon: "success",
                }).then(() => {
                    if (Admin === 1) {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                swal({
                    icon: "error",
                    title: 'Login Error!',
                    text: 'Invalid email or password'
                });
            } else if (error.response && error.response.status === 402) {
                swal({
                    icon: "error",
                    title: 'Login Error!',
                    text: 'Email does not exist'
                });
            } else {
                swal({
                    icon: "error",
                    title: 'Login Error!',
                    text: 'An error occurred. Please try again later.'
                });
                setErrorMessage("")
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <section className='loginul'>
            <div className='container'>
                <div className="login-div">
                    <form className="login" onSubmit={handleSubmit}>
                        <h1 className="sign">Sign In</h1>
                        <div id="errormessage">{errorMessage && <p>{errorMessage}</p>}</div>
                        <span className="seperator"></span>

                        <div className="input-text">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className="input-with-icon">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button type="button" onClick={togglePasswordVisibility}>
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <button className='signin-button' type='submit'>Sign In</button>
                        <div className="login-face">
                            <div className="new-members">
                                Do not have an account??
                                <Link to="/register" className="signup-link"> Sign Up Here.</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
