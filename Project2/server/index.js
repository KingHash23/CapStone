const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // dotenv is configured in db.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to MySQL database');
    connection.release();
});

// Basic route
app.get('/HELLO', (req, res) => {
    res.json({ message: 'Welcome to Job Portal API' });
});

//  Register User (Without bcrypt or JWT)
app.post('/api/auth/register', (req, res) => {
    const { email, password, role, firstName, lastName } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Insert new user
        db.query(
            'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
            [email, password, role, firstName, lastName],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Error registering user' });

                const userId = result.insertId;
                res.status(201).json({
                    message: 'User registered successfully',
                    user: { id: userId, email, role, firstName, lastName }
                });
            }
        );
    });
});

// Login User (Without bcrypt or JWT)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        // Simple password check (⚠ Not secure, will be improved later)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name, lastName: user.last_name }
        });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
