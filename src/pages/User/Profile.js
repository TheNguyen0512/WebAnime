import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import swal from 'sweetalert';

const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:3030/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    const { name, email } = response.data;
                    setUserName(name);
                    setUserEmail(email);
                    setIsLoggedIn(true);
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                });
        }
    }, []);

    const validatePassword = (newPassword) => {
        const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
        return strongPass.test(newPassword);
    };

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                if (!validatePassword(newPassword)) {
                    swal({
                        icon: "error",
                        title: 'Registration Error!',
                        text: 'Password should be at least 6 characters long, contain a special character, a lowercase and uppercase alphabet, and a number.'
                    });
                    return;
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);

                const response = await axios.post('http://localhost:3030/profile', {
                    name: newName,
                    password: hashedPassword
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                swal({
                    title: 'Update Successful!',
                    text: 'Update Successful',
                    icon: "success",
                })

                // Handle successful update
                console.log('Profile updated successfully', response.data);

            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <section className="profile">
            <div className='profile container'>
                <form className="form-profile">
                    <h1 className="sign">Profile</h1>
                    <div className="input-text">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder={userName}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div className="input-text">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={userEmail} readOnly />
                    </div>
                    <div className="input-with-icon">
                        <label htmlFor="name">Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button type="button" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                        </button>
                    </div>
                    <button className='signin-button' type="button" onClick={handleUpdateProfile}>Update Profile</button>
                </form>
            </div>
        </section>
    );
};
export default Profile;
