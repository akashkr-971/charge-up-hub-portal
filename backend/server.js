// server.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pool from './db.js';


const app = express();
app.use(cors());
app.use(express.json());

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  console.log('Signup request body:', req.body);
  const { username, email, password, vehicle_number, model, brand } = req.body;
  if (!username || !email || !password || !vehicle_number) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user and get the inserted id
    const [userResult] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    const userId = userResult.insertId;
    // Insert vehicle details
    await pool.query('INSERT INTO vehicles (user_id, vehicle_number, model, brand) VALUES (?, ?, ?, ?)', [userId, vehicle_number, model || null, brand || null]);
    res.status(201).json({ message: 'User and vehicle registered successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
