// src/config/db.js

// CONFIGURATION
const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    database: 'devinfovault'
};

/**
 * DATA LAYER
 * In a real app, this uses fetch() to a Node backend.
 * For this Local-First Demo, we abstract LocalStorage as our "Database".
 */

const DB = {
    // User Methods
    users: {
        create: (userObj) => {
            let users = JSON.parse(localStorage.getItem('div_users') || '[]');
            if(users.find(u => u.username === userObj.username)) return { error: 'Username exists' };
            
            userObj.id = Date.now();
            userObj.created_at = new Date().toISOString();
            userObj.settings = { theme: 'light', autoLock: true };
            userObj.bio = "DevInfoVault User";
            
            users.push(userObj);
            localStorage.setItem('div_users', JSON.stringify(users));
            return { success: true, user: userObj };
        },
        find: (username) => {
            let users = JSON.parse(localStorage.getItem('div_users') || '[]');
            return users.find(u => u.username === username || u.email === username);
        },
        update: (id, data) => {
            let users = JSON.parse(localStorage.getItem('div_users') || '[]');
            let index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                users[index] = { ...users[index], ...data };
                localStorage.setItem('div_users', JSON.stringify(users));
                return true;
            }
            return false;
        }
    },
    // Credential Methods
    credentials: {
        add: (credObj) => {
            let creds = JSON.parse(localStorage.getItem('div_creds') || '[]');
            credObj.id = Date.now();
            credObj.created_at = new Date().toISOString();
            creds.push(credObj);
            localStorage.setItem('div_creds', JSON.stringify(creds));
            return credObj;
        },
        getByUser: (userId) => {
            let creds = JSON.parse(localStorage.getItem('div_creds') || '[]');
            return creds.filter(c => c.user_id === userId);
        },
        delete: (id) => {
            let creds = JSON.parse(localStorage.getItem('div_creds') || '[]');
            const newCreds = creds.filter(c => c.id !== id);
            localStorage.setItem('div_creds', JSON.stringify(newCreds));
        }
    },
    // Log Methods
    logs: {
        add: (userId, action) => {
            let logs = JSON.parse(localStorage.getItem('div_logs') || '[]');
            logs.unshift({ userId, action, timestamp: new Date().toLocaleString() }); // Add to top
            localStorage.setItem('div_logs', JSON.stringify(logs.slice(0, 50))); // Keep last 50
        },
        get: (userId) => {
            let logs = JSON.parse(localStorage.getItem('div_logs') || '[]');
            return logs.filter(l => l.userId === userId);
        }
    }
};