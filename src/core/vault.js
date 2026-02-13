// src/core/vault.js
// Handles secret management

async function addSecret(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const value = document.getElementById('value').value;
    
    const { encryptedValue, iv } = await encryptValue(value, localStorage.getItem('masterKey'));
    
    // Simulate DB insert (use db.js)
    const secret = { id: Date.now(), title, category, encryptedValue, iv };
    // Store in local for demo
    let secrets = JSON.parse(localStorage.getItem('secrets') || '[]');
    secrets.push(secret);
    localStorage.setItem('secrets', JSON.stringify(secrets));
    
    loadSecrets();
}

async function loadSecrets() {
    // Simulate DB fetch
    const secrets = JSON.parse(localStorage.getItem('secrets') || '[]');
    const list = document.getElementById('secretsList');
    list.innerHTML = '';
    
    for (const secret of secrets) {
        const decrypted = await decryptValue(secret.encryptedValue, localStorage.getItem('masterKey'), secret.iv);
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-lg shadow';
        card.innerHTML = `
            <h3 class="font-bold">${secret.title}</h3>
            <p>Category: ${secret.category}</p>
            <p>Value: ${decrypted}</p>
            <button onclick="deleteSecret(${secret.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        `;
        list.appendChild(card);
    }
}

function deleteSecret(id) {
    let secrets = JSON.parse(localStorage.getItem('secrets') || '[]');
    secrets = secrets.filter(s => s.id !== id);
    localStorage.setItem('secrets', JSON.stringify(secrets));
    loadSecrets();
}