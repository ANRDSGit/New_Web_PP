import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

import countIcon1 from '../../assets/images/profile/2.png';
import countIcon2 from '../../assets/images/profile/3.png';
import countIcon3 from '../../assets/images/profile/4.png';
import profileicon from '../../assets/images/instructor/1.jpg';

const InstructorDetailsMain = () => {
    const [patient, setPatient] = useState(null); // To store patient info
    const [loading, setLoading] = useState(true); // Loading state for async data fetching 
    const navigate = useNavigate();
    const [countState, setCountState] = useState(true);

    useEffect(() => {
        const fetchPatientProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await axios.get('http://localhost:7000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatient(response.data);
            } catch (error) {
                console.error('Error fetching patient profile', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token to logout
        navigate('/login'); // Redirect to login page
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            // Call the request-delete-account route instead of directly deleting
            const response = await axios.post(
                'http://localhost:7000/api/auth/request-delete-account', 
                {}, 
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // Notify the user that an email has been sent for confirmation
            alert('A confirmation email has been sent to your email address. Please check your inbox to confirm account deletion.');
            navigate('/signup');
        } catch (error) {
            console.error('Error requesting account deletion', error);
            alert('Failed to request account deletion. Please try again.');
        }
    };

    const counters = [
        {
            countNum: 2,
            countTitle: 'Appointments',
            countSubtext: '~',
            countIcon: countIcon1,
        },
        {
            countNum: 10,
            countTitle: 'Classes complete',
            countSubtext: '~',
            countIcon: countIcon2,
        },
        {
            countNum: 208,
            countTitle: 'Students enrolled',
            countSubtext: '~',
            countIcon: countIcon3,
        }
    ];

    if (loading) {
        return <div>Loading...</div>; // Show a loading state while fetching the data
    }

    if (!patient) {
        return <div>Error: No patient data found</div>; // Handle the case where the patient data is not available
    }

    return (
        <>
            <div className="profile-top back__course__area pt---120 pb---90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <img src={profileicon} alt={patient.name || 'Unknown'} /> {/* Add a default image */}

                        </div>
                        <div className="col-lg-8">
                            <ul className="user-section">
                                <li className="user">
                                    <span className="name">Name:</span>
                                    <em>{patient.name || 'Unknown'}</em> {/* Safe access to patient properties */}
                                </li>
                                <li>Phone: <em>{patient.number || 'N/A'}</em> </li>
                                <li>Email: <em>{patient.email || 'N/A'}</em> </li>
                                <li>Blood Group: <em>{patient.bloodGroup || 'N/A'}</em> </li>
                                <li>Gender: <em>{patient.gender || 'N/A'}</em> </li>
                            </ul>
                            {counters && (
                                <div className="count__area2">
                                    <ul className="row">
                                        {counters.map((counter, num) => (
                                            <li key={num} className="col-lg-4">
                                                <div className="count__content">
                                                    <div className="icon">
                                                        <img src={counter.countIcon} alt="profile" />
                                                    </div>
                                                    <div className="text">
                                                        <VisibilitySensor>
                                                            {({ isVisible }) => (
                                                                <div>
                                                                    {isVisible ? (
                                                                        <CountUp
                                                                            start={countState ? 0 : counter.countNum}
                                                                            end={counter.countNum}
                                                                            duration={3}
                                                                            onEnd={() => setCountState(false)}
                                                                        />
                                                                    ) : null}
                                                                    <span className="count__content-title counter">{counter.countSubtext}</span>
                                                                </div>
                                                            )}
                                                        </VisibilitySensor>
                                                        <p>{counter.countTitle}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="col-lg-8">
                                <button
                                    className="follows"
                                    onClick={handleLogout} // Use button for logout action
                                >
                                    LogOut
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="23"
                                        height="23"
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                        className="feather feather-log-out"
                                        style={{ marginLeft: '4px' }} // Add a left margin for the gap
                                    >
                                        <path d="M400 32H288c-17.7 0-32 14.3-32 32v64h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64v64c0 17.7 14.3 32 32 32h112c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm-48 368H288v-64h64v64zm0-128H288v-64h64v64zM160 128H96c-17.7 0-32 14.3-32 32v256c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96V160h64c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
                                    </svg>
                                </button>

                                <button
                                    className="follows"
                                    onClick={handleDeleteAccount} // Trigger delete confirmation request
                                >
                                    Delete Profile
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="23"
                                        height="23"
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                        className="feather feather-log-out"
                                        style={{ marginLeft: '4px' }} // Add a left margin for the gap
                                    >
                                        <path d="M400 32H288c-17.7 0-32 14.3-32 32v64h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64v64c0 17.7 14.3 32 32 32h112c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm-48 368H288v-64h64v64zm0-128H288v-64h64v64zM160 128H96c-17.7 0-32 14.3-32 32v256c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96V160h64c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InstructorDetailsMain;
