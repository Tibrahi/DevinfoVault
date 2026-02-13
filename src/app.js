// src/app.js

/**
 * Global UI Controller
 * Handles Modals, Toasts, and Session Checks
 */

// Check Session on Load
function checkSession() {
    const session = localStorage.getItem('div_session');
    const path = window.location.pathname;
    
    if (!session && path.includes('dashboard.html')) {
        window.location.href = 'auth.html';
    }
    if (session && path.includes('auth.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Custom Blocking Modal (The "Window Block")
function showModal(title, message, type = 'info', onConfirm = null) {
    // Remove existing modals
    const existing = document.getElementById('custom-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = `fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm transition-opacity duration-300`;
    
    let icon = type === 'error' ? '<i class="fas fa-exclamation-circle text-red-500 text-3xl"></i>' : 
               type === 'success' ? '<i class="fas fa-check-circle text-green-500 text-3xl"></i>' : 
               '<i class="fas fa-info-circle text-blue-500 text-3xl"></i>';

    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full transform scale-100 transition-transform duration-300 border-t-4 ${type === 'error' ? 'border-red-500' : 'border-green-500'}" data-aos="zoom-in">
            <div class="text-center mb-4">
                ${icon}
                <h3 class="text-xl font-bold text-gray-800 mt-2">${title}</h3>
            </div>
            <p class="text-gray-600 text-center mb-6">${message}</p>
            <button id="modal-close-btn" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                ${onConfirm ? 'Confirm' : 'Close'}
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    const btn = document.getElementById('modal-close-btn');
    btn.addEventListener('click', () => {
        modal.remove();
        if (onConfirm) onConfirm();
    });

    // Auto remove for success messages after 3s (if user setting allows)
    if (type === 'success') {
        setTimeout(() => {
            if(document.getElementById('custom-modal')) modal.remove();
        }, 3000);
    }
}

// Toast Notification (Non-blocking)
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-5 right-5 px-6 py-3 rounded shadow-lg text-white font-semibold z-50 transform translate-x-full transition-transform duration-300 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    
    // Slide in
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    
    // Remove
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}