import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../../assets/login.png';
import logo from '../../assets/logo.png';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem('userEmail', formData.email); // Simpan email pengguna di sessionStorage

      if (data.role === 'admin') {
        alert('Admin login successful');
        navigate('/admin'); // Navigasi ke halaman admin jika login sebagai admin
      } else {
        alert('Login successful');
        navigate('/home2'); // Navigasi ke halaman home setelah sukses login
      }
    } else {
      const data = await response.json();
      alert(data.error || 'Invalid credentials');
    }
  };

  return (
    <div className="wikwok-login-container">
      <div className="wikwok-login-image">
        <img src={login} alt="Login" />
      </div>
      <div className="wikwok-login-form">
        <img src={logo} alt="Logo" className="wikwok-logo-login" />
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="wikwok-form-group">
            <input
              type="email"
              name="email"
              required
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="wikwok-form-group">
            <div className="wikwok-password-input-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                onClick={togglePasswordVisibility}
                className="wikwok-password-toggle-icon"
              >
                {passwordVisible ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </span>
            </div>
          </div>
          <div className="wikwok-forgot-pass">
          <p>Forgot Password? <Link to="/forgot">Fix Here!</Link></p>
          </div>
          <button type="submit" className="wikwok-btn-login">Login</button>
        </form>
        <div className="wikwok-no-account">
          <p>Don't Have Account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
