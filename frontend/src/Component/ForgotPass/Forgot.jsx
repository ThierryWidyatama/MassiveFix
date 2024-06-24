import React from 'react';
import forgot from '../../assets/forgot.jpg';
import logo from '../../assets/logo.png';
import './Forgot.css';
import { Link } from 'react-router-dom';

const Forgot = () => {
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <img src={logo} alt="Logo" className="logo-forgot-password" />
        <h2 className='o'>Forgot Password?</h2>
        <h3 className="yy">E-mail</h3>
        <form>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Example@gmail.com"
            />
          </div>
          <button type="submit" className="btn-reset-password">Reset Password</button>
        </form>
        
      </div>
      <div className="forgot-password-image">
        <img src={forgot} alt="Forgot Password" />
      </div>
    </div>
  );
};

export default Forgot;
