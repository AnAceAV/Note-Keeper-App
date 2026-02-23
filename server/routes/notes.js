import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all notes for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, content FROM notes WHERE user_id = $1 ORDER BY id DESC',
      [req.user.userId]
    );

    res.json({ notes: result.rows });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new note
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Verify the JWT user exists in the users table
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [req.user.userId]);
    if (userCheck.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid user. Please login again.' });
    }

    const result = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, title, content',
      [req.user.userId, title, content]
    );

    res.status(201).json({
      message: 'Note created successfully',
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a note
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Verify note belongs to user
    const noteCheck = await pool.query(
      'SELECT user_id FROM notes WHERE id = $1',
      [id]
    );

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (noteCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await pool.query(
      'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING id, title, content',
      [title, content, id]
    );

    res.json({
      message: 'Note updated successfully',
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a note
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify note belongs to user
    const noteCheck = await pool.query(
      'SELECT user_id FROM notes WHERE id = $1',
      [id]
    );

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (noteCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await pool.query('DELETE FROM notes WHERE id = $1', [id]);

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
