import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const startsWithSpecialOrCapital = /^[A-Z!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return 'Password harus minimal 6 karakter.';
    }
    if (!startsWithSpecialOrCapital.test(password)) {
      return 'Password harus diawali dengan huruf kapital atau huruf spesial.';
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (response.status === 200) {
        alert('User registered successfully');
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="wikwok-register-container">
      <div className="wikwok-register-image">
        <img src={logo} alt="" className="wikwok-logo-register" />
        <h2 className='wikwok-hh'>
          Your mess is 
          <br />history when 
          <br />we're on the 
          <br />scene
        </h2>
        {/* <img src={register} alt="Register" /> */}
      </div>
      <div className="wikwok-register-form">
        {/* <img src={logo} alt="" className="wikwok-logo-register" /> */}
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className='jeneng'>
            <div className="wikwik-form-group">
              <h5 className='f'>First Name</h5>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                placeholder=""
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="wikwik-form-group">
              <h5 className='l'>Last Name</h5>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                placeholder=""
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="wikwik-form-group">
            <h5 className='e'>Email</h5>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="wikwik-form-group">
            <div className="wikwok-password-input-container">
              <h5 className='k'>Password</h5>
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="wikwok-password-input"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className='wikwok-btn-register'>Create Account</button>
        </form>
        <div className="wikwok-already-account">
          <p>Already Have Account? <Link to="/login">Login</Link></p>
        </div>
        <div className="wikwok-divider">
          <span className="wikwok-divider-text">or</span>
        </div>
        <div className="wikwok-social-signup">
          <button className="wikwok-social-btn facebook"> Sign up with Facebook</button>
          <button className="wikwok-social-btn google">Sign up with Google</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
