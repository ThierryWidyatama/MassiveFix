import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Component/Navbar/Navbar';
import Footer from '../../Component/Footer/Footer';
import './Receipt.css';

const Receipt = () => {
    const { orderId } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                console.log('Fetching receipt for order ID:', orderId);
                const response = await axios.get(`http://localhost:3001/receipt/${orderId}`);
                console.log('Receipt data received:', response.data);
                setReceipt(response.data);

                // Fetch order status
                const orderResponse = await axios.get(`http://localhost:3001/order/${orderId}`);
                setStatus(orderResponse.data.status);
            } catch (error) {
                console.error('Error fetching receipt:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipt();
    }, [orderId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!receipt) {
        return <div>Receipt not found</div>;
    }

    const { waktu_pembayaran, rincian_pembayaran, metode_pembayaran, alamat, layanan } = JSON.parse(receipt.receipt_data);

    return (
        <>
            <Navbar />
            <div className="receipt-container">
                <div className="receipt-header">
                    <div className="back-button" onClick={() => window.history.back()}>
                        <i className="fas fa-arrow-left"></i> Back
                    </div>
                    <h1>No. Pesanan: {orderId}</h1>
                    <div className="total-payment">Total Pembayaran: <strong>Rp. {rincian_pembayaran.total_pembayaran}</strong></div>
                </div>
                <div className="receipt-info">
                    <p><strong>Waktu Pembayaran:</strong> {new Date(waktu_pembayaran).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })}</p>
                </div>
                <div className="receipt-payment-details">
                    <h2>Rincian Pembayaran</h2>
                    <table className="payment-details-table">
                        <tbody>
                            <tr>
                                <td>Subtotal Pembersihan</td>
                                <td>Rp. {rincian_pembayaran.subtotal_pembersihan}</td>
                            </tr>
                            <tr>
                                <td>Biaya Jasa Aplikasi</td>
                                <td>Rp. {rincian_pembayaran.biaya_jasa_aplikasi}</td>
                            </tr>
                            <tr>
                                <td>Diskon</td>
                                <td>-Rp. {rincian_pembayaran.diskon}</td>
                            </tr>
                            <tr className="total-row">
                                <td>Total Pembayaran</td>
                                <td>Rp. {rincian_pembayaran.total_pembayaran}</td>
                            </tr>
                            <tr>
                                <td>Metode Pembayaran</td>
                                <td>{metode_pembayaran}</td>
                            </tr>
                            <tr>
                                <td>Layanan</td>
                                <td>{layanan}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="receipt-address">
                    <div className="receipt-section-title">Alamat Pembersihan</div>
                    <p>{alamat}</p>
                </div>
                <div className="receipt-status">
                    <div className="receipt-section-title">Status</div>
                    <p>{status === 'Confirmed' ? 'Pesanan Dikonfirmasi' : 'Pesanan Dibatalkan'}</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Receipt;
