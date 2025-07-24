// server.js
import express from 'express';
import cors from 'cors';
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
    // Store password as plain text (not recommended for production)
    const [userResult] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
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
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// Feedback submission endpoint
app.post('/api/feedback', async (req, res) => {
  const { user_id, feedback } = req.body;
  if (!feedback) {
    return res.status(400).json({ message: 'Feedback is required.' });
  }
  try {
    await pool.query(
      'INSERT INTO feedback (user_id, feedback) VALUES (?, ?)',
      [user_id || null, feedback]
    );
    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get vehicle details for a user
app.get('/api/vehicle/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Fetching vehicle for user ID:', userId);
  try {
    const [vehicles] = await pool.query('SELECT * FROM vehicles WHERE user_id = ?', [userId]);
    if (vehicles.length === 0) {
      return res.status(404).json({ message: 'No vehicle found for this user.' });
    }
    res.json({ vehicle: vehicles[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update vehicle details for a user
app.put('/api/vehicle/:userId', async (req, res) => {
  const { userId } = req.params;
  const { vehicle_number, model, brand, year } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE vehicles SET vehicle_number = ?, model = ?, brand = ?, year = ? WHERE user_id = ?',
      [vehicle_number, model, brand, year, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No vehicle found for this user.' });
    }
    res.json({ message: 'Vehicle details updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Booking endpoint
app.post('/api/booking', async (req, res) => {
  const { user_id, station_id, station_name, date, time, duration } = req.body;
  if (!user_id || !station_id || !station_name || !date || !time || !duration) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }
  try {
    await pool.query(
      'INSERT INTO bookings (user_id, station_id, station_name, date, time, duration) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, station_id, station_name, date, time, duration]
    );
    res.status(201).json({ message: 'Booking saved successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all bookings for a user (booking history)
app.get('/api/bookings/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('GET /api/bookings/:userId called with userId:', userId);
  try {
    const [bookings] = await pool.query('SELECT * FROM bookings WHERE user_id = ? ORDER BY date DESC, time DESC', [userId]);
    console.log('Bookings found:', bookings.length);
    res.json({ bookings });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Get all feedback submissions with username
app.get('/api/feedbacks', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT feedback.*, users.username 
      FROM feedback 
      LEFT JOIN users ON feedback.user_id = users.id 
      ORDER BY feedback.created_at DESC
    `);
    // Parse feedback for stars/description if not present
    const feedbacks = rows.map(row => {
      let stars = row.stars;
      let description = row.description || '';
      // If stars is missing, try to parse from feedback string
      if (stars === undefined && typeof row.feedback === 'string') {
        // Example: 'Rating: 5, Experience: excellent, Comment: Nice'
        const ratingMatch = row.feedback.match(/Rating:\s*(\d+)/i);
        if (ratingMatch) stars = parseInt(ratingMatch[1], 10);
        const commentMatch = row.feedback.match(/Comment:\s*([^,]+)/i);
        if (commentMatch) description = commentMatch[1].trim();
        else {
          // fallback: use Experience or whole feedback
          const expMatch = row.feedback.match(/Experience:\s*([^,]+)/i);
          if (expMatch) description = expMatch[1].trim();
          else description = row.feedback;
        }
      }
      return {
        ...row,
        stars: stars !== undefined ? stars : 5,
        description
      };
    });
    res.json({ feedbacks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Get all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const [vehicles] = await pool.query('SELECT * FROM vehicles');
    res.json({ vehicles });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Get all stations
app.get('/api/stations', async (req, res) => {
  try {
    const [stations] = await pool.query('SELECT * FROM stations');
    res.json({ stations });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Add a new station
app.post('/api/stations', async (req, res) => {
  let { name, address, status, availableSlots, totalSlots, power, price, rating, amenities } = req.body;
  if (!name || !address || availableSlots === undefined || totalSlots === undefined) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  // Default status to 'online' if not provided or invalid
  const validStatuses = ['online', 'offline', 'maintenance'];
  if (!status || !validStatuses.includes(status)) status = 'online';
  try {
    await pool.query(
      'INSERT INTO stations (name, address, availableSlots, totalSlots, power, price, rating, amenities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, address, availableSlots, totalSlots, power || null, price || null, rating || null, amenities || null, status]
    );
    res.status(201).json({ message: 'Station added successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Update a station by ID
app.put('/api/stations/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, status, availableSlots, totalSlots, power, price, rating, amenities } = req.body;
  if (!name || !address || availableSlots === undefined || totalSlots === undefined) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  const validStatuses = ['online', 'offline', 'maintenance'];
  const safeStatus = status && validStatuses.includes(status) ? status : 'online';
  try {
    const [result] = await pool.query(
      'UPDATE stations SET name=?, address=?, availableSlots=?, totalSlots=?, power=?, price=?, rating=?, amenities=?, status=? WHERE id=?',
      [name, address, availableSlots, totalSlots, power || null, price || null, rating || null, amenities || null, safeStatus, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Station not found.' });
    }
    res.json({ message: 'Station updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Delete a station by ID
app.delete('/api/stations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM stations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Station not found.' });
    }
    res.json({ message: 'Station deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
