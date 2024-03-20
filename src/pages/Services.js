import React from 'react';
import Blog from '../components/Blog';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServicesComponent from '../components/Services'
const Services = () => {
    return (
        <>
            <Navbar />
            <div>
                <ServicesComponent />
            </div>
            <Footer />
        </>
    )
}

export default Services