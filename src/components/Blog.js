import React from 'react'
import { blog1,blog2,blog3 } from '../assets/images';
import '../stylesheets/ServicesStyles.css';
import { Link } from 'react-router-dom';
import '../stylesheets/BlogStyles.css';

const Blog = () => {
    return (
        <section className='light-section blog'>
            <div className='services'>
                <div className='services-top'>
                    <div className='st-left'>
                        <h3>News & Update</h3>
                    </div>
                </div>
                <div className='services-btm'>
                    <div className='sb-flex'>
                        <div className='sb-box'>
                            <img src={blog1} alt='Industrial' />
                            <div className='date-title'><span><h5>12</h5><h6>Jan</h6></span><b>Elements of Content in Epoxy Paint</b></div>
                            <p>Epoxy paint and epoxy floor
                                contractor. Have you heard the two
                                terms? And what does that have to
                                do with the construction of existing
                                buildings? Epoxy itself is included in
                                the type of resin...<Link to={"/"}>Read more</Link></p>
                        </div>

                        <div className='sb-box'>
                            <img src={blog2} alt='Industrial' />
                            <div className='date-title'><span><h5>12</h5><h6>Jan</h6></span><b>5 Right Steps in Warehouse Planning and Construction</b></div>
                            <p>Planning the construction of a
                                warehouse for both industrial,
                                personal and other goods storage
                                must be done carefully.
                                When the planning is done properly,
                                the construction is...<Link to={"/"}>Read more</Link></p>
                        </div>

                        <div className='sb-box'>
                            <img src={blog3} alt='Industrial' />
                            <div className='date-title'><span><h5>12</h5><h6>Jan</h6></span><b>The Right Solution to Build a Sturdy Type 45 House</b></div>
                            <p>Having a solid home is certainly
                                everyone's dream. How not, the
                                house is a place where the residents
                                can rest and take shelter from the
                                bad weather...<Link to={"/"}>Read more</Link></p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Blog