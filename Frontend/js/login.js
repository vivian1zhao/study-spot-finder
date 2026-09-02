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

const API_BASE_URL = 'http://localhost:5001';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        messageEl.textContent = '';
        submitBtn.disabled = true;

        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, pass_word: password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('user_id', data.user_id);
                window.location.href = 'places.html';
            } else {
                messageEl.textContent = data.message || 'Login failed. Please try again.';
            }
        } catch (err) {
            console.error('Login request failed:', err);
            messageEl.textContent = 'Unable to reach the server. Please try again.';
        } finally {
            submitBtn.disabled = false;
        }
    });
});
// const API_BASE_URL = 'http://localhost:5001';

// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('login-form');
//     const submitBtn = document.getElementById('submit-btn');
//     const messageEl = document.getElementById('form-message');

//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const username = document.getElementById('username').value.trim();
//         const password = document.getElementById('password').value;

//         messageEl.textContent = '';
//         submitBtn.disabled = true;

//         try {
//             const res = await fetch(`${API_BASE_URL}/login`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, pass_word: password })
//             });

//             const data = await res.json();

//             if (res.ok) {
//                 localStorage.setItem('user_id', data.user_id);
//                 window.location.href = 'places.html';
//             } else {
//                 messageEl.textContent = data.message || 'Login failed. Please try again.';
//             }
//         } catch (err) {
//             console.error('Login request failed:', err);
//             messageEl.textContent = 'Unable to reach the server. Please try again.';
//         } finally {
//             submitBtn.disabled = false;
//         }
//     });
// });
// Backend API URL - Sprint 1 Flask server
// const API_BASE_URL = 'http://localhost:5001';

// // Middleware to check if user is logged in
// function requireLogin(req, res, next) {
//     if (!req.session.user_id) {
//         return res.redirect('/login.html');
//     }
//     next();
// }

// app.get('/', (req, res) => {
//     res.redirect('/login.html');
// });

// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         const response = await axios.post(`${API_BASE_URL}/login`, {
//             username,
//             pass_word: password
//         });

//         if (response.status === 200) {
//             req.session.user_id = response.data.user_id;

//             // const initials =
//             //     response.data.fname.charAt(0).toUpperCase() +
//             //     response.data.lname.charAt(0).toUpperCase();

//             return res.json({
//                 message: 'Login successful',
//                 user_id: response.data.user_id,
//                 // initials: initials
//             });
//         }
//     } catch (err) {
//         console.error('Login error:', err.message);
//         if (err.response) {
//             console.error('Backend response:', err.response.status, err.response.data);
//             return res.status(err.response.status).json(err.response.data);
//         }
//         res.status(500).json({ message: 'Unable to reach login service' });
//     }
// });

module.exports = { app, requireLogin };
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// const express = require('express');
// const axios = require('axios');
// const session = require('express-session');

// const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(__dirname));

// app.use(session({
//     secret: 'change-this-to-a-real-secret',
//     resave: false,
//     saveUninitialized: false
// }));

// // Backend API URL - Sprint 1 Flask server
// const API_BASE_URL = 'http://localhost:5001/login';

// // Middleware to check if user is logged in
// function requireLogin(req, res, next) {
//     if (!req.session.user_id) {
//         return res.redirect('/login.html');
//     }
//     next();
// }

// // ===== serve the login page =====
// // with a static public/login.html, this route isn't needed for GET /login —
// // express.static already serves it. Kept here only if you want / to alias to it.
// app.get('/', (req, res) => {
//     res.redirect('/login.html');
// });

// // Handle login - connects to Sprint 1 login API
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         const response = await axios.post(`${API_BASE_URL}/login`, {
//             username,
//             pass_word: password
//         });

//         if (response.status === 200) {
//             req.session.user_id = response.data.user_id;
//             return res.json({ message: 'Login successful' });
//         }
//     } catch (err) {
//         console.error('Login error:', err.message);
//         if (err.response) {
//             console.error('Backend response:', err.response.status, err.response.data);
//             return res.status(err.response.status).json(err.response.data);
//         }
//         res.status(500).json({ message: 'Unable to reach login service' });
//     }
// });

// module.exports = { app, requireLogin };
// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));