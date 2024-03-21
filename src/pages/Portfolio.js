import React from 'react';
import '../stylesheets/AboutStyles.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PortfolioComponent from '../components/Projects'

const Portfolio = () => {
  return (
    <>
    <Navbar/>
    <div>
        <PortfolioComponent/>
    </div>
    <Footer/>
    </>
  )
}

export default Portfolio