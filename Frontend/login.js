const express = require('express');
const axios = require('axios');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: 'change-this-to-a-real-secret',
    resave: false,
    saveUninitialized: false
}));

// Backend API URL - Sprint 1 Flask server
const API_BASE_URL = 'http://localhost:5001';

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (!req.session.user_id) {
        return res.redirect('/login.html');
    }
    next();
}

// ===== serve the login page =====
// with a static public/login.html, this route isn't needed for GET /login —
// express.static already serves it. Kept here only if you want / to alias to it.
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Handle login - connects to Sprint 1 login API
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const response = await axios.post(`${API_BASE_URL}/login`, {
            username,
            pass_word: password
        });

        if (response.status === 200) {
            req.session.user_id = response.data.user_id;
            return res.json({ message: 'Login successful' });
        }
    } catch (err) {
        console.error('Login error:', err.message);
        if (err.response) {
            console.error('Backend response:', err.response.status, err.response.data);
            return res.status(err.response.status).json(err.response.data);
        }
        res.status(500).json({ message: 'Unable to reach login service' });
    }
});

module.exports = { app, requireLogin };