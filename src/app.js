const API_URL = 'http://localhost:3000/api';

// --- UTILS & UI ---

function showModal(title, message, type = 'info', onConfirm = null) {
    // Blocking Overlay
    const modal = document.createElement('div');
    modal.className = `fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity`;
    
    let icon = type === 'error' ? '<i class="fas fa-exclamation-circle text-red-500 text-4xl"></i>' : 
               type === 'success' ? '<i class="fas fa-check-circle text-green-500 text-4xl"></i>' : 
               '<i class="fas fa-lock text-green-500 text-4xl"></i>';

    let contentHtml = `
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border-t-4 ${type === 'error' ? 'border-red-500' : 'border-green-500'}">
            <div class="mb-4">${icon}</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">${title}</h3>
            <div class="text-gray-600 mb-6">${message}</div>
            <div class="flex gap-2 justify-center">
                <button id="modal-close" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Close</button>
                ${onConfirm ? `<button id="modal-confirm" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Confirm</button>` : ''}
            </div>
        </div>
    `;

    modal.innerHTML = contentHtml;
    document.body.appendChild(modal);

    document.getElementById('modal-close').onclick = () => modal.remove();
    if(onConfirm) {
        document.getElementById('modal-confirm').onclick = () => {
            modal.remove();
            onConfirm();
        };
    }

    // Auto close success modals
    if(type === 'success') setTimeout(() => modal.remove(), 2500);
}

function getLogo(platform) {
    return `https://logo.clearbit.com/${platform.toLowerCase()}.com`;
}

// --- AUTH LOGIC ---

function toggleAuth(view) {
    const login = document.getElementById('login-view');
    const register = document.getElementById('register-view');
    if(view === 'register') {
        login.classList.add('hidden');
        register.classList.remove('hidden');
    } else {
        register.classList.add('hidden');
        login.classList.remove('hidden');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const data = {
        fullName: document.getElementById('r-fullname').value,
        username: document.getElementById('r-user').value,
        email: document.getElementById('r-email').value,
        password: document.getElementById('r-pass').value
    };

    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await res.json();

    if(result.success) {
        showModal('Success', 'Account created! Please login.', 'success');
        toggleAuth('login');
    } else {
        showModal('Error', result.error, 'error');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('l-user').value;
    const pass = document.getElementById('l-pass').value;

    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });
    const result = await res.json();

    if(result.success) {
        // 2FA Simulation
        const code = Math.floor(1000 + Math.random() * 9000);
        showModal('2-Step Verification', `
            <p>Code sent to email: <b>${code}</b></p>
            <input type="text" id="2fa-code" class="border border-green-300 rounded p-2 mt-2 w-full text-center text-xl tracking-widest" placeholder="XXXX">
        `, 'info', () => {
            const input = document.getElementById('2fa-code').value;
            if(input == code) {
                localStorage.setItem('div_user', JSON.stringify(result.user));
                // Store password temporarily in Session Storage for encryption/decryption keys
                sessionStorage.setItem('div_master', pass);
                window.location.href = 'dashboard.html';
            } else {
                showModal('Error', 'Invalid 2FA Code', 'error');
            }
        });
    } else {
        showModal('Access Denied', result.error, 'error');
    }
}

// --- DASHBOARD LOGIC ---

if(window.location.pathname.includes('dashboard.html')) {
    const user = JSON.parse(localStorage.getItem('div_user'));
    if(!user) window.location.href = 'auth.html';

    // Load Profile
    document.getElementById('display-name').textContent = user.username;
    document.getElementById('profile-name').textContent = user.full_name;
    document.getElementById('profile-bio').textContent = user.bio;
    document.getElementById('profile-date').textContent = "Member since " + new Date(user.created_at).toLocaleDateString();

    loadLogs(user.id);
    loadCredentials(user.id);
}

function logout() {
    localStorage.removeItem('div_user');
    sessionStorage.removeItem('div_master');
    window.location.href = 'index.html';
}

