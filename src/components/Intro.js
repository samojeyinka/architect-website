import React from 'react'
import {introBanner, owner } from '../assets/images';
import '../stylesheets/IntroStyles.css';
import {FaUsers,FaLongArrowAltRight} from 'react-icons/fa'


const Intro = () => {
    return (
        <section className='light-section intro'>
            <div className='intro-flex'>
                <div className='intro-left'>
                        <div className='intro-banner-box'>
                            <img src={introBanner} alt='arconnect'/>
                        </div>
                </div>
                <div className='intro-right'>
                        <div className='intro-content'>
                            <h3>Meet and talk with our best architecture</h3>
                            <p>All our teams are professional and competent in
their fields and will help you realize your dream
building with the excellent result.</p>
                                <div className='intro-btns'>
                                <button className='hero-btn team-btn'>Team<FaUsers /></button>
                <button className='hero-btn hw-btn'>How it works<FaLongArrowAltRight /></button>
                                </div>
                        </div>
                </div>
                    <div className='over-card'>
                            <div className='oc-flex'>
                                    <img src={owner} alt=''/>
                                    <h5>Dianne Russell</h5>
                                    <p>More than 20 years of experience
in the field architecture and has
worked on project up to 100+</p>
                            </div>
                    </div>
            </div>
        </section>
    )
}

export default Intro