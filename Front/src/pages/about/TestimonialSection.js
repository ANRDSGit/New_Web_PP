import React, { useState } from "react";
import Slider from "react-slick";
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor'; 

import polyImg from '../../assets/images/testimonial/poly.png'
import testiImg1 from '../../assets/images/testimonial/1.png'
import testiImg2 from '../../assets/images/testimonial/2.png'
import testiImg3 from '../../assets/images/testimonial/3.png'

import countIcon1 from '../../assets/images/counter/1.png'
import countIcon2 from '../../assets/images/counter/2.png'
import countIcon3 from '../../assets/images/counter/3.png'
import countIcon4 from '../../assets/images/counter/4.png'

const Testimonial = () => {


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

    // 
    
    
}

export default Testimonial;