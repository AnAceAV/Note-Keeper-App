# Keeper App - Full Stack Notes Application

A full-featured notes application with user authentication, OAuth support, and persistent storage using PostgreSQL.

## Output Screenshot

![App Output](public\assets\output.png)

## Features

✅ **User Authentication**
- Manual registration and login
- Email & password validation
- JWT token-based sessions

✅ **OAuth Integration**
- Google OAuth 2.0
- GitHub OAuth

✅ **Notes Management**
- Create, read, update, delete notes
- User-specific note storage
- Persistent database storage

✅ **Security**
- Password hashing with bcryptjs
- JWT authentication
- Protected routes
- User-specific data isolation

## Tech Stack

### Frontend
- React 17
- Vite
- React Router v6
- Material-UI (MUI)
- Axios

### Backend
- Node.js with Express.js
- PostgreSQL
- JWT Authentication
- Passport.js for OAuth
- bcryptjs for password hashing

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)
- **Git** (optional)

For OAuth to work, you'll also need:
- Google Developer Account (for Google OAuth)
- GitHub Developer Account (for GitHub OAuth)

## Setup Instructions

### 1. PostgreSQL Database Setup

#### On Windows (if you have PostgreSQL installed):

1. Open **pgAdmin** or **PostgreSQL Command Line**
2. Create a new database:
   ```sql
   CREATE DATABASE keeper_db;
   ```
3. Note your PostgreSQL credentials (default username is usually `postgres`)

#### Alternative: Using Docker

If you prefer Docker:
```bash
docker run --name postgres-keeper -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=keeper_db -p 5432:5432 -d postgres
```

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `server/.env` with your database credentials:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=keeper_db
   JWT_SECRET=your_secret_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. (Optional) Configure OAuth:

   **For Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Add `http://localhost:5000/api/oauth/google/callback` to authorized redirect URIs
   - Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`

   **For GitHub OAuth:**
   - Go to [GitHub Settings > Developer applications](https://github.com/settings/developers)
   - Create a new OAuth App
   - Set Authorization callback URL to `http://localhost:5000/api/oauth/github/callback`
   - Copy `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env`

5. Start the backend server:
   ```bash
   npm run dev
   ```
   
   You should see: ✅ Server running on http://localhost:5000

### 3. Frontend Setup

1. In a new terminal, navigate to the root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the `.env` file (if needed):
   ```bash
   cp .env.example .env
   ```
   
   The default `VITE_API_URL=http://localhost:5000/api` should work for development.

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Register a New Account

1. Click "Register here" on the login page
2. Enter your email, username, and password
3. Click "Register"
4. You'll be logged in automatically and redirected to the notes page

### Login

1. Enter your email and password
2. Click "Login"
3. Or use OAuth buttons to sign in with Google or GitHub

### Create Notes

1. Type in the input field at the top
2. Click the checkmark to add
3. Notes are automatically saved to the database

### Delete Notes

1. Click the trash icon on any note
2. Note is immediately removed

### Logout

1. Click the "Logout" button in the header

## File Structure

```
keepr/
├── src/                          # Frontend source
│   ├── components/              # React components
│   │   ├── App.jsx             # Updated notes app
│   │   ├── Header.jsx          # Updated with logout
│   │   ├── Note.jsx
│   │   ├── CreateArea.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── AuthSuccess.jsx     # OAuth callback handler
│   │   └── ProtectedRoute.jsx  # Route protection component
│   ├── services/
│   │   └── api.js              # API service with axios
│   ├── index.jsx               # Updated with routing
│   └── ...
├── server/                      # Backend source
│   ├── config/
│   │   ├── database.js         # PostgreSQL setup
│   │   └── oauth.js            # OAuth configuration
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   ├── routes/
│   │   ├── auth.js             # Auth endpoints
│   │   ├── notes.js            # Notes CRUD endpoints
│   │   └── oauth.js            # OAuth endpoints
│   ├── server.js               # Express server
│   ├── package.json
│   └── .env                    # Environment variables
├── package.json
├── vite.config.js
├── .env                        # Frontend env variables
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### OAuth
- `GET /api/oauth/google` - Google login
- `GET /api/oauth/google/callback` - Google callback
- `GET /api/oauth/github` - GitHub login
- `GET /api/oauth/github/callback` - GitHub callback

### Notes (all require authorization header)
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `server/.env`
- Ensure database exists: `keeper_db`

### Port Already in Use
- Backend uses port 5000: `lsof -ti:5000` (macOS/Linux)
- Frontend uses port 5173

### OAuth Not Working
- Verify OAuth credentials are correct in `.env`
- Ensure callback URLs match in OAuth provider settings
- Check browser console for specific errors

### Notes Not Saving
- Check network tab in browser DevTools
- Verify token is being sent with requests
- Check server logs for errors

### CORS Errors
- Verify `FRONTEND_URL` is correct in `server/.env`
- Ensure frontend is running on the correct port

## Security Notes

⚠️ **Production Deployment:**
- Change `JWT_SECRET` to a strong, random value
- Set `NODE_ENV=production`
- Use HTTPS for all connections
- Store secrets in environment variables (never commit `.env`)
- Use secure database passwords
- Enable HTTPS-only cookies for production

## Development

### Running Both Services

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend - in a new terminal):**
```bash
npm run dev
```

### Building for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
npm start
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "ECONNREFUSED" | Make sure backend server is running on port 5000 |
| "TABLE does not exist" | Backend automatically creates tables on first run |
| Login fails with correct credentials | Check browser console for error messages |
| OAuth redirect fails | Verify callback URLs in OAuth provider settings |
| CORS error in browser | Check FRONTEND_URL in server/.env |

## Next Steps

- Add note categories/tags
- Implement note search
- Add edit functionality
- Implement note sharing
- Add dark mode
- Mobile app version

## Contributing

Feel free to fork and submit pull requests!

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in browser console and server logs
3. Verify all environment variables are set correctly

---

**Happy note-taking!** 📝
