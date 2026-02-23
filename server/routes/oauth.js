import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback', passport.authenticate('google', { session: false }),
  (req, res) => {
    const { user, token } = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}&userId=${user.id}&username=${user.username}`);
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', {
  scope: ['user:email'],
}));

router.get('/github/callback', passport.authenticate('github', { session: false }),
  (req, res) => {
    const { user, token } = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}&userId=${user.id}&username=${user.username}`);
  }
);

export default router;
