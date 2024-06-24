import React from 'react'
import './Navbar.css'

import logox from '../../assets/logo.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header id='custom-header'>
        <div className="custom-container">
            <nav className="custom-nav">
                <img src={logox} alt="Logo" className="custom-logo" />
                <ul className="custom-nav-list">
                    <li className='custom-nav-item'><Link to="/">Home</Link></li>
                    <li className='custom-nav-item'><Link to="/about2">Tentang Kami</Link></li>
                    <li className='custom-nav-item'><Link to="/layanan2">Layanan Kami</Link></li>
                </ul>
                <div className="custom-button-container">
                <Link to="/login"><button className='custom-btn-login'>Login</button></Link>
                <Link to="/register"><button className='custom-btn-register'>Daftar</button></Link>
                </div>
            </nav>
        </div>
    </header>
  )
}

export default Navbar
