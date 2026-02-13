// src/core/crypto.js

async function generateKey(password, salt = 'devinfovault_salt') {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode(salt),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(text, password) {
    try {
        const key = await generateKey(password);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const enc = new TextEncoder();
        
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            enc.encode(text)
        );

        // Convert to Hex strings for storage
        const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
        const encryptedHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');

        return { encrypted: encryptedHex, iv: ivHex };
    } catch (e) {
        console.error("Encryption failed", e);
        return null;
    }
}

async function decryptData(encryptedHex, ivHex, password) {
    try {
        const key = await generateKey(password);
        
        // Convert Hex back to buffer
        const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const encrypted = new Uint8Array(encryptedHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encrypted
        );

        const dec = new TextDecoder();
        return dec.decode(decrypted);
    } catch (e) {
        console.error("Decryption failed - Likely wrong password");
        return null;
    }
}