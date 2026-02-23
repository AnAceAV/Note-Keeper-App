import dotenv from 'dotenv';
import pool from './database.js';
import { generateToken } from '../middleware/auth.js';
import GoogleStrategy from 'passport-google-oauth20';
import GitHubStrategy from 'passport-github2';

dotenv.config();

// Handle OAuth user creation/login
export async function handleOAuthUser(profile, provider) {
  try {
    const email = profile.emails?.[0]?.value;
    const username = profile.username || profile.displayName || email.split('@')[0];

    if (!email) {
      throw new Error('Email not provided by OAuth provider');
    }

    // Check if user exists
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      // Create new user
      const result = await pool.query(
        `INSERT INTO users (email, username, ${provider}_id) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, username`,
        [email, username, profile.id]
      );
      user = result;
    } else {
      // Update existing user with OAuth ID if not already set
      if (!user.rows[0][`${provider}_id`]) {
        await pool.query(
          `UPDATE users SET ${provider}_id = $1 WHERE id = $2`,
          [profile.id, user.rows[0].id]
        );
      }
    }

    const userData = user.rows[0];
    const token = generateToken(userData.id, userData.email);

    return {
      user: userData,
      token,
    };
  } catch (error) {
    console.error('OAuth error:', error);
    throw error;
  }
}

export function getOAuthStrategies(passport) {

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/oauth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const result = await handleOAuthUser(profile, 'google');
          return done(null, result);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/oauth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const result = await handleOAuthUser(profile, 'github');
          return done(null, result);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
