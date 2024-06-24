import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer';
import Foto from '../../assets/defaultpp.jpg';
import './UserReview.css';

const UserReview = ({ totalStars = 5 }) => {
  const [ratings, setRatings] = useState({
    kebersihan: 0,
    pelayanan: 0,
    kecepatan: 0,
    profesional: 0,
  });

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    profileImage: ''
  });

  const [description, setDescription] = useState('');
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    if (email) {
      axios.get(`http://localhost:3001/user/${email}`)
        .then(response => {
          const { first_name, last_name, profile_image } = response.data;
          setUser({
            firstName: first_name,
            lastName: last_name,
            profileImage: profile_image ? `http://localhost:3001${profile_image}` : Foto
          });
        })
        .catch(error => {
          console.error('There was an error fetching the user data!', error);
        });
    }
  }, []);

  const handleClick = (category, index) => {
    setRatings({ ...ratings, [category]: index + 1 });
  };

  const handleSaveReview = () => {
    const allRatingsFilled = Object.values(ratings).every(rating => rating > 0);
    if (!allRatingsFilled) {
      alert('Please fill in all the star ratings');
      return;
    }

    const averageRating = (ratings.kebersihan + ratings.pelayanan + ratings.kecepatan + ratings.profesional) / 4;
    const reviewData = {
      orderId,
      rating: averageRating,
      description,
      ratings // Include individual ratings
    };
    console.log('Saving review with data:', reviewData); // Add this line to log the data

    axios.post(`http://localhost:3001/save-review`, reviewData)
      .then(response => {
        console.log(response.data); // Logging the response from the server
        alert('Review saved successfully');
        navigate('/profil');
      })
      .catch(error => {
        console.error('There was an error saving the review!', error);
        if (error.response) {
          console.log(error.response.data); // Log the error response from the server
          alert(`Error: ${error.response.data.error}`);
        } else {
          alert('An unexpected error occurred');
        }
      });
  };

  return (
    <>
      <header className='repew'>
        <h2 className='ndas'>User Review</h2>
        <img src={user.profileImage} alt="User Profile" className='profil-review'/>
      </header>

      <div className='icon-review'>
        <img src={user.profileImage} alt="User Profile" />
        <div className='title-profile'>
          <h2>{`${user.firstName} ${user.lastName}`}</h2>
          <br />
          <p className='t1'>User</p>
        </div>
      </div>

      <div className="horizontal-line1"></div>

      <div className='title-body'>
        <h1>Satisfaction value with this cleaning service</h1>
      </div>

      {['kebersihan', 'pelayanan', 'kecepatan', 'profesional'].map((category) => (
        <div className='rating-container' key={category}>
          <p className='title-rating'>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
          <div className='stars'>
            {[...Array(totalStars)].map((_, index) => (
              <span
                key={index}
                className={`star ${index < ratings[category] ? 'filled' : ''}`}
                onClick={() => handleClick(category, index)}
              >
                &#9733; {/* Unicode character for star */}
              </span>
            ))}
          </div>
          <p className='rating-number'>{ratings[category]}</p>
        </div>
      ))}

      <div className="horizontal-line1"></div>

      <div className='title-deskirpsi'>
        <h1>Description</h1>
      </div>

      <div className="text-area">
        <textarea
          className="centered-textarea"
          placeholder="Ceritakan lebih banyak tentang pendapat Anda"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <button className='btn-selesai' onClick={handleSaveReview}>Selesai</button>
    </>
  );
}

export default UserReview;
