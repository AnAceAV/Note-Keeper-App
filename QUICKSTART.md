# Quick Start Guide

## One-Time Setup (5-10 minutes)

### Step 1: PostgreSQL Database Setup
1. Install [PostgreSQL](https://www.postgresql.org/download/)
2. During installation, remember your password
3. Open PostgreSQL command line or pgAdmin
4. Create the database:
   ```sql
   CREATE DATABASE keeper_db;
   ```

### Step 2: Configure Backend
1. Open `server/.env` and update:
   ```
   DB_PASSWORD=your_postgres_password
   ```

### Step 3: Install Dependencies
```bash
# Terminal 1 - Backend
cd server
npm install

# Terminal 2 - Frontend (from root directory)
npm install
```

### Step 4: Start the App
```bash
# Terminal 1 - Backend (from server directory)
npm run dev

# Terminal 2 - Frontend (from root directory)  
npm run dev
```

✅ Open http://localhost:5173 in your browser!

## Optional: OAuth Setup

### Google OAuth
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials:
   - Type: Web application
   - JS origins: `http://localhost:5000`
   - Redirect URI: `http://localhost:5000/api/oauth/google/callback`
5. Copy credentials to `server/.env`:
   ```
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   ```

### GitHub OAuth
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set Authorization callback URL to: `http://localhost:5000/api/oauth/github/callback`
4. Copy credentials to `server/.env`:
   ```
   GITHUB_CLIENT_ID=your_id
   GITHUB_CLIENT_SECRET=your_secret
   ```

## Features Overview

### Manual Login/Register
- Email + password authentication
- Password hashing with bcryptjs
- JWT tokens for session management

### OAuth Options
- Login with Google
- Login with GitHub
- Passwords optional for OAuth users

### Notes Storage
- All notes saved to PostgreSQL
- Each user sees only their own notes
- Real-time CRUD operations

## Database Schema

### Users Table
```sql
id (PK), email (UNIQUE), username (UNIQUE), password_hash, 
google_id (UNIQUE), github_id (UNIQUE), created_at, updated_at
```

### Notes Table
```sql
id (PK), user_id (FK), title, content, created_at, updated_at
```

## Troubleshooting

**Backend won't start:**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Check port 5000 is available

**Login fails:**
- Verify database exists
- Check backend server is running
- Clear browser cache/cookies

**OAuth buttons don't work:**
- Missing credentials in `.env`
- Verify callback URLs in OAuth provider
- Backend not running

**Notes not showing:**
- Make sure you're logged in
- Check network tab in DevTools
- Verify token in localStorage

---

**Happy coding!** 🚀
