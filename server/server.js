import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import { getOAuthStrategies } from './config/oauth.js';
import { authenticateToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import oauthRoutes from './routes/oauth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Initialize async operations
(async () => {
  // Initialize Passport
  getOAuthStrategies(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  // Initialize database
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/oauth', oauthRoutes);
  app.use('/api/notes', notesRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running' });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📝 Frontend URL: ${process.env.FRONTEND_URL}`);
  });
})();
