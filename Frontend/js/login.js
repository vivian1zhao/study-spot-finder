const API_BASE_URL = 'http://localhost:5001';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            username: document.getElementById('username').value.trim(),
            pass_word: document.getElementById('password').value
        };

        messageEl.textContent = '';
        submitBtn.disabled = true;

        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log('login response:', data);

            if (res.ok) {
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('username', payload.username);

                // give random avatar color to user
                const initials =
                    data.fname.charAt(0).toUpperCase() +
                    data.lname.charAt(0).toUpperCase();

                localStorage.setItem('userInitials', initials);

                const colorKey = `avatarColor_${data.user_id}`;
                let avatarColor = localStorage.getItem(colorKey);

                if (!avatarColor) {
                    avatarColor = getRandomAvatarColor();
                    localStorage.setItem(colorKey, avatarColor );
                }
                localStorage.setItem('avatarColor', avatarColor);

                // Store the full user object (incl. user_role) — auth.js's
                // requireAdminPage()/requireAdminAction() read "currentUser"
                // from localStorage to authorize admin page access and
                // write actions. Without this line, currentUser is never
                // set, so every admin check silently fails as "not logged in".
                localStorage.setItem('currentUser', JSON.stringify(data));

                if (data.user_role === 'admin') {
                    window.location.href = 'admin_places.html';
                } else {
                    window.location.href = 'places.html';
                }
                
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

function getRandomAvatarColor() {
    const colors = [
        "#4A7C59",
        "#5C6BC0",
        "#8E5EA2",
        "#C96A4A",
        "#3F7C85",
        "#B07A3F",
        "#7A6F9B",
        "#4F8A8B",
        "#D56A6A",
        "#6A8EAE",
        "#A06B9A",
        "#708B75"
    ];

    const randomIndex =
        Math.floor(
            Math.random() * colors.length
        );

    return colors[randomIndex];
}