import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/header';
import Footer from '../../components/common/footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();


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

                const userRole = response.data.userRole;
                localStorage.setItem('isAdmin', userRole);

                swal({
                    title: 'Login Successful!',
                    text: 'Welcome back ' + userName + userRole,
                    icon: "success",
                }).then(() => {
                    if (userRole === 1) {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Invalid email or password");
            } else if (error.response && error.response.status === 402) {
                setErrorMessage("Email does not exist");
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <Header />
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
            <Footer />
        </div>
    );
};

export default Login;
