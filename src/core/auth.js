// src/core/auth.js
// Handles authentication logic

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function setupAuthForms() {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const hashedPassword = await hashPassword(password);
        
        // Simulate DB call (replace with actual db.js call)
        // For demo, assume success if username/password match dummy
        if (username === 'user' && hashedPassword === await hashPassword('pass')) {
            localStorage.setItem('session', 'valid');
            localStorage.setItem('masterKey', hashedPassword); // For decryption
            window.location.href = 'dashboard.html';
        } else {
            showMessage('authMessage', 'Invalid credentials');
        }
    });

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const hashedPassword = await hashPassword(password);
        
        // Simulate DB insert (replace with db.js)
        showMessage('authMessage', 'Registration successful! Please login.', 'success');
    });
}

function logout() {
    localStorage.removeItem('session');
    localStorage.removeItem('masterKey');
    window.location.href = 'auth.html';
}