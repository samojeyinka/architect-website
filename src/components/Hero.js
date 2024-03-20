import React, { useState } from 'react';
import '../stylesheets/HeroStyles.css'
import { Link } from 'react-router-dom';
import { FaArrowCircleRight, FaCalculator, FaCheckCircle, FaAngleRight, FaYoutube } from 'react-icons/fa';
import { bgImg, heroImage } from '../assets/images';
import ScrollReveal from 'scrollreveal';


const Hero = () => {
  ScrollReveal().reveal('.headline');
  ScrollReveal().reveal('.hero-text', { delay: 500 });
  ScrollReveal().reveal('.punchline', { delay: 2000 });
  return (
    <>


      <section className='hero-section'>

        <div className='hero'>
          <img src={bgImg} className='hero-bg' alt='background image' />

          <div className='hero-content'>
            <div className='hero-text'>
              <h1>We Provide Architectural design
                and Constructions</h1>
              <p className='ht-p'>
                More than 100 building and housing projects that we have built.
                The building owner chose us over other contractors in Jakarta,
                because our work is different
              </p>

              <div className='hero-btns'>
                <button className='hero-btn book-btn'>Discover More <FaCheckCircle /></button>
                <button className='hero-btn learn-btn'>Youtube<FaYoutube /></button>

              </div>

              <div className='stat-con'>
                <div className='stat-box'>
                  <h4>300<span>+</span></h4>
                  <p>Happy clients</p>
                </div>
                <div className='stat-box'>
                  <h4>900<span>+</span></h4>
                  <p>Amazing projects</p>
                </div>
                <div className='stat-box'>
                  <h4>20<span>+</span></h4>
                  <p>Award winning</p>
                </div>
              </div>

            </div>
            <div className='hero-image'>
              <img src={heroImage} className='hero-img' />
              <div className='hero-banner'>
                <div className='hero-banner-flex'>
                  <div>
                    <h5>arconnect</h5>
                    <p>Project</p>
                  </div>
                  <div>
                    <h5>15 Years </h5>
                    <p>Operated</p>
                  </div>
                  <div>
                    <p>As a trusted general project that has been
                      operating for 25 years, our commitment is
                      always to prioritize our client satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>


    </>
  )
}

export default Hero