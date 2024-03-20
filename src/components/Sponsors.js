import React from 'react'
import { sp1,sp2,sp3,sp4,sp5 } from '../assets/images';
import "../stylesheets/SponsorsStyles.css"

const Sponsors = () => {
  return (
    <section className='light-section'>
       <div className='sponsors-flex'>
        <img src={sp1} alt='Adira'/>
        <img src={sp2} alt='Adhimix'/>
        <img src={sp3} alt='Holcim'/>
        <img src={sp4} alt=''Minc/>
        <img src={sp5} alt='Telkomsel'/>

       </div>
    </section>
  )
}

export default Sponsors