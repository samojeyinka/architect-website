import React from 'react'
import { f1, f2, f3, f4 } from '../assets/images';
import '../stylesheets/ServicesStyles.css';
import '../stylesheets/FeaturesStyles.css';

const Features = () => {
    return (
        <section className='light-section features'>
            <div className='services'>
                <div className='services-top'>
                    <div className='st-left'>
                        <h3>What Make Us
                            Different?</h3>
                    </div>
                    <div className='st-right'>
                        <p>Explore our premier architectural services for your company's next project. Contact us via email or customer service for inquiries. Let's build something remarkable together!</p>
                    </div>
                </div>
                <div className='services-btm'>
                    <div className='sb-flex'>
                        <div className='sb-box'>
                            <img src={f1} alt='Industrial' />
                            <b>Experienced</b>
                            <p>Our experience of 25 years of
                                building and making
                                achievements in the world
                                of development</p>
                        </div>
                        <div className='sb-box'>
                            <img src={f2} alt='Industrial' />
                            <b>competitive price</b>
                            <p>The prices we offer you are
                                very competitive without
                                reducing the quality of the
                                company's work in the
                                slightest</p>
                        </div>
                        <div className='sb-box'>
                            <img src={f3} alt='Industrial' />
                            <b>On Time</b>
                            <p>We prioritize the quality of
                                our work and finish it on time</p>
                        </div>
                        <div className='sb-box'>
                            <img src={f4} alt='Industrial' />
                            <b>Best Materials</b>
                            <p>The material determines the
                                building itself so we
                                recommend that you use
                                the best & quality materials
                                in its class.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features