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


module.exports = { app, requireLogin };
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
