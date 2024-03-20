import React from 'react';
import Blog from '../components/Blog';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Articles = () => {
  return (
    <>
    <Navbar/>
    <div>
        <Blog/>
    </div>
<Footer/>
    </>
  )
}

export default Articles