# 🛠️ SportNest Server

SportNest Server handles authentication, facility management, booking operations, and secured APIs for the SportNest platform. ⚡

## 🚀 Live API

🔗 https://sport-nest-data-server.vercel.app/

## 🎯 Purpose

The server manages all backend operations including authentication, database management, booking system, and protected routes.

## ✨ Features

- 🔐 JWT Authentication
- 🍪 HTTPOnly Cookie Security
- 🏟️ Facility CRUD Operations
- 📅 Booking Management
- 🔍 Search & Filter API
- 🛡️ Protected Routes
- 🌐 CORS Configuration
- ⚡ MongoDB Database Integration

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT
- Cookie Parser
- CORS
- dotenv

## 📦 NPM Packages

```bash
npm install express mongodb cors dotenv cookie-parser jsonwebtoken
npm install nodemon
```

## ⚙️ Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=your_client_url
```

## ▶️ Run Locally

```bash
npm install
npm run dev
```
