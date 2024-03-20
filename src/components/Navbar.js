import React, { useState } from 'react';
import '../stylesheets/NavbarStyles.css';
import {Link} from 'react-router-dom';
import {logo} from "../assets/images"
import {FaBars,FaTimes} from 'react-icons/fa';

const Navbar = () => {

    const [click,setClick] =  useState(false);
    const handleClick = () => setClick(!click);

    const openPage  = () => {
        setClick(!click);
    }
  return (
    <div className='header'>

        <Link to="/">
            <img src={logo} className='logo'/>
        </Link>

        <ul className={click ? 'Nav-menu active' : 'Nav-menu'}>
            <li>
            <Link to="/" onClick={openPage}>Home</Link>
            </li>

            <li>
            <Link to="/about" onClick={openPage}>Services</Link>
            </li>

            <li>
            <Link to="/models" onClick={openPage}>About Us</Link>
            </li>

            <li>
            <Link to="/models" onClick={openPage}>Articles</Link>
            </li>

            <li>
            <Link to="/testimonials" onClick={openPage}>Portfolio</Link>
            </li>

            <div className='nav-btns'>

            <Link to={"/login"} onClick={openPage}><button className='nav-btn sign-in'>Hire</button></Link>
            

        </div>
            
        </ul>

        <div className='openNav' onClick={handleClick}>


            {
                 click ? (<FaTimes size={28} style={{ color:"#fff" ,cursor:"pointer"}}/>) :
           ( <FaBars size={28} style={{ color:"#fff" ,cursor:"pointer"}}/>)}
            

        </div>

        <div className='nav-btns'>

            <Link to={"/login"}><button className='nav-btn register'>Hire</button></Link>

        </div>

    </div>
  )
}

export default Navbar