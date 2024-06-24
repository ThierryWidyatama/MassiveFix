import React from 'react';
import Logo from '../../assets/HomeCare1.png'
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer-wrapper'>
      <section className='footer'>
        <div className="footer-content">
          <img src={Logo} alt="" />
          <div className="icons">
            <a href="/"><i className="fab fa-facebook"></i></a>
            <a href="/"><i className="fab fa-twitter"></i></a>
            <a href="/"><i className="fab fa-instagram"></i></a>
            <a href="/"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
        <div className="allcontent">
          <div className="footer-content">
            <h4>Services</h4>
            <ul>
              <li><a href="/">Houses Cleaning</a></li>
              <li><a href="/">Office Cleaning</a></li>
              <li><a href="/">Window Cleaning</a></li>
              <li><a href="/">Floor Cleaning</a></li>
            </ul>
          </div>
          <div className="footer-content">
            <h4>Useful Links</h4>
            <ul>
              <li><a href="/">Home Page</a></li>
              <li><a href="/">Service Page</a></li>
              <li><a href="/">Promo Page</a></li>
              <li><a href="/">Contact</a></li>
            </ul>
          </div>
          <div className="footer-content">
            <h4>Contact</h4>
            <ul>
              <li><a href="/"><i class="fa-solid fa-phone"></i>081123456578</a></li>
              <li><a href="/"><i class="fa-solid fa-envelope"></i>paini@gmail.com</a></li>
              <li><a href="/"><i class="fa-solid fa-location-dot"></i>23posisi</a></li>
            </ul>
          </div>
        </div>
      </section>
      <div className="footer-bottom">
        <p>Copyright by Anagata @ 2024. All rights reserved</p>
      </div>
    </div>
  )
}

export default Footer;
