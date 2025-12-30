# Quick Setup Guide - Pure Node.js with XAMPP MySQL

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Setup XAMPP Database

1. Start XAMPP → Start MySQL
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Create database: `ecommerce_db`
4. Import: `database/schema.sql`

## Step 3: Create .env File

Create `backend/.env` file:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_db
JWT_SECRET=your-secret-key-here
```

## Step 4: Seed Database (Optional)

```bash
npm run seed
```

Creates admin user:
- Username: `admin`
- Password: `admin123`

## Step 5: Start Server

```bash
npm start
```

Server runs on: http://localhost:5000

## Dependencies (Only 6 packages!)

- express - Web framework
- mysql2 - MySQL driver
- bcryptjs - Password hashing
- jsonwebtoken - JWT auth
- dotenv - Environment variables
- cors - CORS support

No email/SMS services - pure Node.js with MySQL!

