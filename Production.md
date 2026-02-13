## 🎯 Core Identity

DevInfoVault is a local-first encrypted developer credential management system with authentication, 2-step verification simulation, activity monitoring, full CRUD vault management, and modern UI control settings.

Color Theme:

* Primary: White
* Accent: Light Green

---

# ✅ Short System Features

## 🔐 Authentication Module

* Register
* Login
* Forgot password
* Help section
* Left/right sliding layout UI
* Password must be entered as password type (never text)
* Popup-based error validation
* Temporary second verification popup (simulated 2FA)

---

## 👤 User Profile Module

* Full name
* Username
* Email
* Bio
* Account creation date
* Account activity monitor
* Settings control panel

---

## 🔑 Vault Module (Full CRUD)

* Add credential
* Edit credential
* Delete credential
* View credential (requires password confirmation popup)
* Category selection
* Logo auto-display for major platforms (GitHub, Google, etc.)
* Encrypted storage in DB
* Row-style display like password managers

---

## 🛡 Security Enhancements

* Password hashing
* AES encryption for vault data
* Pop-up modal (centered overlay) blocking screen
* Session validation
* Login attempt logging
* Auto-remove popup after few seconds
* Form validation (high-level)

---

## ⚙ Settings Module

* Dark/Light toggle (still green/white based)
* Enable/Disable popup auto close
* Enable simulated second auth
* Session timeout configuration

---

# 🔄 Full Workflow

## Step 1 – Landing Page (index.html)

User sees:

* High information display
* Animated hero section (AOS)
* Subtle 3D background (Three.js particles)
* Security highlight
* CTA button → “Access Vault”

User clicks → Redirect to auth.html

---

## Step 2 – Authentication Page (auth.html)

Layout:

* Left: Informational content
* Right: Form panel
* Toggle between:

  * Login
  * Register
  * Forgot
  * Need Help

Validation:

* Password required
* Strong password enforcement
* Pop-up error modal (centered, blocking)
* Second auth popup (code simulation)

On success:
→ Redirect to dashboard.html

---

## Step 3 – Dashboard

User sees:

### Top Section:

* Welcome message
* User full name
* Account creation date
* Bio
* Security status

---

### Main Section:

Credential Table (like password manager):

| Logo | Platform | Username | Encrypted Password | Edit | Delete |

If platform = GitHub → fetch GitHub logo online
If Google → fetch Google logo
Else default icon

---

### Add Credential:

* Platform name
* Username/email
* Password
* Category
* Notes

Encrypted before saving.

---

### View Credential:

Click “View”
→ Popup asks: Enter login password again
→ If correct:

* Decrypt password
* Show temporarily
* Auto-hide after few seconds

---

### Settings Panel:

* Toggle second authentication
* Session auto-logout
* Activity logs viewer
* Account edit

---

### Logout:

Destroys session
Redirect to auth page

---

# 🔗 File Linking Architecture

### public/index.html

* Links Tailwind CDN
* Links AOS CDN
* Links Three.js CDN
* Redirect button → pages/auth.html

---

### pages/auth.html

* Links:

  * ../src/app.js
  * ../src/core/auth.js
  * ../src/config/db.js
* Handles form UI
* Calls auth functions

---

### pages/dashboard.html

* Links:

  * ../src/app.js
  * ../src/core/vault.js
  * ../src/core/crypto.js
  * ../src/config/db.js
* Loads user data
* Validates session

---

### src/app.js

* Session check
* Routing control
* Popup control system
* Security modal management

---

### src/core/auth.js

* Register logic
* Login verification
* Password hashing
* Login log recording

---

### src/core/vault.js

* Create credential
* Read credentials
* Update credential
* Delete credential
* Decrypt on demand

---

### src/core/crypto.js

* AES encryption
* AES decryption
* IV generation

---

### src/config/db.js

* Reads .env
* Establishes MySQL connection
* Exports connection

---

# 🧩 Modules Used

* Web Crypto API (Encryption)
* MySQL
* Tailwind CDN
* AOS Animation
* Three.js background animation
* Session storage
* Modal security overlay logic

# ⚙ Database Credential Config (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=devinfovault
SESSION_SECRET=devinfo_super_secret_key
```

---

# 🛡 Database Schema (Enhanced)

Tables:

### users

* id
* full_name
* username
* email
* password_hash
* bio
* created_at

---

### credentials

* id
* user_id
* platform
* username
* encrypted_password
* iv
* category
* notes
* created_at
* updated_at

---

### login_logs

* id
* user_id
* attempt_time
* success_status
* ip_address

---

# 🎨 UI Design Style

* Background: White
* Accent buttons: Light green
* Cards: Soft green border
* Hover effect: subtle glow
* Modal: center-screen overlay
* Smooth animations (AOS)
* 3D background hero (Three.js)

---

# 🛡 Security UX

Popup Modal:

* Blocks screen
* Green border
* Centered
* User must close
* Auto-removes after timer (optional)

Password visibility:

* Always type="password"
* Toggle icon available
* View only after confirmation

---

# 🔥 Why This System Is “More Than Expected”

Because it includes:

* Authentication
* Encryption
* Full CRUD
* Activity logs
* 2-step simulation
* Popup validation system
* Modern settings panel
* User identity section
* Credential logo fetching
* Session management
* Secure DB config
* Animated UI
* Clean architecture

This is not a school project anymore.
This is a **mini local secure infrastructure suite.**
