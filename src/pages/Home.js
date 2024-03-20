import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Sponsors from '../components/Sponsors'
import Services from '../components/Services'

const Home = () => {
  return (
   <main>
   <Navbar/>
   <Hero/>
   <Sponsors/>
   <Services/>
   </main>
  )
}

export default Home