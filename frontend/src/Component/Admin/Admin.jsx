import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for simplicity
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = () => {
    fetch('http://localhost:3001/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Login successful') {
        setIsLoggedIn(true);
        fetchOrders();
      } else {
        alert('Invalid credentials');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  const fetchOrders = () => {
    fetch('http://localhost:3001/admin/orders')
    .then(response => response.json())
    .then(data => {
      const formattedData = data.map(order => ({
        ...order,
        tanggal: new Date(order.tanggal).toLocaleDateString('id-ID', {
          year: 'numeric', month: '2-digit', day: '2-digit'
        }),
        waktu: order.waktu.slice(0, 5)
      }));
      setOrders(formattedData);
      setFilteredOrders(formattedData);
    })
    .catch(error => console.error('Error:', error));
  };

  const updateOrderStatus = (id, status) => {
    fetch(`http://localhost:3001/admin/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Order status updated') {
        fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    navigate('/login');
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setFilteredOrders(
      orders.filter(order =>
        order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, orders]);

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <button className="logout-button" onClick={logout}>Logout</button>
      <h2>Orders</h2>
      <input
        type="text"
        placeholder="Search by Order ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Nomor HP</th>
            <th>Alamat</th>
            <th>Tanggal</th>
            <th>Waktu</th>
            <th>Total Orang</th>
            <th>Harga Total</th>
            <th>Metode Pembayaran</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.nama}</td>
              <td>{order.email}</td>
              <td>{order.nomorHp}</td>
              <td>{order.alamat}</td>
              <td>{order.tanggal}</td>
              <td>{order.waktu}</td>
              <td>{order.total_orang}</td>
              <td>Rp {order.harga_total.toLocaleString('id-ID')}</td>
              <td>{order.metode_pembayaran}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => updateOrderStatus(order.id, 'Confirmed')}>Confirm</button>
                <button onClick={() => updateOrderStatus(order.id, 'Canceled')}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
