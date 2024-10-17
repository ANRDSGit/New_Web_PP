import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor'; 
import axios from 'axios';

import polyImg from '../../assets/images/testimonial/poly.png';
import testiImg1 from '../../assets/images/testimonial/1.png';
import testiImg2 from '../../assets/images/testimonial/2.png';
import testiImg3 from '../../assets/images/testimonial/3.png';

import countIcon1 from '../../assets/images/counter/1.png';
import countIcon2 from '../../assets/images/counter/2.png';
import countIcon3 from '../../assets/images/counter/3.png';
import countIcon4 from '../../assets/images/counter/4.png';

const Testimonial = () => {
    const [state, setState] = useState(true);
    const [totalPhysicalAppointments, setTotalPhysicalAppointments] = useState(0);
    const [totalRemoteAppointments, setTotalRemoteAppointments] = useState(0);
    const [totalPatients, setTotalPatients] = useState(0);

    const sliderSettings = {
        dots: false,
        arrows: true,
        infinite: true,
        margin: 0,
        centerMode: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: true,
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                }
            }
        ]
    };

    const counters = [
        {
            countNum: totalPhysicalAppointments,  // This will be updated by API
            countTitle: 'Total Physical Appointments',
            countSubtext: '',
            countIcon: countIcon1,
        },
        {
            countNum: totalRemoteAppointments,
            countTitle: 'Total Remote Appointments',
            countSubtext: '',
            countIcon: countIcon2,
        },
        {
            countNum : totalPatients,
            countTitle: 'Registered Patients',
            countSubtext: '',
            countIcon: countIcon3,
        },
        {
            countNum : 10,
            countTitle: 'Years of Experience',
            countSubtext: '',
            countIcon: countIcon4,
        }
    ];

    // Fetch total physical appointments when component mounts
    useEffect(() => {
        const fetchTotalPhysicalAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/auth/appointments/physical-count'); // Replace with your actual backend route
                setTotalPhysicalAppointments(response.data.count);
            } catch (error) {
                console.error("Error fetching total physical appointments:", error);
            }
        };

        fetchTotalPhysicalAppointments();
    }, []);
    useEffect(() => {
        const fetchTotalRemoteAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/auth/appointments/remote-count'); // Replace with your actual backend route
                setTotalRemoteAppointments(response.data.count);
            } catch (error) {
                console.error("Error fetching total remote appointments:", error);
            }
        };

        fetchTotalRemoteAppointments();
    }, []);
    useEffect(() => {
        const fetchTotalPatients = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/auth/total-patients'); // Replace with your actual backend route
                setTotalPatients(response.data.count);
            } catch (error) {
                console.error("Error fetching total patients:", error);
            }
        };

        fetchTotalPatients();
    }, []);

    return (
        <div className="student_satisfaction-section pt---110 pb---120">
            <div className="container"> 
                <div className="react__title__section-all pb---30">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h6 className="wow animate__fadeInUp" data-wow-duration="0.3s">Patient Satisfaction</h6>
                            <h2 className="react__tittle wow animate__fadeInUp" data-wow-duration="0.5s">Patient Feedback</h2>
                        </div>                                
                    </div>                            
                </div>                       

                {/* Testimonial Slider */}
                <div className="feedreact-slider owl-carousel">
                    <Slider {...sliderSettings}>
                        {/* Testimonial cards go here */}
                    </Slider>
                </div>
            </div>

            {/* Counters Section */}
            {counters &&
                <div className="count__area2 pb---100">
                    <div className="container">  
                        <ul className="row">
                            {counters.map((counter, num) => (  
                                <li key={num} className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6">
                                    <div className="count__content">
                                        <div className="icon">
                                            <img src={counter.countIcon} alt="icon" />
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
                                            <p className="count__content">{counter.countTitle}</p> 
                                        </div>                                           
                                    </div>
                                </li>
                            ))} 
                        </ul>                             
                    </div>
                </div>
            }
        </div>
    );
};

export default Testimonial;
