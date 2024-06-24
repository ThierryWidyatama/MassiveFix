import React, { useState, useEffect } from 'react';
import './Pesanan.css';
import bca from '../../assets/bca.png';
import bni from '../../assets/bni.png';
import mandiri from '../../assets/mandiri.png';
import bri from '../../assets/bri.png';
import dana from '../../assets/dana.png';
import gopay from '../../assets/gopay.png';
import shopeepay from '../../assets/shopeepay.png';
import cod from '../../assets/cod.png';
import ceklis from '../../assets/ceklis.m4v';
import Navbar from '../../Component/Navbar/Navbar';
import Footer from '../../Component/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';

const Pesanan = () => {
    const [personCount, setPersonCount] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [step, setStep] = useState(1);
    const [personalInfo, setPersonalInfo] = useState({
        nama: '',
        email: '',
        nomorHp: '',
    });
    const [isStep2Valid, setIsStep2Valid] = useState(false);
    const [alamat, setAlamat] = useState('');
    const [isStep3Valid, setIsStep3Valid] = useState(false);
    const [isStep4Valid, setIsStep4Valid] = useState(false);
    const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
    const [orderId, setOrderId] = useState(null); // Add state for order ID
    const [orderStatus, setOrderStatus] = useState('Pending'); // Add state for order status
    const [isConfirmed, setIsConfirmed] = useState(false); // State for confirmation popup
    const [userEmail, setUserEmail] = useState(''); // This should be fetched from user context or state
    const [selectedService, setSelectedService] = useState({ name: 'AC', price: 100000 });
    const [disabledTimes, setDisabledTimes] = useState([]); // State to hold disabled times

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserEmail = () => {
            const email = sessionStorage.getItem('userEmail');
            setUserEmail(email);
            setPersonalInfo(prevState => ({
                ...prevState,
                email: email
            }));
        };

        fetchUserEmail();
    }, []);

    useEffect(() => {
        // Fetch disabled times from the server
        const fetchDisabledTimes = async () => {
            try {
                const response = await fetch('http://localhost:3001/disabled-times');
                if (!response.ok) {
                    throw new Error('Failed to fetch disabled times');
                }
                const data = await response.json();
                setDisabledTimes(data);
            } catch (error) {
                console.error('Error fetching disabled times:', error);
            }
        };

        fetchDisabledTimes();
    }, []);

    useEffect(() => {
        if (step === 4) {
            const currentDate = new Date();
            updateCalendar(currentDate.getMonth(), currentDate.getFullYear());
        }
    }, [step, disabledTimes]);

    const baseTime = 60;
    const maxPersons = 5;
    const personPrice = 10000;
    const serviceFee = 2000;

    const updateCounter = (change) => {
        let newCount = personCount + change;
        if (newCount < 0) {
            newCount = 0;
        } else if (newCount > maxPersons) {
            newCount = maxPersons;
        }
        setPersonCount(newCount);
    };

    const updateTimeEstimate = () => {
        let timeEstimate = baseTime - (personCount * 5);
        return personCount === maxPersons ? "(Secepatnya)" : `(${timeEstimate} Menit)`;
    };

    useEffect(() => {
        const { nama, email, nomorHp } = personalInfo;
        setIsStep2Valid(nama.trim() !== '' && email.trim() !== '' && nomorHp.trim() !== '');
    }, [personalInfo]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setPersonalInfo({
            ...personalInfo,
            [id]: value,
        });
    };

    useEffect(() => {
        if (step === 3) {
            initializeMap();
        }
    }, [step]);

    useEffect(() => {
        const isValid = alamat.trim() !== '';
        setIsStep3Valid(isValid);
    }, [alamat]);

    useEffect(() => {
        setIsStep4Valid(selectedDate !== null && selectedTime !== '');
    }, [selectedDate, selectedTime]);

    useEffect(() => {
        if (step === 7) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown > 0 ? prevCountdown - 1 : 0);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [step]);

    useEffect(() => {
        if (orderId) {
            const interval = setInterval(() => {
                checkOrderStatus(orderId, selectedDate, selectedTime);
            }, 5000); // Check every 5 seconds

            return () => clearInterval(interval);
        }
    }, [orderId, selectedDate, selectedTime]);

    const formatCountdown = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const calculatePayment = () => {
        const additionalPeople = personCount > 0 ? personCount - 0 : 0;
        const totalPeoplePrice = additionalPeople * personPrice;
        const subtotal = selectedService.price + totalPeoplePrice;
        return {
            additionalPeople,
            subtotal,
            serviceFee,
            total: subtotal + serviceFee - voucherDiscount
        };
    };

    const submitVoucher = () => {
        const voucherCode = document.getElementById('voucher').value;
        if (voucherCode === 'DISKON') {
            setVoucherDiscount(20000);
            alert("Voucher Applied!");
        } else {
            setVoucherDiscount(0);
            alert("Kode Voucher tidak ditemukan");
        }
    };

    const steps = [
        { id: 1, name: 'Layanan' },
        { id: 2, name: 'Informasi Pribadi' },
        { id: 3, name: 'Lokasi' },
        { id: 4, name: 'Tanggal dan Waktu' },
        { id: 5, name: 'Pembayaran' },
    ];

    const initializeMap = () => {
        const mapElement = document.getElementById('map');
        if (mapElement) {
            const map = new window.google.maps.Map(mapElement, {
                center: { lat: -6.200000, lng: 106.816666 },
                zoom: 15
            });
            const marker = new window.google.maps.Marker({
                map: map,
                draggable: true,
                position: { lat: -6.200000, lng: 106.816666 }
            });

            window.google.maps.event.addListener(marker, 'dragend', function () {
                updateAddress(marker.getPosition());
            });
        }
    };

    const updateAddress = (location) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ 'location': location }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    setAlamat(results[0].formatted_address);
                }
            }
        });
    };

    const updateCalendar = (month, year) => {
        const calendarHeader = document.getElementById('monthYear');
        const calendarDates = document.getElementById('calendarDates');
        calendarHeader.innerText = `${month + 1}/${year}`;
        calendarDates.innerHTML = '';
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            calendarDates.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateDiv = document.createElement('div');
            dateDiv.innerText = day;

            // Hide the date if it is in the disabled times
            const formattedDate = new Date(year, month, day).toLocaleDateString('sv-SE');
            const isDisabled = disabledTimes.some(disabled => disabled.date === formattedDate);

            if (isDisabled) {
                dateDiv.style.display = 'none';
            } else {
                dateDiv.onclick = () => {
                    const selectedDate = new Date(year, month, day);
                    setSelectedDate(selectedDate);
                    document.querySelectorAll('.calendar-dates-pesanan div').forEach(div => div.style.backgroundColor = '');
                    dateDiv.style.backgroundColor = '#007bff';
                };
            }

            calendarDates.appendChild(dateDiv);
        }
    };

    const saveReceipt = (orderId, paymentDetails) => {
        const receiptData = {
            waktu_pembayaran: new Date().toLocaleString(),
            total_pembayaran: paymentDetails.total,
            rincian_pembayaran: {
                subtotal_pembersihan: paymentDetails.subtotal,
                biaya_jasa_aplikasi: paymentDetails.serviceFee,
                diskon: voucherDiscount,
                total_pembayaran: paymentDetails.total,
            },
            metode_pembayaran: paymentMethod,
            alamat: alamat,
            layanan: selectedService.name, // Add service name to the receipt data
        };

        fetch('http://localhost:3001/save-receipt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_email: userEmail,
                order_id: orderId,
                receipt_data: receiptData,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Receipt saved:', data);
        })
        .catch((error) => {
            console.error('Error saving receipt:', error);
        });
    };

    const submitOrder = () => {
        const orderData = {
            nama: personalInfo.nama,
            email: userEmail, // Use logged-in user's email
            nomorHp: personalInfo.nomorHp,
            alamat: alamat,
            tanggal: selectedDate.toLocaleDateString('sv-SE'), // format yyyy-mm-dd
            waktu: selectedTime,
            total_orang: personCount,
            harga_total: calculatePayment().total,
            metode_pembayaran: paymentMethod,
            user_email: userEmail,
            layanan: selectedService.name // Include the service name in the order data
        };

        fetch('http://localhost:3001/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Order placed successfully') {
                setOrderId(data.orderId); // Store the order ID
                alert('Order placed successfully');
                saveReceipt(data.orderId, calculatePayment()); // Save the receipt
                setStep(7);
                setDisabledTimes(prevDisabledTimes => [...prevDisabledTimes, { date: selectedDate.toLocaleDateString('sv-SE'), time: selectedTime }]);
            } else {
                alert('Order placement failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Order placement failed: ' + error.message);
        });
    };

    const checkOrderStatus = async (orderId, selectedDate, selectedTime) => {
        try {
            const response = await fetch(`http://localhost:3001/order/${orderId}`);
            const data = await response.json();
            setOrderStatus(data.status);
            if (data.status === 'Confirmed') {
                setIsConfirmed(true);
                const newDisabledTime = { date: selectedDate.toLocaleDateString('sv-SE'), time: selectedTime };
                setDisabledTimes(prevDisabledTimes => [...prevDisabledTimes, newDisabledTime]);

                // Save the new disabled time to the server
                await fetch('http://localhost:3001/disabled-times', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newDisabledTime),
                });
            }
        } catch (error) {
            console.error('Error checking order status:', error);
        }
    };

    const checkTimeAvailability = async () => {
        if (!selectedDate || !selectedTime) {
            alert("Pilih tanggal dan waktu terlebih dahulu.");
            return;
        }

        const formattedDate = selectedDate.toLocaleDateString('sv-SE');
        const response = await fetch(`http://localhost:3001/check-time?date=${formattedDate}&time=${selectedTime}`);
        const data = await response.json();

        if (data.isAvailable) {
            setStep(5);
        } else {
            alert("Waktu yang dipilih sudah tidak tersedia. Silakan pilih waktu lain.");
        }
    };

    const closePopup = () => {
        setIsConfirmed(false);
        navigate(`/receipt/${orderId}`); // Navigate to receipt page
    };

    function getPaymentLogo() {
        switch(paymentMethod) {
            case 'Shopeepay':
                return shopeepay;
            case 'Gopay':
                return gopay;
            case 'Dana':
                return dana;
            case 'BCA':
                return bca;
            case 'BNI':
                return bni;
            case 'BRI':
                return bri;
            case 'Mandiri':
                return mandiri;
            case 'COD':
                return cod;
            default:
                return '';
        }
    }

    const handleRatingClick = () => {
        if (orderStatus.toLowerCase() === 'canceled' || orderStatus.toLowerCase() === 'cancelled') {
            alert('Tidak dapat memberi rating, pesanan telah dibatalkan');
        } else {
            // Navigate to rating page or handle rating logic
        }
    };

    const changeMonth = (direction) => {
        const currentMonth = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
        const currentYear = selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();
        const newDate = new Date(currentYear, currentMonth + direction, 1);
        updateCalendar(newDate.getMonth(), newDate.getFullYear());
    };

    return (
        <>
        <Navbar/>
        <div className='seluruh-pesanan'>
        <div className="card-pesanan" id="formCard">
            {step !== 6 && step !== 7 && (
                <div className="sidebar-pesanan">
                    <ul>
                        {steps.map(stepObj => (
                            <li key={stepObj.id} className={step === stepObj.id ? 'active-pesanan' : ''}>
                                {stepObj.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="content-pesanan">
            {step === 1 && (
                <div id="step1">
                    <div className="header-pesanan">
                        <div className="back-button-pesanan">&lt;</div>
                        <h2 className='layanan1'>Layanan</h2>
                    </div>
                    <div className="divider"></div>
                    <div className="form-group-pesanan1">
                        <br />
                        <h3>Layanan:</h3>
                        <br />
                        <select onChange={(e) => {
                            const selectedOption = e.target.value;
                            const serviceOptions = {
                                ac: { name: 'AC', price: 100000 },
                                kulkas: { name: 'Kulkas', price: 150000 },
                                sofa: { name: 'Sofa', price: 120000 }
                            };
                            setSelectedService(serviceOptions[selectedOption]);
                        }}>
                            <option value="ac">AC</option>
                            <option value="kulkas">Kulkas</option>
                            <option value="sofa">Sofa</option>
                        </select>
                        <br />
                        <br />
                        <h3>Orang:</h3>
                    </div>

                    <div className="form-group-pesanan1">
                        <div className="counter-container">
                            <h3>Jumlah</h3>
                            <div className="counter-pesanan">
                                <button onClick={() => updateCounter(-1)}>-</button>
                                <span id="personCount">{personCount}</span>
                                <button onClick={() => updateCounter(1)}>+</button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group-pesanan1">
                        <br />
                        <br />
                        <h3>Keterangan:</h3>
                        <p>House Cleaning ini berisikan paket 5 orang, dan akan memakan <br />waktu kurang lebih
                        <span id="timeEstimate">{updateTimeEstimate()}</span> jika anda menambah satu orang maka <br />waktu akan terpotong 5 menit.</p>
                    </div>
                    <button className="continue-button-pesanan1" onClick={() => setStep(2)}>Lanjut</button>
                </div>
            )}

                {step === 2 && (
                    <div id="step2">
                        <div className="header-pesanan">
                        <div className="back-button-pesanan" onClick={() => setStep(1)}>&lt;</div>
                    <h2 className='IP1'>Informasi Pribadi</h2>
                    </div>
                    <div className="divider2"></div>
                        <br />
                        <div className="form-group-pesanan">
                            <label htmlFor="nama">Nama:</label>
                            <input type="text" id="nama" className="form-input-pesanan" placeholder="Enter Nama" value={personalInfo.nama} onChange={handleInputChange} />
                        </div>
                        <div className="form-group-pesanan">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" className="form-input-pesanan" placeholder="Enter Email" value={personalInfo.email} disabled />
                        </div>
                        <div className="form-group-pesanan">
                            <label htmlFor="nomorHp">Nomor HP:</label>
                            <input type="tel" id="nomorHp" className="form-input-pesanan" placeholder="Enter Nomor HP" value={personalInfo.nomorHp} onChange={handleInputChange} />
                        </div>
                        <button className="continue-button-pesanan2" disabled={!isStep2Valid} onClick={() => setStep(3)}>Lanjut</button>
                    </div>
                )}
                {step === 3 && (
                    <div id="step3">
                        <div className="header-pesanan">
                            <div className="back-button-pesanan" onClick={() => setStep(2)}>&lt;</div>
                            <h2 className='lokasi1'>Lokasi</h2>
                        </div>
                        <div className="divider"></div>
                        <br />
                        <div id="map" style={{ height: '200px', width: '100%' }}></div> {/* Ensure the map container has a size */}
                        <br />
                        <div className="form-group-pesanan3">
                            <label htmlFor="alamat">Lokasi:</label>
                            <input type="text" id="alamat" className="form-input-pesanan3" placeholder="Alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
                        </div>
                        <p>Contoh: Jl.Kemerdekaan Blok G No.45 RT 5 RW 11, Menteng Patokan: Samping Taman Kota</p>
                        <button className="continue-button-pesanan3" disabled={!isStep3Valid} onClick={() => setStep(4)}>Lanjut</button>
                    </div>
                )}
                {step === 4 && (
                    <div id="step4">
                        <div className="header-pesanan">
                            <div className="back-button-pesanan" onClick={() => setStep(3)}>&lt;</div>
                            <h2 className='TW1'>Tanggal dan Waktu</h2>
                        </div>
                        <div className="divider"></div>
                        <div className="calendar-pesanan">
                            <div className="calendar-header-pesanan">
                                <button onClick={() => changeMonth(-1)}>&lt;</button>
                                <span id="monthYear"></span>
                                <button onClick={() => changeMonth(1)}>&gt;</button>
                            </div>
                            <div className="calendar-days-pesanan">
                                <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Ming</span>
                            </div>
                            <div className="calendar-dates-pesanan" id="calendarDates"></div>
                        </div>
                        <div className="time-selector-pesanan">
                            <div>
                                <label htmlFor="time">Jam:</label>
                                <select id="time" className="form-input-pesanan" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                                    <option value="">Pilih Jam</option>
                                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => {
                                        const isDisabled = selectedDate && disabledTimes.some(disabled => disabled.date === selectedDate.toLocaleDateString('sv-SE') && disabled.time === time);
                                        return (
                                            <option key={time} value={time} className={isDisabled ? 'option-disabled' : ''} disabled={isDisabled}>
                                                {time}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <button className="continue-button-pesanan4" disabled={!isStep4Valid} onClick={checkTimeAvailability}>Lanjut</button>
                        </div>

                    </div>
                )}
                {step === 5 && (
                    <div className="payment-step">
                        <div className="header">
                            <div className="back-button-pesanan" onClick={() => setStep(4)}>&lt;</div>
                            <h2 className='bayarsat'>Pembayaran</h2>
                        </div>
                        <div className="divider"></div>
                        <div className="payment-summary">
                            <div className="payment-summary1">
                                <p>
                                    <span>Layanan:</span>
                                    <br />
                                    <span>{selectedService.name}</span>
                                    <span>Rp. {selectedService.price}</span>
                                </p>
                                <p>
                                    <span>Biaya Jasa Aplikasi:</span>
                                    <br />
                                    <span>Rp. 2.000</span>
                                </p>
                            </div>
                            <div className="payment-summary2">
                                <p>
                                    <span>Tambahan Orang:</span>
                                    <br />
                                    <span>Tambahan {calculatePayment().additionalPeople} orang</span>
                                    <span>Rp. {calculatePayment().additionalPeople * personPrice}</span>
                                </p>
                            </div>
                            <p className="total1">
                                <span>Subtotal:</span>
                                <span>Rp. {calculatePayment().subtotal}</span>
                            </p>
                            <div className="voucher-container">
                                <label htmlFor="voucher">Kode Voucher:</label>
                                <input type="text" id="voucher" className="form-input-pesanan" placeholder="Masukkan Kode Voucher" />
                                <button onClick={submitVoucher}>Add</button>
                            </div>
                            <p className="total1">
                                <span>Total:</span>
                                <span>Rp. {calculatePayment().total}</span>
                            </p>
                        </div>
                        <button className="continue-button" onClick={() => setStep(6)}>Lanjut</button>
                    </div>
                )}

                {step === 6 && (
                    <div id="step6" className="no-sidebar-pesanan">
                        <div className="header-pesanan">
                            <div className="back-button-pesanan" onClick={() => setStep(5)}>&lt;</div>
                            <h2 className='bayarsat3'>Metode Pembayaran</h2>
                        </div>
                        <div className="divider"></div>
                        <div className="payment-container-pesanan">
                            <div className="payment-row">
                                <div className={`e-wallet-option ${paymentMethod === 'Shopeepay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('Shopeepay')}>
                                    <img src={shopeepay} alt="Shopeepay Logo" width="100" />
                                </div>
                                <div className={`e-wallet-option ${paymentMethod === 'Gopay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('Gopay')}>
                                    <img src={gopay} alt="Gopay Logo" width="100" />
                                </div>
                                <div className={`e-wallet-option ${paymentMethod === 'Dana' ? 'selected' : ''}`} onClick={() => setPaymentMethod('Dana')}>
                                    <img src={dana} alt="Dana Logo" width="100" />
                                </div>
                            </div>
                            <div className="payment-row">
                                <div className={`bank-option ${paymentMethod === 'BCA' ? 'selected' : ''}`} onClick={() => setPaymentMethod('BCA')}>
                                    <img src={bca} alt="BCA Logo" width="100" />
                                </div>
                                <div className={`bank-option ${paymentMethod === 'BNI' ? 'selected' : ''}`} onClick={() => setPaymentMethod('BNI')}>
                                    <img src={bni} alt="BNI Logo" width="100" />
                                </div>
                                <div className={`bank-option ${paymentMethod === 'BRI' ? 'selected' : ''}`} onClick={() => setPaymentMethod('BRI')}>
                                    <img src={bri} alt="BRI Logo" width="100" />
                                </div>
                                <div className={`bank-option ${paymentMethod === 'Mandiri' ? 'selected' : ''}`} onClick={() => setPaymentMethod('Mandiri')}>
                                    <img src={mandiri} alt="Mandiri Logo" width="100" />
                                </div>
                            </div>
                            <div className="payment-row">
                                <div className={`cod-option ${paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('COD')}>
                                    <img src={cod} alt="COD Logo" width="90" />
                                </div>
                            </div>
                        </div>
                        <button className="continue-button-pesanan9" disabled={!paymentMethod} onClick={submitOrder}>Bayar !</button>
                    </div>
                )}

                {step === 7 && (
                    <div id="step7" className="no-sidebar-pesanan7">
                        <div className="header-pesanan7">
                            <button className="back-button-pesanan7" onClick={() => setStep(6)}>&lt;</button>
                            <h2 className='bayarsat2'>Pembayaran</h2>
                        </div>
                        <div className="divider"></div>
                        <div className="form-group-pesanan7">
                            <p>Total Pembayaran:</p>
                            <p id="totalPayment7" style={{ textAlign: 'right' }}>Rp. {calculatePayment().total}</p>
                        </div>
                        <div className="form-group-pesanan7">
                            <p>Pembayaranmu akan hangus dalam:</p>
                            <p id="countdown7" style={{ textAlign: 'right' }}>{formatCountdown(countdown)}</p>
                        </div>
                        <div className="form-group-pesanan7" style={{ textAlign: 'center' }}>
                            <img id="paymentLogo7" src={getPaymentLogo()} alt="Payment Method Logo" width="100" />
                        </div>
                        <div className="form-group-pesanan8" style={{ textAlign: 'center' }}>
                            <p>No Rekening</p>
                            <p>1234567890</p>
                            <p>Laili Ramadhani</p>
                        </div>
                        <button className="rating-button" onClick={handleRatingClick}>Rating</button>
                    </div>
                )}

            </div>
            {isConfirmed && (
                <div className="confirmation-popup">
                    <div className="confirmation-popup-content">
                        <h2>Pesanan Berhasil</h2>
                        <video src={ceklis} autoPlay loop muted></video>
                        <div className="button-group">
                            <Link to="/home2">
                                <button onClick={closePopup}>Kembali ke Home</button>
                            </Link>
                            <button onClick={() => navigate(`/receipt/${orderId}`)}>Lihat Receipt</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
        <Footer/>
        </>
    );
};

export default Pesanan;
