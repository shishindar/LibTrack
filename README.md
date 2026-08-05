# 📚 Library Tracker

A modern full-stack **Library Management System** built using **React.js, Node.js, Express.js, and MySQL**. The application enables librarians to efficiently manage books, members, loans, fines, and user accounts through a secure and intuitive interface.

---

## 🌐 Live Demo

**Frontend:** https://YOUR-VERCEL-URL.vercel.app

**Backend API:** https://libtrack-uguf.onrender.com

---

## 📸 Screenshots

> Add screenshots of the following pages:

- Login Page
- Dashboard
- Books
- Members
- Loans
- Fines
- Settings / Profile

---

## ✨ Features

### 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Refresh Token Authentication
- Password Hashing using bcrypt
- Account Lock after Multiple Failed Login Attempts
- Session Expiration Handling

### 👤 User Profile
- Update Profile Information
- Upload Profile Picture
- Remove Profile Picture
- Change Password

### 📚 Book Management
- Add Books
- Edit Books
- Delete Books
- Upload Book Cover Images
- Search Books
- Pagination

### 👥 Member Management
- Add Members
- Edit Members
- Delete Members
- Search Members
- Pagination

### 🔄 Loan Management
- Issue Books
- Return Books
- Track Due Dates

### 💰 Fine Management
- Automatic Fine Calculation
- Fine Tracking

### 📊 Dashboard
- Total Books
- Total Members
- Active Loans
- Total Fines
- Dashboard Statistics

### 🔒 Security
- Helmet
- Input Sanitization
- Express Rate Limiter
- JWT Authentication
- Password Validation
- Protected Routes

### ☁ Deployment
- Frontend deployed on Vercel
- Backend deployed on Render
- Database hosted on Railway MySQL

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React
- React Hot Toast

## Backend

- Node.js
- Express.js
- MySQL2
- JWT
- bcryptjs
- Multer
- Helmet
- Morgan
- Express Rate Limit

## Database

- MySQL (Railway)

## Deployment

- Vercel
- Render
- Railway

---

# 📂 Project Structure

```
LIB-Tracker
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── uploads
│   └── server.js
│
├── frontend-react
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/LibTrack.git
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend-react

npm install

npm run dev
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=5000

DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 📌 API Endpoints

## Authentication

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/auth/me

## Books

- GET /api/books
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id

## Members

- GET /api/members
- POST /api/members
- PUT /api/members/:id
- DELETE /api/members/:id

## Loans

- GET /api/loans
- POST /api/loans
- PUT /api/loans/:id

## Fines

- GET /api/fines

## Profile

- GET /api/profile
- PUT /api/profile
- PUT /api/profile/password
- PUT /api/profile/photo
- DELETE /api/profile/photo

---

# 🎯 Future Improvements

- Email Verification
- Forgot Password
- Password Reset
- Book Reservation
- Email Notifications
- QR Code Book Issue
- Barcode Scanner
- Reports & Analytics
- Dark Mode
- Mobile Responsive Enhancements

---

# 👨‍💻 Author

**Shishindar A**

GitHub:
https://github.com/shishindar

---

# 📄 License

This project is licensed under the MIT License.
