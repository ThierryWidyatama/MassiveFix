const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_auth'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to user_auth database.');
});

const dbPesanan = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pesanan'
});

dbPesanan.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to pesanan database.');
});

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// User registration endpoint
app.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailSql, [email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (result.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const insertSql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [firstName, lastName, email, password], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(200).json({ message: 'User registered' });
    });
  });
});

// User login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@admin.com' && password === 'admin') {
    return res.status(200).json({ message: 'Login successful', role: 'admin' });
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (result.length > 0) {
      return res.status(200).json({ message: 'Login successful', role: 'user' });
    } else {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  });
});

// Endpoint to get user information
app.get('/user/:email', (req, res) => {
  const email = req.params.email;
  const sql = 'SELECT first_name, last_name, email, phone, address, profile_image FROM users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (result.length > 0) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  });
});

// Endpoint to update user information
app.put('/user/:email', (req, res) => {
  const email = req.params.email;
  const { firstName, lastName, phone, address } = req.body;
  const sql = 'UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE email = ?';
  db.query(sql, [firstName, lastName, phone, address, email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json({ message: 'User updated' });
  });
});

// Endpoint to upload profile image
app.post('/upload-profile-image/:email', upload.single('profileImage'), (req, res) => {
  const email = req.params.email;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

  if (!profileImage) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const sql = 'UPDATE users SET profile_image = ? WHERE email = ?';
  db.query(sql, [profileImage, email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json({ message: 'Profile image uploaded', profileImage });
  });
});

// Endpoint to delete profile image
app.delete('/delete-profile-image/:email', (req, res) => {
  const email = req.params.email;
  const getImageSql = 'SELECT profile_image FROM users WHERE email = ?';
  db.query(getImageSql, [email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    const profileImage = result[0].profile_image;
    if (profileImage) {
      fs.unlink(path.join(__dirname, profileImage), (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
      });
    }
    const sql = 'UPDATE users SET profile_image = NULL WHERE email = ?';
    db.query(sql, [email], (updateErr) => {
      if (updateErr) {
        console.error('Database query error:', updateErr);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(200).json({ message: 'Profile image deleted' });
    });
  });
});

// Endpoint to change password
app.post('/change-password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const sqlCheck = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sqlCheck, [email, currentPassword], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (result.length === 0) {
      return res.status(400).json({ error: "Your Current Password's Wrong" });
    }

    const sqlUpdate = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(sqlUpdate, [newPassword, email], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(200).json({ message: 'Password changed successfully' });
    });
  });
});

// Admin login endpoint
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@admin.com' && password === 'admin') {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Endpoint to get list of orders
app.get('/admin/orders', (req, res) => {
  const sql = 'SELECT * FROM orders';
  dbPesanan.query(sql, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json(result);
  });
});

// Endpoint to update order status
app.put('/admin/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  dbPesanan.query(sql, [status, orderId], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json({ message: 'Order status updated' });
  });
});

// Endpoint to place an order
app.post('/order', (req, res) => {
  const { nama, email, nomorHp, alamat, tanggal, waktu, total_orang, harga_total, metode_pembayaran, user_email } = req.body;
  const insertSql = 'INSERT INTO orders (nama, email, nomorHp, alamat, tanggal, waktu, total_orang, harga_total, metode_pembayaran, user_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  dbPesanan.query(insertSql, [nama, email, nomorHp, alamat, tanggal, waktu, total_orang, harga_total, metode_pembayaran, user_email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    const newOrderId = result.insertId;
    const newDisabledTime = { date: tanggal, time: waktu };

    // Save the new disabled time to the server
    const disabledTimeSql = 'INSERT INTO disabled_times (date, time) VALUES (?, ?)';
    dbPesanan.query(disabledTimeSql, [newDisabledTime.date, newDisabledTime.time], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      console.log('Disabled time saved:', newDisabledTime);
    });

    res.status(200).json({ message: 'Order placed successfully', orderId: newOrderId });
  });
});

// Endpoint to check order status
app.get('/order/:id', (req, res) => {
  const orderId = req.params.id;
  const sql = 'SELECT status, tanggal, waktu FROM orders WHERE id = ?';
  dbPesanan.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (result.length > 0) {
      const { status, tanggal, waktu } = result[0];
      if (status === 'Confirmed') {
        const newDisabledTime = { date: tanggal, time: waktu };
        const insertSql = 'INSERT INTO disabled_times (date, time) VALUES (?, ?)';
        dbPesanan.query(insertSql, [tanggal, waktu], (err, result) => {
          if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Server error' });
          }
          console.log('Disabled time saved:', newDisabledTime);
        });
      }
      res.status(200).json({ status });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });
});

