import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

import countIcon1 from '../../assets/images/profile/2.png';
import countIcon2 from '../../assets/images/profile/3.png';
import countIcon3 from '../../assets/images/profile/4.png';
import profileicon from '../../assets/images/instructor/1.jpg';

const InstructorDetailsMain = () => {
    const [patient, setPatient] = useState(null); // To store patient info
    const [loading, setLoading] = useState(true); // Loading state for async data fetching 
    const navigate = useNavigate();
    const [countState, setCountState] = useState(true);
    const [totalRemoteAppointments, setTotalRemoteAppointments] = useState(0);
    const [totalPhysicalAppointments, setTotalPhysicalAppointments] = useState(0);

    useEffect(() => {
        const fetchTotalRemoteAppointments = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await axios.get('http://localhost:7000/api/auth/user/remoteCount', {
                    headers: { Authorization: `Bearer ${token}` }, // Pass the token in the request headers
                });
                setTotalRemoteAppointments(response.data.count); // Assuming the response contains a `count` field
            } catch (error) {
                console.error("Error fetching total physical appointments:", error);
            }
        };

        fetchTotalRemoteAppointments();
    }, []);

    useEffect(() => {
        const fetchTotalPhysicalAppointments = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await axios.get('http://localhost:7000/api/auth/user/physicalCount', {
                    headers: { Authorization: `Bearer ${token}` }, // Pass the token in the request headers
                });
                setTotalPhysicalAppointments(response.data.count); // Assuming the response contains a `count` field
            } catch (error) {
                console.error("Error fetching total physical appointments:", error);
            }
        };

        fetchTotalPhysicalAppointments();
    }, []); // Run on component mount

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
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log me out!',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/login');
                toast.success('Successfully logged out!');
            }
        });
    };

    const handleDeleteAccount = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will request account deletion. Please confirm!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, request deletion!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.post(
                        'http://localhost:7000/api/auth/request-delete-account',
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    toast.success('Deletion email sent! Please confirm via your inbox.');
                    navigate('/signup');
                } catch (error) {
                    toast.error('Failed to request account deletion');
                }
            }
        });
    };

    // Helper function to calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // If the current month is before the birth month or it's the birth month and the day is before the birth day, subtract 1 from age
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const counters = [
        {
            countNum: totalPhysicalAppointments,
            countTitle: 'Physical Appointments',
            countSubtext: '~',
            countIcon: countIcon1,
        },
        {
            countNum: totalRemoteAppointments,
            countTitle: 'Remote Appointments',
            countSubtext: '~',
            countIcon: countIcon2,
        },
        {
            countNum: 208,
            countTitle: '',
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

    // Calculate the patient's age if dateOfBirth exists
    const age = patient.dob ? calculateAge(patient.dob) : 'N/A';


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
                                <li>Age: <em>{age}</em> {/* Display calculated age */}</li>
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

                            <div className="profile-button-container">
                                <button className="follows" onClick={handleLogout}>
                                    LogOut
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                    >
                                        <path d="M400 32H288c-17.7 0-32 14.3-32 32v64h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64v64c0 17.7 14.3 32 32 32h112c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32z" />
                                    </svg>
                                </button>

                                <button className="follows delete" onClick={handleDeleteAccount}>
                                    Delete Profile
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                    >
                                        <path d="M400 32H288c-17.7 0-32 14.3-32 32v64h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64v64c0 17.7 14.3 32 32 32h112c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32z" />
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
