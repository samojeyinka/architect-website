import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Sponsors from '../components/Sponsors'
import Services from '../components/Services'
import Features from '../components/Features'
import Intro from '../components/Intro'

const Home = () => {
  return (
   <main>
   <Navbar/>
   <Hero/>
   <Sponsors/>
   <Services/>
   <Features/>
   <Intro/>
   </main>
  )
}

export default Home