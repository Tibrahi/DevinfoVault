// src/app.js
// Main application logic, handles session checks and redirects

function checkSession() {
    // Simulate session check (in real app, use localStorage or cookies)
    const session = localStorage.getItem('session');
    if (!session) {
        window.location.href = '../pages/auth.html';
    }
}

// Example global utility functions
function showMessage(elementId, message, type = 'error') {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.classList.remove('text-red-500', 'text-green-500');
    el.classList.add(type === 'error' ? 'text-red-500' : 'text-green-500');
}