// Endpoint to get receipt list
app.get('/receipt-list/:email', (req, res) => {
  const email = req.params.email;
  const sql = 'SELECT * FROM receipts WHERE user_email = ? ORDER BY order_id DESC';
  dbPesanan.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json(result);
  });
});

// Endpoint to save receipt
app.post('/save-receipt', (req, res) => {
  const { user_email, order_id, receipt_data } = req.body;
  const sql = 'INSERT INTO receipts (user_email, order_id, receipt_data) VALUES (?, ?, ?)';
  dbPesanan.query(sql, [user_email, order_id, JSON.stringify(receipt_data)], (err, result) => {
    if (err) {
      console.error('Error saving receipt:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    console.log('Receipt saved for order_id:', order_id);
    res.status(200).json({ message: 'Receipt saved' });
  });
});

// Endpoint to get receipt by order ID including review details
app.get('/receipt/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const sql = 'SELECT * FROM receipts WHERE order_id = ?';
  dbPesanan.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (result.length > 0) {
      console.log('Receipt found for order_id:', orderId, result[0]);
      res.status(200).json(result[0]);
    } else {
      console.log('Receipt not found for order ID:', orderId);
      res.status(404).json({ error: 'Receipt not found' });
    }
  });
});

// Endpoint to save user reviews
app.post('/save-review', (req, res) => {
  const { orderId, rating, description, ratings } = req.body;
  const { kebersihan, pelayanan, kecepatan, profesional } = ratings;

  if (!orderId || !rating || !description || !ratings) {
    console.error('Missing required fields', { orderId, rating, description, ratings });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'UPDATE receipts SET rating = ?, description = ?, kebersihan = ?, pelayanan = ?, kecepatan = ?, profesional = ? WHERE order_id = ?';
  dbPesanan.query(sql, [rating, description, kebersihan, pelayanan, kecepatan, profesional, orderId], (err, result) => {
    if (err) {
      console.error('Error saving review:', err);
      return res.status(500).json({ error: 'Server error', details: err });
    }
    if (result.affectedRows === 0) {
      console.error('Order not found', { orderId });
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Review saved successfully' });
  });
});

// Endpoint to get all user reviews
app.get('/reviews', (req, res) => {
  const queryReceipts = `
    SELECT r.user_email, r.rating, r.description, r.kebersihan, r.pelayanan, r.kecepatan, r.profesional
    FROM receipts r;
  `;

  dbPesanan.query(queryReceipts, (errorReceipts, receipts) => {
    if (errorReceipts) {
      console.error('Database query error:', errorReceipts);
      return res.status(500).json({ error: errorReceipts.message });
    }

    if (receipts.length === 0) {
      return res.status(200).json([]);
    }

    const userEmails = receipts.map(receipt => receipt.user_email);
    const queryUsers = `
      SELECT email, first_name, last_name, profile_image
      FROM users
      WHERE email IN (?);
    `;

    db.query(queryUsers, [userEmails], (errorUsers, users) => {
      if (errorUsers) {
        console.error('Database query error:', errorUsers);
        return res.status(500).json({ error: errorUsers.message });
      }

      const usersMap = users.reduce((acc, user) => {
        acc[user.email] = user;
        return acc;
      }, {});

      const reviews = receipts.map(receipt => ({
        ...receipt,
        ...usersMap[receipt.user_email]
      }));

      res.json(reviews);
    });
  });
});

// Endpoint to get disabled times
app.get('/disabled-times', (req, res) => {
  const sql = 'SELECT date, time FROM disabled_times';
  dbPesanan.query(sql, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json(result);
  });
});

// Endpoint to save disabled time
app.post('/disabled-times', (req, res) => {
  const { date, time } = req.body;
  const sql = 'INSERT INTO disabled_times (date, time) VALUES (?, ?)';
  dbPesanan.query(sql, [date, time], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json({ message: 'Disabled time added' });
  });
});

// Endpoint to check time availability
app.get('/check-time', (req, res) => {
  const { date, time } = req.query;
  const sql = 'SELECT * FROM disabled_times WHERE date = ? AND time = ?';
  dbPesanan.query(sql, [date, time], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(200).json({ isAvailable: result.length === 0 });
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
