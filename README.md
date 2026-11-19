# Library Tracker Management System

A web-based Library Tracker Management System designed to simplify library operations, manage books and members, track book loans, and monitor overdue fines.

## 🌐 Live Demo

- **Frontend:** https://lib-track-chi.vercel.app/
- **Backend API:** https://libtrack-uguf.onrender.com
- **Database:** TiDB Cloud Starter

## 🚀 Features

- User authentication and authorization using JWT.
- Admin and Librarian roles.
- Book management (Add, View, Update, Delete).
- Member management.
- Author management.
- Book issue and return management.
- Automatic overdue fine calculation.
- Dashboard with library statistics.
- Search and pagination.
- Book cover image uploads.
- User-specific data management.

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MySQL2
- JSON Web Tokens (JWT)
- bcryptjs
- Multer

### Database
- TiDB Cloud Starter
- MySQL-compatible database

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: TiDB Cloud Starter

## 🏗️ System Architecture

```text
          User
           |
           v
    React.js Frontend
        (Vercel)
           |
           | REST API
           v
    Node.js + Express
         (Render)
           |
           | MySQL Protocol
           | TLS Connection
           v
      TiDB Cloud
       (Database)
```

## 🗄️ Database Structure

The system contains six main database tables:

| Table | Description |
|---|---|
| users | Stores user login and role information |
| books | Stores book details |
| members | Stores library member information |
| authors | Stores author information |
| loans | Tracks book issue and return records |
| fines | Stores overdue fine information |

### Database Views

- `v_active_loans` – Displays books that have not been returned.
- `v_overdue_loans` – Displays active loans with overdue days greater than zero.

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd library-tracker
```

### 2. Install Dependencies

For the backend:

```bash
cd backend
npm install
```

For the frontend:

```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_tracker

JWT_SECRET=your_secret_key
```

For production, configure the TiDB Cloud connection details through Render Environment Variables.

**Never commit actual passwords, JWT secrets, or `.env` files to GitHub.**

### 4. Run the Application

Start the backend:

```bash
npm run dev
```

Start the frontend:

```bash
npm
