import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './Profil.css';
import Logo from '../../assets/HomeCare1.png';
import Foto from '../../assets/defaultpp.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Profil = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    profileImage: ''
  });

  const [receipts, setReceipts] = useState([]);
  const [showReceipts, setShowReceipts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFieldsEnabled, setPasswordFieldsEnabled] = useState(false);
  const [currentReceiptIndex, setCurrentReceiptIndex] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const cropperRef = useRef(null);
  const [tempImage, setTempImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    if (email) {
      axios.get(`http://localhost:3001/user/${email}`)
        .then(response => {
          const { first_name, last_name, email, phone, address, profile_image } = response.data;
          setUser({
            firstName: first_name,
            lastName: last_name,
            email: email,
            phone: phone || '',
            address: address || '',
            profileImage: profile_image || ''
          });
          setCroppedImage(profile_image ? `http://localhost:3001${profile_image}` : '');
        })
        .catch(error => {
          console.error('There was an error fetching the user data!', error);
        });
    }
  }, []);

  useEffect(() => {
    setPasswordFieldsEnabled(!!currentPassword);
  }, [currentPassword]);

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

  const handleImageClick = () => {
    if (isEditing) {
      inputRef.current.click();
    } else {
      setShowFullScreenImage(true);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setTempImage(reader.result);
      setShowCropper(true);
    };
  };

  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas();
    croppedCanvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setCroppedImage(reader.result);
        setShowCropper(false);
      };
    }, 'image/jpeg');
  };

  const handleCancelCrop = () => {
    setTempImage("");
    setShowCropper(false);
  };

  const handleResetImage = () => {
    const email = sessionStorage.getItem('userEmail');
    axios.delete(`http://localhost:3001/delete-profile-image/${email}`)
      .then(response => {
        setCroppedImage(Foto); // Reset to default image
        setUser({ ...user, profileImage: '' });
        alert(response.data.message);
      })
      .catch(error => {
        console.error('There was an error resetting the profile image!', error);
      });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setPasswordError('');
    const email = sessionStorage.getItem('userEmail');
    let passwordChanged = true;

    // Validate required fields
    if (!user.firstName || !user.lastName || (!user.phone && user.phone !== '') || (!user.address && user.address !== '')) {
      alert('All fields except passwords are required');
      return;
    }

    if (isEditing) {
      if (currentPassword) {
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
          setPasswordError(passwordError);
          return;
        }

        if (!newPassword || !confirmPassword) {
          alert('New password and confirm password cannot be empty when current password is provided');
          return;
        }

        if (newPassword !== confirmPassword) {
          alert('New password and confirm password do not match');
          return;
        }

        axios.post(`http://localhost:3001/change-password`, {
          email,
          currentPassword,
          newPassword
        })
          .then(response => {
            alert('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          })
          .catch(error => {
            console.error('There was an error changing the password!', error);
            alert("Your Current Password's Wrong");
            passwordChanged = false;
          })
          .finally(() => {
            if (!passwordChanged) {
              alert("Changes saved Failed");
              return;
            }

            axios.put(`http://localhost:3001/user/${email}`, {
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              address: user.address
            })
              .then(response => {
                alert('Changes saved successfully');
                setIsEditing(false);
                setUser({
                  ...user,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  phone: user.phone,
                  address: user.address
                });

                if (croppedImage && croppedImage !== Foto) {
                  const formData = new FormData();
                  formData.append('profileImage', dataURLtoBlob(croppedImage));
                  axios.post(`http://localhost:3001/upload-profile-image/${email}`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                    .then(response => {
                      setUser({ ...user, profileImage: response.data.profileImage });
                      setCroppedImage(`http://localhost:3001${response.data.profileImage}`);
                    })
                    .catch(error => {
                      console.error('There was an error uploading the profile image!', error);
                    });
                } else {
                  // If reset to default image, update the database
                  axios.post(`http://localhost:3001/upload-profile-image/${email}`, { profileImage: '' })
                    .then(() => {
                      setUser({ ...user, profileImage: '' });
                    })
                    .catch(error => {
                      console.error('There was an error resetting the profile image!', error);
                    });
                }
              })
              .catch(error => {
                console.error('There was an error saving the changes!', error);
              });
          });
      } else {
        // If currentPassword is not provided, proceed with other changes without changing the password
        axios.put(`http://localhost:3001/user/${email}`, {
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address
        })
          .then(response => {
            alert('Changes saved successfully');
            setIsEditing(false);
            setUser({
              ...user,
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              address: user.address
            });

            if (croppedImage && croppedImage !== Foto) {
              const formData = new FormData();
              formData.append('profileImage', dataURLtoBlob(croppedImage));
              axios.post(`http://localhost:3001/upload-profile-image/${email}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
                .then(response => {
                  setUser({ ...user, profileImage: response.data.profileImage });
                  setCroppedImage(`http://localhost:3001${response.data.profileImage}`);
                })
                .catch(error => {
                  console.error('There was an error uploading the profile image!', error);
                });
            } else {
              // If reset to default image, update the database
              axios.post(`http://localhost:3001/upload-profile-image/${email}`, { profileImage: '' })
                .then(() => {
                  setUser({ ...user, profileImage: '' });
                })
                .catch(error => {
                  console.error('There was an error resetting the profile image!', error);
                });
            }
          })
          .catch(error => {
            console.error('There was an error saving the changes!', error);
          });
      }
    } else {
      setIsEditing(true);
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const fetchReceipts = () => {
    const email = sessionStorage.getItem('userEmail');
    axios.get(`http://localhost:3001/receipt-list/${email}`)
      .then(response => {
        const sortedReceipts = response.data.sort((a, b) => b.order_id - a.order_id);
        setReceipts(sortedReceipts);
        setShowReceipts(true);
      })
      .catch(error => {
        console.error('There was an error fetching the receipts!', error);
      });
  };

  const handleBackToProfile = () => {
    setShowReceipts(false);
  };

  const handleNextReceipt = () => {
    setCurrentReceiptIndex((prevIndex) => (prevIndex + 1) % receipts.length);
  };

  const handlePreviousReceipt = () => {
    setCurrentReceiptIndex((prevIndex) => (prevIndex - 1 + receipts.length) % receipts.length);
  };

  const handleCloseFullScreenImage = () => {
    setShowFullScreenImage(false);
  };

  const handleRating = (orderId, status) => {
    if (status === 'Pesanan Dibatalkan') {
      alert('Tidak dapat memberikan rating');
    } else {
      navigate(`/review/${orderId}`);
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className='Profil'>
      <div className="containerrr">
        {showCropper && (
          <div>
            <div className="cropper-overlay"></div>
            <div className="cropper-popup">
              <Cropper
                src={tempImage}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                ref={cropperRef}
              />
              <div className="button-container">
                <button className="crop-button" onClick={handleCrop}>Crop</button>
                <button className="cancel-button" onClick={handleCancelCrop}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showFullScreenImage && (
          <div className="full-screen-image-overlay" onClick={handleCloseFullScreenImage}>
            <div className="full-screen-image-container">
              <img src={croppedImage || (user.profileImage ? `http://localhost:3001${user.profileImage}` : Foto)} alt="Profile" />
            </div>
          </div>
        )}
        <div className="side-navbar">
          <Link to="/home2"><img src={Logo} alt="Logo" /></Link>
          <div className="content-side-navbar">
            <button onClick={() => setShowReceipts(false)}>Personal Information</button>
            <button onClick={fetchReceipts}>Bukti Pembayaran</button>
          </div>
          <div className="signout1">
            <Link to="/">Sign Out<i className="fa-solid fa-arrow-right-from-bracket"></i></Link>
          </div>
        </div>
        <div className="main-content">
          {!showReceipts && (
            <div id="personal-info" className="content-personal-info">
              <h2>Personal Information</h2>
              <div className="personal-info">
                <div onClick={handleImageClick}>
                  {croppedImage ? (
                    <img src={croppedImage} className="img-display-after" alt="Uploaded" />
                  ) : (
                    <img src={user.profileImage ? `http://localhost:3001${user.profileImage}` : Foto} alt="Default" className="img-display-before" />
                  )}
                  <input type="file" ref={inputRef} onChange={handleImageChange} style={{ display: "none" }} />
                </div>
                <div className="name-and-actions">
                  <div className="info-container">
                    <p>
                      {user.firstName} {user.lastName} <br /><br />
                      <span className='let'>
                        {user.address}
                      </span>
                    </p>
                  </div>
                  {isEditing && (
                    <div className="image-actions">
                      <button type="button" className="image-upload-button" onClick={handleImageClick}>Upload Profile Photo</button>
                      <button type="button" className="image-reset-button" onClick={handleResetImage}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {!showReceipts && (
            <div className="form-containerrr">
              <form onSubmit={handleSaveChanges}>
                <div className="form-row">
                  <div className="name-input">
                    <label htmlFor="first-name">First Name</label>
                    <input
                      className='inputan'
                      type="text"
                      id="first-name"
                      name="firstName"
                      value={user.firstName}
                      maxLength={10} // Limit input to 10 characters
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="name-input">
                    <label htmlFor="last-name">Last Name</label>
                    <input
                      className='inputan'
                      type="text"
                      id="last-name"
                      name="lastName"
                      value={user.lastName}
                      maxLength={10} // Limit input to 10 characters
                      disabled={!isEditing}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row full-width">
                  <div>
                    <label htmlFor="username">Username</label>
                    <input
                      className='inputan'
                      type="text"
                      id="username"
                      name="username"
                      value={`${user.firstName.toLowerCase()}_${user.lastName.toLowerCase()}`}
                      disabled
                    />
                  </div>
                  <br />
                  <hr />
                  <br />
                  <br />
                </div>
                <div className="form-row">
                  <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                      className='inputan'
                      type="email"
                      id="email"
                      name="email"
                      value={user.email}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      className='inputan'
                      type="text"
                      id="phone"
                      name="phone"
                      value={user.phone}
                      disabled={!isEditing}
                      onChange={handleChange}
                      placeholder={isEditing && !user.phone ? 'Enter your phone number' : ''}
                    />
                  </div>
                </div>
                <div className="form-row full-width">
                  <div>
                    <label htmlFor="location">Location</label>
                    <input
                      className='inputan'
                      type="text"
                      id="location"
                      name="address"
                      maxLength="100"
                      value={user.address}
                      disabled={!isEditing}
                      onChange={handleChange}
                      placeholder={isEditing && !user.address ? 'Enter your location' : ''}
                    />
                  </div>
                </div>
                <br />
                <hr />
                <br />
                <br />
                <br />
                <div className="form-row">
                  <div>
                    <label htmlFor="current-password">Current Password</label>
                    <div className="password-input-container">
                      <input
                        className='inputan'
                        type={passwordVisible.current ? 'text' : 'password'}
                        id="current-password"
                        name="currentPassword"
                        value={currentPassword}
                        disabled={!isEditing}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <span
                        onClick={() => togglePasswordVisibility('current')}
                        className="password-toggle-icon"
                      >
                        {passwordVisible.current ? (
                          <i className="fa-solid fa-eye"></i>
                        ) : (
                          <i className="fa-solid fa-eye-slash"></i>
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="new-password">New Password</label>
                    <div className="password-input-container">
                      <input
                        className='inputan'
                        type={passwordVisible.new ? 'text' : 'password'}
                        id="new-password"
                        name="newPassword"
                        value={newPassword}
                        disabled={!passwordFieldsEnabled || !isEditing}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <span
                        onClick={() => togglePasswordVisibility('new')}
                        className="password-toggle-icon"
                      >
                        {passwordVisible.new ? (
                          <i className="fa-solid fa-eye"></i>
                        ) : (
                          <i className="fa-solid fa-eye-slash"></i>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-row full-width">
                  <div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="password-input-container">
                      <input
                        className='inputan'
                        type={passwordVisible.confirm ? 'text' : 'password'}
                        id="confirm-password"
                        name="confirmPassword"
                        value={confirmPassword}
                        disabled={!passwordFieldsEnabled || !isEditing}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="password-toggle-icon"
                      >
                        {passwordVisible.confirm ? (
                          <i className="fa-solid fa-eye"></i>
                        ) : (
                          <i className="fa-solid fa-eye-slash"></i>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {passwordError && <p className="error-message">{passwordError}</p>}
                <div className="form-actions">
                  <button type="button" onClick={() => navigate('/home2')}>Cancel</button>
                  <button type="submit">{isEditing ? 'Save Changes' : 'Edit Profile'}</button>
                </div>
              </form>
            </div>
          )}
          {showReceipts && (
            <div id="bukti-pembayaran" className="content-bukti-pembayaran">
              <h2 className='bukti'>Bukti Pembayaran</h2>
              {receipts.length > 0 ? (
                <div className="receipts-container">
                  <div className="receipt-item">
                    <p className="receipt-title"><strong>Order ID:</strong> {receipts[currentReceiptIndex].order_id}</p>
                    <p className="receipt-date"><strong>Payment Time:</strong> {new Date(JSON.parse(receipts[currentReceiptIndex].receipt_data).waktu_pembayaran).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}</p>
                    <Link to={`/receipt/${receipts[currentReceiptIndex].order_id}`}>Lihat Bukti Pembayaran</Link>
                    {!receipts[currentReceiptIndex].rating ? (
                      <button
                        className="rating-link"
                        onClick={() => handleRating(receipts[currentReceiptIndex].order_id, receipts[currentReceiptIndex].status)}
                        disabled={receipts[currentReceiptIndex].status === 'Pesanan Dibatalkan'}
                      >
                        Rating
                      </button>
                    ) : (
                      <>
                        <div className="rating-display">
                          <strong>Ratings:</strong>
                          {['kebersihan', 'pelayanan', 'kecepatan', 'profesional'].map(category => (
                            <div key={category} className="rating-category">
                              <span className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}:</span>
                              <span className="category-stars">
                                {[...Array(5)].map((_, index) => (
                                  <span key={index} className={`star ${index < (receipts[currentReceiptIndex][category] || 0) ? 'filled' : ''}`}>&#9733;</span>
                                ))}
                              </span>
                            </div>
                          ))}
                          <br />
                        </div>
                        <div className="description-display">
                          <strong>Description:</strong> <br /> {receipts[currentReceiptIndex].description}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="navigation-arrows">
                    <button className="prev" onClick={handlePreviousReceipt} disabled={currentReceiptIndex === 0}>&lt;</button>
                    <button className="next" onClick={handleNextReceipt} disabled={currentReceiptIndex === receipts.length - 1}>&gt;</button>
                  </div>
                </div>
              ) : (
                <p>Tidak ada bukti pembayaran yang tersedia.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profil;
