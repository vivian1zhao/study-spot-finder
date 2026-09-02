const API_BASE_URL = 'http://localhost:5001';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const submitBtn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            fname: document.getElementById('fname').value.trim(),
            lname: document.getElementById('lname').value.trim(),
            username: document.getElementById('username').value.trim(),
            pass_word: document.getElementById('password').value,
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim()
        };

        messageEl.textContent = '';
        submitBtn.disabled = true;

        try {
            const res = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                window.location.href = 'login.html';
            } else {
                messageEl.textContent = data.message || 'Registration failed. Please try again.';
            }
        } catch (err) {
            console.error('Register request failed:', err);
            messageEl.textContent = 'Unable to reach the server. Please try again.';
        } finally {
            submitBtn.disabled = false;
        }
    });
});
// register js file