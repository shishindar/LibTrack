const db = require('../config/db');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM books');

    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const [books] = await db.query(
      'SELECT * FROM books WHERE id = ?',
      [id]
    );

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: books[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add new book
exports.createBook = async (req, res) => {
  try {
    const {
  isbn,
  title,
  author_id,
  genre,
  publisher,
  published_year,
  total_copies,
  available_copies,
  cover_url,
  description
} = req.body;

const [result] = await db.query(
  `INSERT INTO books (
    isbn,
    title,
    author_id,
    genre,
    publisher,
    published_year,
    total_copies,
    available_copies,
    cover_url,
    description
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    isbn,
    title,
    author_id || null,
    genre || null,
    publisher || null,
    published_year ? Number(published_year) : null,
    Number(total_copies),
    Number(available_copies),
    cover_url || null,
    description || null
  ]
);

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      bookId: result.insertId
    });

  } catch (error) {
  console.error("========== ADD BOOK ERROR ==========");
  console.error(error);

  res.status(500).json({
    success: false,
    error: error.message,
  });
}
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      isbn,
      title,
      author_id,
      genre,
      publisher,
      published_year,
      total_copies,
      available_copies,
      cover_url,
      description
    } = req.body;

    const [result] = await db.query(
      `UPDATE books
       SET
         isbn = ?,
         title = ?,
         author_id = ?,
         genre = ?,
         publisher = ?,
         published_year = ?,
         total_copies = ?,
         available_copies = ?,
         cover_url = ?,
         description = ?
       WHERE id = ?`,
      [
        isbn,
        title,
        author_id || null,
        genre || null,
        publisher || null,
        published_year ? Number(published_year) : null,
        Number(total_copies),
        Number(available_copies),
        cover_url || null,
        description || null,
        id
]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    res.json({
      success: true,
      message: "Book updated successfully"
    });

  } catch (error) {
    console.error("BOOK UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM books WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};