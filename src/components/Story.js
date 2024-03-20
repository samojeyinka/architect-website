import React from 'react'
import {storyBanner, owner } from '../assets/images';
import '../stylesheets/StoryStyles.css';
import {FaUsers,FaLongArrowAltRight} from 'react-icons/fa'


const Story = () => {
    return (
        <section className='light-section story'>
            <div className='intro-flex'>
                <div className='intro-left'>
                        <div className='intro-banner-box'>
                            <img src={storyBanner} alt='arconnect'/>
                        </div>
                </div>
                <div className='intro-right'>
                        <div className='intro-content'>
                            <h3>Our Story Who we are</h3>
                            <p>Established in 1992, PT. Wahana Cipta operates as a General
Contracting company with a footprint that we have planted
throughout Indonesia. Initially, we focused on construction in
the field of residential housing development in Jakarta. 
As the company grows, now we are present as a reliable...</p>
                             
                                <button className='hero-btn sm-btn'>See more<FaLongArrowAltRight /></button>
        
                        </div>
                </div>
            </div>
        </section>
    )
}

export default Story