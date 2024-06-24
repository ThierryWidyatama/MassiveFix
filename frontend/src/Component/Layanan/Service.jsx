import React from 'react'
import Popup from '../Pop-up/Popup'
import './Service.css'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'

const Service = () => {
  return (
    <>
    <Navbar/>
    <div id='service'>
        <div className='serpis'>
        <h1>Layanan Kami</h1>
        <p>
        Tingkatkan kualitas hidup Anda dengan lingkungan yang bersih dan segar melalui layanan profesional kami! 
        Temukan solusi pembersihan yang efektif dan terpercaya untuk rumah dan area komersial Anda. 
        Mulai hari ini nikmati kebersihan tanpa repot. Kunjungi situs kami sekarang!
        </p>
        <br /><br />
        </div>
        <div className='btn'>
        <a href="">
            <button className='btn-more'>Lebih Lanjut</button>
        </a>
        </div>
    </div>

    <section>
      <Popup/>
    </section>
    <Footer/>

    {/* <div className='kard'>


    <div id='card-service'>
    <img src={rumah} alt="" className='card-img'/>
    <h1 className='card-title'>Rumah</h1>
    <p className='card-desc'>Dapur bersih, hati senang! biarkan kami menjaga dapur anda tetap bersih dan nyaman</p>
    <button className='popup'>See more</button>
    </div>

    <div id='card-service'>
    <img src={ac} alt="" className='card-img'/>
    <h1 className='card-title'>AC</h1>
    <p className='card-desc'>Lantai bersih, ruangan nyaman. biarkan kami mengurus kebersihan lantai anda agar rumah anda selalu terasa segar dan bersih</p>
    <button className='popup'>See more</button>
    </div>

    <div id='card-service'>
    <img src={kulkas} alt="" className='card-img'/>
    <h1 className='card-title'>Kulkas</h1>
    <p className='card-desc'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.dadasdasddsadadwas</p>
    <button className='popup'>See more</button>
    </div>
    
    </div> */}

    </>
  )
}

export default Service