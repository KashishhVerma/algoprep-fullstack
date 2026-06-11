# AlgoPrep — MERN Stack Interview Preparation Platform

AlgoPrep is a full-stack MERN web application designed to help students prepare for coding interviews by tracking DSA progress, saving notes, bookmarking problems, and maintaining daily streaks.

## Features

* 🔐 JWT Authentication (Login/Register)
* 📈 DSA Progress Tracking
* ✅ Mark Problems as Solved
* 🔖 Bookmark Questions
* 📝 Personal Notes System
* 🔥 Daily Streak Tracker
* 👤 User-specific Data Isolation
* 💾 Persistent Storage with MongoDB

## Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* bcrypt.js

## Project Structure

```bash
interview-prep/
│── backend/
│── src/
│── public/
│── package.json
```

## Installation

### Clone repository

```bash
git clone YOUR_GITHUB_LINK
cd interview-prep
```

### Frontend setup

```bash
npm install
npm run dev
```

### Backend setup

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

Create `.env` inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRE=7d
```

