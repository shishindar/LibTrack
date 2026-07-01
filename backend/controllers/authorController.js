const db = require('../config/db');

// Get all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const [authors] = await db.query(
      'SELECT * FROM authors ORDER BY id DESC'
    );

    res.json({
      success: true,
      count: authors.length,
      data: authors
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get author by ID
exports.getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [authors] = await db.query(
      'SELECT * FROM authors WHERE id = ?',
      [id]
    );

    if (authors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.json({
      success: true,
      data: authors[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create author
exports.createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const [result] = await db.query(
      'INSERT INTO authors (name, bio) VALUES (?, ?)',
      [name, bio]
    );

    res.status(201).json({
      success: true,
      message: 'Author created successfully',
      authorId: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update author
exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;

    const [result] = await db.query(
      'UPDATE authors SET name = ?, bio = ? WHERE id = ?',
      [name, bio, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.json({
      success: true,
      message: 'Author updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete author
exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM authors WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.json({
      success: true,
      message: 'Author deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};