import React from 'react';
import { Link } from 'react-router-dom';

import icon1 from '../../assets/images/topics/icon.svg'
import icon2 from '../../assets/images/topics/icon2.svg'
import icon3 from '../../assets/images/topics/icon3.svg'

const Topics = () => {

    return (
        <div class="react_populars_topics react_populars_topics2 pt---100 pb---100">
            <div class="container"> 
                <div class="react__title__section react__title__section-all">
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <h6 className="wow animate__fadeInUp" data-wow-duration="0.3s"> # </h6>
                            <h2 class="react__tittle wow animate__fadeInUp" data-wow-duration="0.5s"> Why Choose Us? </h2>
                        </div>
                    </div>
                </div> 
                <div class="row pt---30">
                    <div class="col-md-4 wow animate__fadeInUp" data-wow-duration="0.3s">
                        <div class="item__inner">         
                            <div class="icon">
                                <img src={icon1} alt="Icon image" />
                            </div>
                            <div class="react-content">
                                <h3 class="react-title"><Link to="/about">Holistic Ayurvedic Care</Link></h3>
                                <p>We offer personalized, holistic care based on Ayurvedic principles.</p>
                                <Link to="/about"> Learn More <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></Link>
                            </div>                                    
                        </div>
                    </div>
                    <div class="col-md-4 wow animate__fadeInUp" data-wow-duration="0.5s">
                        <div class="item__inner">                                    
                            <div class="icon">
                                <img src={icon2} alt="Icon image" />
                            </div>
                            <div class="react-content">
                                <h3 class="react-title"><Link to="/about">Natural Healing Methods</Link></h3>
                                <p>Using natural herbs and treatments for a balanced, healthy life.</p>
                                <Link to="/about"> Learn More <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></Link>
                            </div>                                    
                        </div>
                    </div>
                    <div class="col-md-4 wow animate__fadeInUp" data-wow-duration="0.7s">
                        <div class="item__inner">                                    
                            <div class="icon">
                                <img src={icon3} alt="Icon image" />
                            </div>
                            <div class="react-content">
                                <h3 class="react-title"><Link to="/about">Expert Ayurvedic Doctors</Link></h3>
                                <p>Our team of qualified Ayurvedic doctors ensures the best care.</p>
                                <Link to="/about"> Learn More <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></Link>
                            </div>                                    
                        </div>
                    </div>                            
                </div>
            </div>
        </div>
    );
}

export default Topics;