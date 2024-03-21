import React from 'react';
import { aboutimg } from '../assets/images';
import '../stylesheets/AboutStyles.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const About = () => {
    return (
        <>
        <Navbar/>
            <div className='about'>
                <div className='about-flex'>
                    <div className='about-left'>
                        <div className='al-top'>
                            <h2>
                                Our dream is to design tomorrow's world
                            </h2>
                        </div>
                        <div className='al-btm'>
                            <p>Welcome to Our Architectural Vision: Step into a world where design meets innovation, where every structure tells a story, and every detail is meticulously crafted. Discover the passion driving our team of architects, the projects that define our legacy, and the philosophy that guides our designs. Explore a portfolio of architectural marvels, from commercial skyscrapers to sustainable residential communities, showcasing our expertise and creativity. Get to know the talented individuals behind our architectural masterpieces, their unique skills, and their commitment to excellence. Reach out to us to discuss your architectural needs, collaborate on a project, or simply share your thoughts on our work.</p>
                        </div>
                    </div>
                    <div className='about-right'>
                        <div className='ar-top'>
                            <img src={aboutimg} alt='' />
                        </div>
                        <div className='ar-btm'>
                            <div className='ar-btm-stats'>
                                <div className='stat-box'>
                                    <h5>19.4</h5>
                                    <p>Years Experience</p>
                                </div>
                                <div className='stat-box'>
                                    <h5>302</h5>
                                    <p>Happy Clients</p>
                                </div>
                                <div className='stat-box'>
                                    <h5>900+</h5>
                                    <p>YProjects Delivered</p>
                                </div>
                                <div className='stat-box'>
                                    <h5>$15M+</h5>
                                    <p>Net Profit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default About