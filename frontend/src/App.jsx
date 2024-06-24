import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Pesanan1 from './Component/Pesanan 1/Pesanan1';
import Pesanan2 from './Component/Pesanan 2/Pesanan2';
import Pesanan from './Component/Pesanan/Pesanan';
import Home from './Component/Home/Home';
import Profil from './Component/Profil/Profil';
import Layanan from './Component/Layanan/Service';
import About from './Component/About/About';
import UserReview from './Component/UserReview/UserReview';
import Guest from './Component/Guest/Navbar';
import Home2 from './Component/Home2/Home';
import About2 from './Component/About2/About';
import Layanan2 from './Component/Layanan2/Service';
import Login from './Component/Login/Login';
import Register from './Component/Register/Register';
import Popup2 from './Component/Pop-up2/Popup';
import Admin from './Component/Admin/Admin';
import Receipt from './Component/Receipt/Receipt';
import Reviews from './Component/Reviews/Reviews';
import Forgot from './Component/ForgotPass/Forgot';

document.body.className = 'pesanan-body';

library.add(fas);

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/pesanan" element={<Pesanan />} />
          <Route path="/pesanan1" element={<Pesanan1 />} />
          <Route path="/pesanan2" element={<Pesanan2 />} />
          <Route path="/home2" element={<Home2 />} />
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/about" element={<About />} />
          <Route path="/review/:orderId" element={<UserReview />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/about2" element={<About2 />} />
          <Route path="/layanan2" element={<Layanan2 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/popup2" element={<Popup2 />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/receipt/:orderId" element={<Receipt />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/forgot" element={<Forgot />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
