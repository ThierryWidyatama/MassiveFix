import React from 'react'
import team from '../../assets/team.png'
import team1 from '../../assets/team1.png'
import team2 from '../../assets/team2.png'
import team3 from '../../assets/team3.png'
import team4 from '../../assets/team4.png'
import team5 from '../../assets/team5.png'
import tes from '../../assets/tes.svg'
import tes1 from '../../assets/tes1.svg'
import tes2 from '../../assets/tes2.svg'
import Guest from '../Guest/Navbar'
import Footer from '../Footer/Footer'
import '../About/About.css'

const About = () => {
  return (
    <>
    <Guest/>
    <div className='About'>
        <div className='layer'>
          
        <h1>Tentang Kami</h1>
        <p>
        Homecare merupakan sebuah website yang berdedikasi dalam menyediakan layanan kebersihan 
        <br />rumah tangga terjamin kebersihannya. Tim kami terdiri dari profesional yang terampil dan  
        <br />berpengalaman di bidang kebersihan rumah, selalu siap memberikan layanan terbaik. 
        <br />Kami memahami betapa pentingnya rumah yang bersih dan rapi bagi kenyamanan dan kesehatan Anda dan keluarga. Oleh karena itu, kami berkomitmen untuk menyediakan solusi kebersihan yang efektif dan efisien yang sesuai dengan kebutuhan dan preferensi Anda. 
        </p>

        <div className='btn'>
        <a href="#">
          <button class="btn-hubungi">Hubungi Kami</button>
        </a>
        <a href="#">
          <button class="btn-pesan">Pesan Sekarang</button>
        </a>
        </div>
        </div>
    </div>

{/* ---------------end slide 1---------------- */}
{/* --------------- slide 2 ------------- */}

    <div className='misi'>
        <h1>Our Mission</h1>

        <p>
        Sebagai penyedia layanan jasa kebersihan rumah tangga, kami memahami betapa pentingnya kebersihan dalam menjaga kesehatan, kenyamanan, dan kualitas hidup Anda secara keseluruhan. Kami percaya bahwa lingkungan rumah yang bersih dan rapi tidak hanya menciptakan lingkungan hidup yang nyaman tetapi juga mencegah penyebaran penyakit dan menjaga kualitas udara. 
        </p>
        <p className='misip'>
        Oleh karena itu, misi kami adalah untuk membantu mengatasi hambatan-hambatan tersebut dengan menyediakan layanan kebersihan rumah tangga yang efisien dan efektif. Kami berdedikasi untuk membantu Anda menjaga rumah Anda tetap bersih dan sehat, memberikan Anda lebih banyak waktu dan energi untuk fokus pada hal-hal yang benar-benar penting bagi Anda.
        </p>
        <br /><br />
    </div>
{/* --------------- end slide 2 -------------- */}
{/* ------------ slide 3 ------------ */}
    <div className='box1'>
      <div className='text'>
      <h1>Bagaimana Caranya?</h1>
      <br /><br />

      <div className='insidebox'>
        <img src={tes2} alt="" className='logobox'/>
        <h6>Rilex.</h6>
        <p>
        Rumah akan bersih, urusan sudah selesai. Waktunya pulang.
        </p>
      </div>

      

      <div className='insidebox'>
        <img src={tes1} alt="" className='logobox'/>
        <h6>Book it.</h6>
        <p>
        Kami akan membuat rumah Anda bersinar, dan menjalankan pembersihan yang sesuai dengan jenis layanan yang Anda Pilih.
        </p>
      </div>

      <div className='insidebox'>
        <img src={tes} alt="" className='logobox'/>
        <h6>Deal.</h6>
        <p>
        Ceritakan kepada kami tentang Anda, rumah Anda, dan kebutuhan pembersihan Anda.
        </p>
      </div>

      </div>
    </div>

{/* ------------- end slide 3 ----------------- */}
{/* ---------------- slide 4 ---------------- */}

    <div className='team'>
      <h1>Our Team</h1>
      <br />
      <p>
      Tim kami terdiri dari para profesional kebersihan terlatih yang berdedikasi untuk menjadikan rumah Anda bersih. Setiap anggota tim kami telah di tes untuk memastikan kualitas layanan.
      </p>
      <div className='grid1'>
        <img src={team} alt="" className='gridd-item'/>
        <img src={team1} alt="" className='gridd-item1'/>
        <img src={team2} alt="" className='gridd-item2'/>
        <img src={team3} alt="" className='gridd-item3'/>
        <img src={team4} alt="" className='gridd-item4'/>
        <img src={team5} alt="" className='gridd-item5'/>
      </div>
      </div>
      <Footer/>
    
    </>
  )
}

export default About