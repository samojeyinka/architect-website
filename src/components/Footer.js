import React from 'react';
import { logo } from '../assets/images';
import { Link } from 'react-router-dom';
import { ctm1 } from '../assets/images';
import { FaLongArrowAltLeft, FaLongArrowAltRight, FaTwitter, FaGithub, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import '../stylesheets/FooterStyles.css';
const Footer = () => {
    return (
        <section className='footer-section'>
            <div className='review'>
                <div className='review-flex'>
                    <div className='rf-left'>
                        <div className='rf-left-img-box'>
                            <img src={ctm1} />
                        </div>
                        <div className='rev-box'>
                            <h4>Jocob Molen</h4>
                            <p>We like the final result this project,
                                in extraordinary and also provides
                                the best service to the client </p>
                        </div>
                    </div>
                    <div className='rf-right'>
                        <h3>What we have done  &
                            what our Customers say</h3>
                        <p>We are to help you build a excellent build, with
                            us nothing is impossible. See what we have done
                            and what they have to say about our work perform.</p>
                        <div className='rev-btns'>
                            <i className='arrow left'><FaLongArrowAltLeft /></i>
                            <i className='arrow right'><FaLongArrowAltRight /></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className='dark-bg'>
                <div className='footer-large'>
                    <footer>
                        <div className='footer-left'>
                            <Link to='/'>
                                <div className='f-logo-flex'>
                                    <img src={logo} className='f-logo-img' />
                                    <span className='f-logo-text'>arconnect</span>
                                </div>
                            </Link>

                            <p>is a general contractor company based in Jakarta. More than 25 years of experience in building and carving out Indonesia's development.</p>
                            <div className='f-links'>
                                <a href="https://github.com/samojeyinka" target='_blank' className='f_social_icon'><FaTwitter /></a>
                                <a href="https://linkedin.com/in/ojeyinka-samuel-02406125a" target='_blank' className='f_social_icon'><FaGithub /></a>
                                <a href="https://wa.me/2348122624063" target='_blank' className='f_social_icon'><FaWhatsapp /></a>
                                <a href="https://twitter.com/sam_ojeyinka" target='_blank' className='f_social_icon'><FaLinkedin /></a>

                            </div>
                        </div>
                        <div className='footer-md'>
                            <div className='company'>
                                <h5>Company</h5>
                                <ul>
                                    <li><Link to='/'>About</Link> </li>
                                    <li><Link to='/'>How it Works</Link> </li>
                                    <li><Link to='/'>Team</Link> </li>
                                    <li><Link to='/'>Privacy Policy</Link> </li>
                                </ul>
                            </div>
                        </div>
                        <div className='footer-right'>
                            <div className='more'>
                                <h5>More</h5>
                                <ul>
                                    <li><Link to='/'>Documentation</Link> </li>
                                    <li><Link to='/'>License</Link> </li>
                                </ul>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </section>
    )
}

export default Footer