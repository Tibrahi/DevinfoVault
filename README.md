# DevInfoVault

**DevInfoVault** is a private, local-first vault system designed for developers who need a secure and structured way to manage sensitive development information.

It provides encrypted storage, controlled access, and user-based isolation for credentials such as API keys, database passwords, SSH configurations, tokens, and environment secrets — all within a locally controlled infrastructure.

DevInfoVault is built for security-conscious developers who prefer full ownership of their data without relying on external services.

---

## 🚀 Purpose

Modern development workflows require handling numerous sensitive credentials. Storing them in plain files, scattered notes, or unsecured local storage introduces risk.

DevInfoVault solves this by offering:

* Structured secret management
* Encryption before database storage
* User-based access control
* Local environment isolation
* Minimal and controlled attack surface

It is intended for standalone use in a secure local environment.

---

## 🔐 Key Features

### Secure Authentication

* User registration and login
* Password hashing before storage
* Session-based access control
* Protected dashboard access

### Encrypted Secret Storage

* AES-based encryption of secret values
* Unique initialization vector per secret
* No plaintext secrets stored in database
* Secure decryption only during active session

### Organized Secret Management

* Categorized secret storage
* Create, edit, and delete secrets
* Timestamp tracking
* User ownership isolation

### Environment-Based Configuration

* Database credentials stored in environment file
* No hardcoded configuration values
* Clear separation of configuration and logic

---

## 🛡 Security Model

DevInfoVault is designed around the principle that sensitive data should never be stored in plaintext.

* User passwords are hashed before being stored.
* Secret values are encrypted prior to database insertion.
* The database contains only encrypted payloads.
* Decryption occurs only during an authenticated session.
* Environment configuration is separated from application logic.

If the database is accessed without authorization, stored secrets remain encrypted and unreadable.

---

## ⚙️ Installation & Setup

### 1. Prepare Local Environment

Ensure you have a local server environment and a running MySQL instance.

### 2. Configure Environment Variables

Create or update the `.env` file with your database credentials.

Example:

```
DB_HOST=localhost
DB_USER=your_user
DB_PASS=your_password
DB_NAME=devinfovault
SESSION_SECRET=your_session_secret
```

### 3. Initialize Database

Import the provided SQL schema into your MySQL server to create required tables.

### 4. Start Local Server

Serve the project using your local server environment.

### 5. Access Application

Open your browser and navigate to:

```
http://localhost/DevInfoVault/public
```

---

## 🔄 Usage Flow

1. Open the landing page.
2. Register a new account or log in.
3. Access the secure dashboard.
4. Add encrypted secrets.
5. Manage or retrieve them during your session.
6. Log out to terminate access.

All secret values remain encrypted at rest.

---

## 🎯 Intended Use Cases

* Managing development API keys
* Storing database credentials
* Keeping SSH configurations secure
* Isolating environment secrets
* Personal infrastructure management
* Local development security practice

---

## 📈 Future Enhancements

Potential future improvements may include:

* Secret search and filtering
* Automatic session expiration
* Multi-user role permissions
* Encrypted export/import functionality
* Audit logging
* Advanced key derivation controls

---

## 🤝 Contributing

Contributions are welcome.
Please open an issue to discuss proposed changes before submitting pull requests.

---

## 📄 License

This project is provided for educational and private infrastructure use.
Review and customize the license according to your intended distribution model.

---

## 🔐 Philosophy

Security is not about complexity — it is about controlled design.

DevInfoVault exists to demonstrate that even a locally deployed system can implement:

* Proper authentication
* Encrypted storage
* Configuration isolation
* Clear architectural boundaries

Your secrets.
Your environment.
Your control.

