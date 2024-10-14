import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import axios from 'axios';

import countIcon1 from '../../assets/images/profile/2.png'
import countIcon2 from '../../assets/images/profile/3.png'
import countIcon3 from '../../assets/images/profile/4.png'

import courses from '../../data/Courses.json';
import instructors from '../../data/Instructors.json';

const ProfileDetailsMain = () => {
    const location = useLocation();
    const postURL = location.pathname.split('/');
    const [patient, setPatient] = useState(null); // To store patient info
    const navigate = useNavigate();

    const instructor = instructors.find((b) => b.id === Number(postURL[2]));

    const [state, setState] = useState(true);


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


    const counters = [
        {
            countNum: 28,
            countTitle: 'Foreign followers',
            countSubtext: 'k',
            countIcon: countIcon1,
        },
        {
            countNum: 10,
            countTitle: 'Classes complete',
            countSubtext: 'k',
            countIcon: countIcon2,
        },
        {
            countNum: 208,
            countTitle: 'Students enrolled',
            countSubtext: 'k',
            countIcon: countIcon3,
        }

    ];

    return (
        <>
            <div className="profile-top back__course__area pt---120 pb---90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <img src={require(`../../assets/images/instructors/${instructor.image}`)} alt={instructor.name} />
                            <Link to="#" className="follows">
                                LogOut
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    width="23" // Set width to fit your design
                                    height="23" // Set height to fit your design
                                    fill="currentColor" // Use current color to adapt to your styling
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-log-out"
                                    style={{ marginLeft: '10px' }} // Change class name as needed
                                >
                                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                                </svg>
                            </Link>

                        </div>
                        <div className="col-lg-8">
                            <ul className="user-section">
                                <li className="user">
                                    <span className="name">Name:</span><em>{instructor.name}</em>
                                </li>
                                <li>Job Title:<em>{instructor.designation}</em> </li>
                                <li>Phone:<em>{instructor.phone}</em> </li>
                                <li>Email:<em>{instructor.email}</em> </li>
                                <li className="social">
                                    Follow: <em>
                                        <Link to="#"><span aria-hidden="true" className="social_facebook"></span></Link>
                                        <Link to="#"><span aria-hidden="true" className="social_twitter"></span></Link>
                                        <Link to="#"><span aria-hidden="true" className="social_linkedin"></span></Link>
                                    </em>
                                </li>
                            </ul>
                            <h3>Biography</h3>
                            <p>{instructor.bio}</p>
                            <p>Only a quid me old mucker squiffy tomfoolery grub cheers ruddy cor blimey guvnor in my flat, up the duff Eaton car boot up the kyver pardon you A bit of how's your father David skive off sloshed, don't get shirty with me chip shop vagabond crikey bugger Queen's English chap. Matie boy nancy boy bite your arm off up the kyver old no biggie fantastic boot, David have it show off show off pick your nose and blow off lost the plot porkies bits and bobs only a quid bugger all mate.</p>
                            {counters &&
                                <div className="count__area2">
                                    <ul className="row">
                                        {counters.map((counter, num) => (
                                            <li key={num} className="col-lg-4">
                                                <div className="count__content">
                                                    <div className="icon">
                                                        <img src={counter.countIcon} alt="profile" />
                                                    </div>
                                                    <div className="text">
                                                        <CountUp start={state ? 0 : counter.countNum} end={counter.countNum} duration={10} onEnd={() => setState(false)} />
                                                        {({ countUpRef, start }) => (
                                                            <VisibilitySensor onChange={start} delayedCall>
                                                                <span ref={countUpRef} />
                                                                <span className="count__content-title counter">{counter.countNum}</span>
                                                            </VisibilitySensor>
                                                        )}

                                                        <em>{counter.countSubtext}</em>
                                                        <p>{counter.countTitle}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}


export default ProfileDetailsMain;