async function loadLogs(userId) {
    const res = await fetch(`${API_URL}/logs/${userId}`);
    const logs = await res.json();
    const list = document.getElementById('activity-list');
    list.innerHTML = logs.map(l => `
        <li class="text-xs text-gray-500 border-b border-gray-100 py-2">
            <span class="font-mono text-green-600">[${new Date(l.timestamp).toLocaleTimeString()}]</span> ${l.action}
        </li>
    `).join('');
}

// --- CRYPTO & VAULT ---

// Encryption: AES-GCM
async function getCryptoKey(password) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), {name: "PBKDF2"}, false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: enc.encode("devinfovault_salt"), iterations: 100000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );
}

async function addCredential(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('div_user'));
    const masterPass = sessionStorage.getItem('div_master'); // Used for encryption
    
    if(!masterPass) {
        showModal('Error', 'Session expired. Relogin required.', 'error');
        return;
    }

    const platform = document.getElementById('c-platform').value;
    const loginUser = document.getElementById('c-user').value;
    const rawPass = document.getElementById('c-pass').value;
    const category = document.getElementById('c-category').value;

    // Encrypt
    const key = await getCryptoKey(masterPass);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, new TextEncoder().encode(rawPass));

    // Convert to Hex for storage
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const encHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');

    const res = await fetch(`${API_URL}/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: user.id,
            platform,
            url: platform.toLowerCase() + '.com',
            loginUser,
            encPass: encHex,
            iv: ivHex,
            category
        })
    });

    if(res.ok) {
        showModal('Saved', 'Credential encrypted and stored.', 'success');
        e.target.reset();
        loadCredentials(user.id);
    }
}

async function loadCredentials(userId) {
    const res = await fetch(`${API_URL}/credentials/${userId}`);
    const creds = await res.json();
    
    const grid = document.getElementById('vault-grid');
    grid.innerHTML = creds.map(c => `
        <div class="bg-white border border-green-100 p-4 rounded-lg shadow-sm hover:shadow-md transition flex items-center justify-between">
            <div class="flex items-center gap-4">
                <img src="${getLogo(c.platform_name)}" onerror="this.src='https://via.placeholder.com/40?text=${c.platform_name[0]}'" class="w-10 h-10 rounded-full bg-gray-100 object-cover border">
                <div>
                    <h4 class="font-bold text-gray-800">${c.platform_name}</h4>
                    <p class="text-xs text-gray-500">${c.username_login}</p>
                    <span class="text-xs bg-green-100 text-green-700 px-2 rounded-full">${c.category}</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="viewPassword('${c.encrypted_password}', '${c.iv}')" class="text-gray-400 hover:text-green-500 transition px-2"><i class="fas fa-eye"></i></button>
                <button onclick="deleteCredential(${c.id})" class="text-gray-400 hover:text-red-500 transition px-2"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function deleteCredential(id) {
    if(!confirm('Are you sure?')) return;
    fetch(`${API_URL}/credentials/${id}`, { method: 'DELETE' })
        .then(() => loadCredentials(JSON.parse(localStorage.getItem('div_user')).id));
}

// Security Check for Viewing Password
window.viewPassword = (encHex, ivHex) => {
    // Blocking Popup asking for Master Password again
    showModal('Verify Identity', `
        <p class="mb-2">Enter your master password to decrypt:</p>
        <input type="password" id="verify-pass" class="border p-2 rounded w-full mb-4">
    `, 'lock', async () => {
        const inputPass = document.getElementById('verify-pass').value;
        const masterPass = sessionStorage.getItem('div_master'); // Validate against session logic or hash
        
        try {
            const key = await getCryptoKey(inputPass);
            const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            const encrypted = new Uint8Array(encHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            
            const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, encrypted);
            const plainText = new TextDecoder().decode(decrypted);

            // Show Decrypted Password temporarily
            showModal('Decrypted', `
                <div class="bg-gray-100 p-3 rounded text-xl font-mono select-all text-center tracking-widest">${plainText}</div>
                <p class="text-xs mt-2 text-red-400">Auto-closing in 5 seconds...</p>
            `, 'success');
            
            // Auto-Close logic inside the showModal handles the timer if type is success
            
        } catch(e) {
            showModal('Decryption Failed', 'Incorrect Password or Corrupted Data.', 'error');
        }
    });
};