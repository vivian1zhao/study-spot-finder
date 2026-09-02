const express = require('express');
const axios = require('axios');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.use(session({
    secret: 'change-this-to-a-real-secret',
    resave: false,
    saveUninitialized: false
}));

// Backend API URL - Sprint 1 Flask server
const API_BASE_URL = 'http://localhost:5001';

app.get('/', (req, res) => {
    res.redirect('/register.html');
});

app.post('/register', async (req, res) => {
    try {
        const {
            fname,
            lname,
            password,
            email,
            phone,
            address,
            city,
            state,
            username
        } = req.body;

        const response = await axios.post(`${API_BASE_URL}/register`, {
            fname,
            lname,
            pass_word: password,
            email,
            phone,
            address,
            city,
            state,
            username
        });

        if (response.status === 201) {
            return res.status(201).json(response.data);
        }
    } catch (err) {
        console.error('Register error:', err.message);
        if (err.response) {
            console.error('Backend response:', err.response.status, err.response.data);
            return res.status(err.response.status).json(err.response.data);
        }
        res.status(500).json({ message: 'Unable to reach registration service' });
    }
});

module.exports = { app };

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));