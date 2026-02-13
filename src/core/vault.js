// src/core/vault.js

let currentUser = null;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    checkSession();
    
    const session = JSON.parse(localStorage.getItem('div_session'));
    if(!session) return;

    // Load User Data
    currentUser = DB.users.find(session.username);
    renderUserInfo();
    loadVault();
    loadLogs();
});

function renderUserInfo() {
    document.getElementById('display-name').textContent = currentUser.full_name || currentUser.username;
    document.getElementById('display-bio').textContent = currentUser.bio || "No bio set.";
    document.getElementById('display-date').textContent = "Member since " + new Date(currentUser.created_at).toLocaleDateString();
}

// Logo Fetcher
function getLogo(platform) {
    const domain = platform.toLowerCase() + '.com';
    return `https://logo.clearbit.com/${domain}`;
}

async function saveCredential(e) {
    e.preventDefault();
    const platform = document.getElementById('c-platform').value;
    const user = document.getElementById('c-user').value;
    const pass = document.getElementById('c-pass').value;
    const cat = document.getElementById('c-category').value;
    
    const masterPass = sessionStorage.getItem('div_master');
    if(!masterPass) {
        showModal('Session Expired', 'Please re-login to encrypt data.', 'error');
        return;
    }

    const { encrypted, iv } = await encryptData(pass, masterPass);
    
    DB.credentials.add({
        user_id: currentUser.id,
        platform_name: platform,
        username_login: user,
        encrypted_password: encrypted,
        iv: iv,
        category: cat
    });

    showToast('Credential Encrypted & Saved');
    document.getElementById('add-form').reset();
    loadVault();
}

function loadVault() {
    const secrets = DB.credentials.getByUser(currentUser.id);
    const container = document.getElementById('vault-grid');
    container.innerHTML = '';

    secrets.forEach(s => {
        const row = document.createElement('div');
        row.className = "bg-white border border-green-100 p-4 rounded-lg shadow-sm hover:shadow-md transition flex items-center justify-between mb-3";
        
        // Auto Logo Logic
        const logoUrl = getLogo(s.platform_name);
        
        row.innerHTML = `
            <div class="flex items-center gap-4">
                <img src="${logoUrl}" onerror="this.src='https://via.placeholder.com/40?text=${s.platform_name[0]}'" class="w-10 h-10 rounded-full bg-gray-100 object-cover">
                <div>
                    <h4 class="font-bold text-gray-800">${s.platform_name}</h4>
                    <p class="text-xs text-gray-500">${s.username_login}</p>
                    <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">${s.category}</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="viewPassword(${s.id})" class="text-gray-400 hover:text-green-500 transition"><i class="fas fa-eye"></i></button>
                <button onclick="deleteCredential(${s.id})" class="text-gray-400 hover:text-red-500 transition"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(row);
    });
}

// Secure View Flow
async function viewPassword(id) {
    const creds = DB.credentials.getByUser(currentUser.id);
    const target = creds.find(c => c.id === id);

    // Ask for Master Password again (Security feature)
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 class="font-bold mb-2">Verify Identity</h3>
            <p class="text-sm text-gray-500 mb-4">Enter login password to decrypt.</p>
            <input type="password" id="verify-pass" class="w-full border p-2 rounded mb-4" placeholder="Password">
            <div class="flex justify-end gap-2">
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 px-3">Cancel</button>
                <button id="btn-decrypt" class="bg-green-500 text-white px-4 py-2 rounded">View</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('btn-decrypt').onclick = async () => {
        const pass = document.getElementById('verify-pass').value;
        const decrypted = await decryptData(target.encrypted_password, target.iv, pass);
        
        modal.remove();

        if(decrypted) {
            DB.logs.add(currentUser.id, `VIEWED_${target.platform_name.toUpperCase()}`);
            showModal('Decrypted Password', `<div class="bg-gray-100 p-4 rounded text-2xl font-mono text-center select-all">${decrypted}</div><p class="text-xs text-center mt-2">Auto-closing in 10s</p>`, 'success');
        } else {
            showToast('Wrong Password', 'error');
        }
    };
}

function deleteCredential(id) {
    if(confirm('Are you sure? This cannot be undone.')) {
        DB.credentials.delete(id);
        loadVault();
        showToast('Deleted', 'success');
    }
}

function loadLogs() {
    const logs = DB.logs.get(currentUser.id);
    const list = document.getElementById('activity-list');
    list.innerHTML = logs.map(l => `
        <li class="text-xs text-gray-500 border-b border-gray-100 py-2">
            <span class="font-mono text-green-600">[${l.timestamp.split(',')[1].trim()}]</span> ${l.action}
        </li>
    `).join('');
}

function logout() {
    sessionStorage.removeItem('div_master');
    localStorage.removeItem('div_session');
    window.location.href = 'auth.html';
}