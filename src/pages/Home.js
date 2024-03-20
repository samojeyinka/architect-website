import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Sponsors from '../components/Sponsors'
import Services from '../components/Services'
import Features from '../components/Features'
import Intro from '../components/Intro'
import Story from '../components/Story'
import Blog from '../components/Blog'
import Projects from '../components/Projects'
import Footer from '../components/Footer'

const Home = () => {
  return (
   <main>
   <Navbar/>
   <Hero/>
   <Sponsors/>
   <Services/>
   <Features/>
   <Intro/>
   <Story/>
   <Blog/>
   <Projects/>
   <Footer/>
   </main>
  )
}

export default Home