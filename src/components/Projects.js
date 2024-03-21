import React from 'react'
import { pro1, pro2, pro3, pro4 } from '../assets/images';
import { Link } from 'react-router-dom';
import '../stylesheets/BlogStyles.css';
import '../stylesheets/ProjectsStyles.css';
import {FaLongArrowAltRight} from 'react-icons/fa'

const Projects = () => {


    return (
        <section className='light-section project'>
            <div className='services'>
                <div className='services-top'>
                    <div className='st-left'>
                        <h3>Our collection best projects</h3>
                    </div>
                </div>
                <div className='services-btm'>
                    <div className='projects-flex'>
                    <div className='project-box pb-1'>
                            <img src={pro1} alt='project' />
                            <div className='pro-tag pt-1'>
                                <div className='pro-tag-left'>
                                        <h5>CKC Hotel</h5>
                                        <p>Project Completed</p>
                                </div>
                                <div className='pro-tag-right'>
                                        <Link to={"/"}><FaLongArrowAltRight/></Link>
                                </div>
                            </div>
                        </div>
                        <div className='project-box pb-2'>
                            <img src={pro2} alt='project' />
                            <div className='pro-tag pt-2'>
                                <div className='pro-tag-left'>
                                        <h5>Treasury Tower</h5>
                                        <p>Project Completed</p>
                                </div>
                                <div className='pro-tag-right'>
                                        <Link to={"/"}><FaLongArrowAltRight/></Link>
                                </div>
                            </div>
                        </div>
                        <div className='project-box pb-3'>
                            <img src={pro3} alt='project' />
                            <div className='pro-tag pt-3'>
                                <div className='pro-tag-left'>
                                        <h5>Carl Apartment</h5>
                                        <p>Project Completed</p>
                                </div>
                                <div className='pro-tag-right'>
                                        <Link to={"/"}><FaLongArrowAltRight/></Link>
                                </div>
                            </div>
                        </div>
                        <div className='project-box pb-4'>
                            <img src={pro4} alt='project' />
                            <div className='pro-tag pt-4'>
                                <div className='pro-tag-left'>
                                        <h5>Texas Duplex</h5>
                                        <p>Project Completed</p>
                                </div>
                                <div className='pro-tag-right'>
                                        <Link to={"/"}><FaLongArrowAltRight/></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Projects