import React, { useState, useEffect } from 'react';
import './Navbar.css';
import Logo from '../../assets/HomeCare1.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import defaultProfileImage from '../../assets/defaultpp.jpg'; // Default profile image if none exists

const Navbar = () => {
  const [user, setUser] = useState({ profileImage: '' });

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    if (email) {
      axios.get(`http://localhost:3001/user/${email}`)
        .then(response => {
          const { profile_image } = response.data;
          setUser({ profileImage: profile_image ? `http://localhost:3001${profile_image}` : defaultProfileImage });
        })
        .catch(error => {
          console.error('There was an error fetching the user data!', error);
        });
    }
  }, []);

  return (
    <header id='header'>
      <div className="container">
        <nav>
          <img src={Logo} alt="Logo" className="logo-image"/>
          <ul>
            <li><Link to="/home2">Home</Link></li>
            <li><Link to="/about">Tentang Kami</Link></li>
            <li><Link to="/layanan">Layanan Kami</Link></li>
          </ul>
          <Link to="/profil">
            {user.profileImage ? (
              <img src={user.profileImage} alt="User Profile" className="profile-image" />
            ) : (
              <i className='fa-regular fa-circle-user'></i>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
