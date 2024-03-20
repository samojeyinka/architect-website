import React from 'react'
import { comm, idr, res } from '../assets/images';
import '../stylesheets/ServicesStyles.css';

const Services = () => {
    return (
        <section className='light-section sv'>
            <div className='services'>
                <div className='services-top'>
                    <div className='st-left'>
                        <h3>Our Excellent Services</h3>
                    </div>
                    <div className='st-right'>
                        <p>Check out our best service you can possibly orders in building
                            your company and don't forget to ask via our email or our
                            customer service if you are interested in using our services</p>
                    </div>
                </div>
                <div className='services-btm'>
                    <div className='sb-flex'>
                        <div className='sb-box'>
                            <img src={idr} alt='Industrial' />
                            <b>Industrial</b>
                            <p>Industrial development is our main
                                line of business. We do Factory
                                Construction, Warehouse and others</p>
                        </div>
                        <div className='sb-box'>
                            <img src={comm} alt='Industrial' />
                            <b>Commercial</b>
                            <p>Our experience building in the
                                Commercial field includes Showrooms,
                                Supermalls and Office Buildings</p>
                        </div>
                        <div className='sb-box'>
                            <img src={res} alt='Industrial'/>
                            <b>Resedential</b>
                            <p>Residential development is the
                                beginning that has shaped us to this
                                day. Our development includes
                                Houses & Apartments</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Services