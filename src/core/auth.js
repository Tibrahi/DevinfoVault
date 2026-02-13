// src/core/auth.js

// Toggle between Login and Register panels
function toggleAuthPanel(type) {
    const container = document.getElementById('auth-container');
    const title = document.getElementById('auth-title');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const formHelp = document.getElementById('form-help');

    // Reset all
    formLogin.classList.add('hidden');
    formRegister.classList.add('hidden');
    formHelp.classList.add('hidden');

    if (type === 'register') {
        title.innerText = 'Create Account';
        formRegister.classList.remove('hidden');
        formRegister.classList.add('animate-fade-in-up');
    } else if (type === 'help') {
        title.innerText = 'Account Recovery';
        formHelp.classList.remove('hidden');
        formHelp.classList.add('animate-fade-in-up');
    } else {
        title.innerText = 'Welcome Back';
        formLogin.classList.remove('hidden');
        formLogin.classList.add('animate-fade-in-up');
    }
}

// 2FA Simulation Modal
function prompt2FA(callback) {
    const code = Math.floor(1000 + Math.random() * 9000);
    alert(`[SIMULATION] Your 2FA Code is: ${code}`); // In real app, this is SMS/Email

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-[60]';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 class="font-bold text-lg mb-4 text-green-600">Two-Step Verification</h3>
            <p class="mb-4">Enter the code sent to your device.</p>
            <input type="text" id="2fa-input" class="border border-green-300 rounded px-4 py-2 w-full mb-4 text-center tracking-widest font-bold" maxlength="4">
            <button id="verify-2fa" class="bg-green-500 text-white w-full py-2 rounded">Verify</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('verify-2fa').onclick = () => {
        const input = document.getElementById('2fa-input').value;
        if (input == code) {
            modal.remove();
            callback();
        } else {
            showToast('Invalid Code', 'error');
        }
    };
}

async function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if(pass.length < 6) return showModal('Security Alert', 'Password must be at least 6 characters', 'error');

    // Hash password for auth (Separate from encryption master key)
    const encoder = new TextEncoder();
    const data = encoder.encode(pass);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const res = DB.users.create({ username: user, email, password_hash: hashHex, full_name: user });
    
    if (res.success) {
        showModal('Success', 'Account created! Please login.', 'success', () => toggleAuthPanel('login'));
    } else {
        showModal('Error', res.error, 'error');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    const dbUser = DB.users.find(user);
    
    // Hash check
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(pass));
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (dbUser && dbUser.password_hash === hashHex) {
        // Trigger 2FA
        prompt2FA(() => {
            // Save Session
            localStorage.setItem('div_session', JSON.stringify({ id: dbUser.id, username: dbUser.username }));
            // Save Master Password temporarily in memory (Session Storage) for encryption/decryption
            sessionStorage.setItem('div_master', pass); 
            DB.logs.add(dbUser.id, 'LOGIN_SUCCESS');
            window.location.href = 'dashboard.html';
        });
    } else {
        DB.logs.add(0, 'LOGIN_FAILED'); // Log failed attempt
        showModal('Access Denied', 'Invalid credentials.', 'error');
    }
}