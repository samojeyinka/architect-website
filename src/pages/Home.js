import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Sponsors from '../components/Sponsors'
import Services from '../components/Services'
import Features from '../components/Features'
import Intro from '../components/Intro'
import Story from '../components/Story'

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
   </main>
  )
}

export default Home