import React, { useState } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/header';
import Footer from '../../components/common/footer';

const Register = () => {
    const [register, setRegister] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        errorCode: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRegister({ ...register, [name]: value });
    };

    const validateEmail = (email) => {
        const mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return mailformat.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
        return strongPass.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { name, email, password, confirmPassword } = register;

        if (name === '' || email === '' || password === '' || confirmPassword === '') {
            swal({
                icon: "error",
                title: 'Registration Error!',
                text: 'All fields are required'
            });
            return;
        }

        if (!validateEmail(email)) {
            swal({
                icon: "error",
                title: 'Registration Error!',
                text: 'Email address is invalid'
            });
            return;
        }

        if (!validatePassword(password)) {
            swal({
                icon: "error",
                title: 'Registration Error!',
                text: 'Password should be at least 6 characters long, contain a special character, a lowercase and uppercase alphabet, and a number.'
            });
            return;
        }

        if (password !== confirmPassword) {
            swal({
                icon: "error",
                title: 'Registration Error!',
                text: "Passwords don't match"
            });
            return;
        }

        try {
            const emailCheckResponse = await axios.post('http://localhost:3030/check-email', {
                email
            });

            if (emailCheckResponse.data.exists) {
                setRegister({ ...register, errorCode: 'Email address is already registered' });
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const response = await axios.post('http://localhost:3030/register', {
                name,
                email,
                password: hashedPassword
            });

            if (response.status === 200) {
                swal({
                    icon: "success",
                    title: 'Registration Successful!',
                    text: 'Happy to have you aboard',
                    type: 'success'
                }).then(() => {
                    navigate('/login');
                });
                setRegister({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    errorCode: ''
                });
            } else {
                throw new Error('Error registering user');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setRegister({ ...register, errorCode: 'Email address is already registered' });
            } else {
                console.error(error);
                setRegister({ ...register, errorCode: 'Error registering user' });
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPassword(!showConfirmPassword);
    };

    return (
        <div>
            <Header />
            <section className='loginul'>
                <div className='container'>
                    <div className="login-div">
                        <Link to="/login" className='back-button'>Back</Link>
                        <form className='login' onSubmit={handleSubmit}>
                            <h1 className="sign">Sign Up</h1>
                            <div id="errormessage">{register.errorCode && <p>{register.errorCode}</p>}</div>
                            <div className="input-text">
                                <input type="text" name="name" placeholder="Enter your name" value={register.name} onChange={handleInputChange} />
                            </div>
                            <div className="input-text">
                                <input type="email" name="email" placeholder="Enter your Email" value={register.email} onChange={handleInputChange} />
                            </div>
                            <div className="input-with-icon">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={register.password}
                                    onChange={handleInputChange}
                                />
                                <button type="button" onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                </button>
                            </div>
                            <div className="input-with-icon">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={register.confirmPassword}
                                    onChange={handleInputChange}
                                />
                                <button type="button" onClick={toggleConfirmPasswordVisibility}>
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                                </button>
                            </div>
                            <button className='signin-button' type='submit'>Sign Up</button>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Register;
