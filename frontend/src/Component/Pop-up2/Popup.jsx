import React, { useState } from 'react';
import custom from '../../assets/custom.png';
import kulkas from '../../assets/kulkas.png';
import rumah from '../../assets/rumah.png';
import '../Pop-up/Popup.css';
import { Link } from 'react-router-dom';

const Popup = () => {
  const [openPopups, setOpenPopups] = useState({});

  const togglePopup = (service) => {
    setOpenPopups((prevOpenPopups) => ({
      ...prevOpenPopups,
      [service]: !prevOpenPopups[service],
    }));
  };

  return (
    <div className='service-popup'>
      <button onClick={() => togglePopup('rumah')} className="open-popup-btn1">
        <img src={rumah} alt="" className='service-img' />
        <h1 className='omah'>Rumah</h1>
        <p className='service-text'>Dapur bersih, hati senang! Biarkan kami menjaga dapur anda tetap bersih dan nyaman.</p>
      </button>
      {openPopups['rumah'] && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button onClick={() => togglePopup('rumah')} className="close-popup-btn">&times;</button>
            <img src={rumah} alt="" className='popup-img' />
            <h2>House Cleaning</h2>
            <p>House cleaning adalah layanan bersih-bersih untuk perawatan rutin rumah. Cakupan kerja house cleaning meliputi mengelap debu, mengepel lantai, merapikan kamar tidur dan membersihkan kamar mandi. Alat dan cairan disediakan oleh HomeCare. Estimasi pengerjaan yakni 30 menit untuk setiap ruangan.</p>
            <button className='pesan-popup'>Pesan Sekarang</button>
          </div>
        </div>
      )}

      <button onClick={() => togglePopup('ac')} className="open-popup-btn1">
        <img src={custom} alt="" className='service-img' />
        <h1 className='omah'>Perabotan</h1>
        <p className='service-text'>Biarkan kami mengurus kebersihan perabotan anda agar perabotan anda selalu terasa segar dan bersih.</p>
      </button>
      {openPopups['ac'] && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button onClick={() => togglePopup('ac')} className="close-popup-btn">&times;</button>
            <img src={custom} alt="" className='popup-img' />
            <h2>Perabotan</h2>
            <p>Perabotan cleaning adalah layanan untuk membersihkan dan merawat AC,Kulkas dll agar tetap bekerja optimal. Kami menggunakan alat dan cairan khusus untuk membersihkan bagian dalam dan luar. Estimasi pengerjaan adalah 45 menit per unit.</p>
            <button className='pesan-popup'>Pesan Sekarang</button>
          </div>
        </div>
      )}

      <button onClick={() => togglePopup('kulkas')} className="open-popup-btn1">
        <img src={kulkas} alt="" className='service-img' />
        <h1 className='omah'>Custom</h1>
        <p className='service-text'>Layanan khusus untuk memberikan pelayanan sesuai yang anda minta.</p>
      </button>
      {openPopups['kulkas'] && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button onClick={() => togglePopup('kulkas')} className="close-popup-btn">&times;</button>
            <img src={kulkas} alt="" className='popup-img' />
            <h2>Custom Cleaning</h2>
            <p>Merupakan fitur andalan kami, dengan begini anda dapat menentukan sendiri apa yang ingin dibersihkan, namun disarankan untuk memesan jasa ini untuk pembersihan skala besar seperti Garasi, Taman, dan lainnya.</p>
            <button className='pesan-popup'>Pesan Sekarang</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
