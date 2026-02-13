## **DevInfoVault**

### 🔐 Core Identity

DevInfoVault is a private local vault system that allows developers to securely store, manage, and control access to sensitive development information such as API keys, database credentials, SSH configs, tokens, and environment secrets.

It runs inside a controlled local server environment and connects securely to a local database.

---

# 🎯 Main Purpose

To give developers:

* A structured place for storing secrets
* Encrypted storage before database insertion
* User-based access control
* Clean separation between UI, logic, and configuration
* Full local ownership of sensitive data

No cloud dependency.
No third-party storage.
Fully controlled environment.

---

# 🔥 Core Features

## 1️⃣ Landing Page (index.html)

Purpose:

* Introduce DevInfoVault
* Explain security model
* Show feature overview
* Redirect to authentication page

Includes:

* Product description
* Security highlights
* “Access Vault” button → routes to auth.html

---

## 2️⃣ Authentication System (auth.html + auth.js)

Features:

* User registration
* User login
* Password hashing before database storage
* Session-based access restriction
* Logout functionality

Security:

* Password never stored in plain text
* Database stores only hashed password
* Session stored securely
* Only authenticated users can access dashboard

Flow:

1. User registers → password hashed → saved in database
2. User logs in → password verified → session created
3. User redirected to dashboard

---

## 3️⃣ Secure Vault System (dashboard.html + vault.js)

Users can:

* Add new secret
* Edit existing secret
* Delete secret
* View decrypted secret (after authentication)
* Categorize secrets:

  * API Keys
  * Database Credentials
  * SSH Keys
  * Tokens
  * Custom

Each secret stores:

* Title
* Category
* Encrypted value
* Initialization vector (IV)
* Owner (user_id)
* Created/updated timestamps

Important:
The database never stores the raw secret.

---

## 4️⃣ Encryption Layer (crypto.js)

Handles:

* AES encryption of secret values
* IV generation
* Key derivation
* Decryption on demand

Process:

1. User logs in
2. Master key derived from password
3. When adding secret:

   * Secret encrypted
   * Encrypted data + IV stored in database
4. When viewing:

   * Data decrypted temporarily
   * Not permanently stored in memory

This ensures database exposure does not leak secrets.

---

## 5️⃣ Database Connection (db.js)

Purpose:

* Read environment variables
* Connect to MySQL
* Provide reusable connection function

Reads from:
.env file

Never hardcodes credentials.

---

# 🧠 How Everything Connects

Here’s the full internal flow.

---

## 🔁 System Flow

### Step 1: User Opens Landing Page

public/index.html
→ Click “Access Vault”
→ Redirect to pages/auth.html

---

### Step 2: Authentication

auth.html form
→ Sends data to auth.js
→ auth.js calls db.js
→ If success:

* Session created
* Redirect to dashboard.html

---

### Step 3: Dashboard Access

dashboard.html loads
→ app.js checks session
→ If no session → redirect to auth

---

### Step 4: Adding a Secret

User submits secret form
→ vault.js receives data
→ crypto.js encrypts secret
→ vault.js sends encrypted data to database
→ db.js inserts into secrets table

---

### Step 5: Viewing a Secret

User clicks “View”
→ vault.js fetches encrypted value
→ crypto.js decrypts using session-derived key
→ Secret displayed temporarily

---

# 🗂 Final Folder Structure (Cleaned & Structured)

```
DevInfoVault/
│
├── public/
│   ├── index.html
├── pages/
│   ├── auth.html
│   └── dashboard.html
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── core/
│   │   ├── crypto.js
│   │   ├── auth.js
│   │   └── vault.js
│   │
│   └── app.js
│
├── database/
│   └── schema.sql
│
├── .env
├── .gitignore
└── Core_Features.md

```

Clear separation:

* public → marketing + styles
* pages → protected user pages
* src → business logic
* database → SQL schema
* root → environment & documentation

---

# 🗄 Database Schema Overview

Two main tables:

## users

* id
* username
* email
* password_hash
* created_at

## secrets

* id
* user_id (foreign key)
* title
* category
* encrypted_value
* iv
* timestamps

Relationship:
One user → Many secrets

---

# 🧩 How To Use DevInfoVault

1. Install local server (e.g., XAMPP or similar)
2. Import database/schema.sql into MySQL
3. Configure .env file
4. Start local server
5. Open browser → [http://localhost/DevInfoVault/public](http://localhost/DevInfoVault/public)

---

# 🛡 Security Model Summary

* Password hashing before DB storage
* AES encryption before secret storage
* Session validation for access control
* Encrypted secrets in database
* No plain sensitive data stored
* Environment-based DB configuration

Even if:

* Database is dumped → secrets are encrypted
* Someone reads source code → DB credentials in .env
* Someone tries dashboard without login → access denied

---

# 💎 Why DevInfoVault Is Strong

This project demonstrates:

* Secure system design
* Database modeling
* Encryption workflow
* Authentication flow
* Modular architecture
* Separation of concerns
* Infrastructure awareness

It looks like something an internal engineering team would use for managing sensitive configuration locally.
