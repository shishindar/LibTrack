const db = require('../config/db');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const userId = req.user.id;

const [books] = await db.query(`
SELECT
    b.id,
    b.isbn,
    b.title,
    a.name AS author,
    b.genre,
    b.publisher,
    b.published_year,
    b.total_copies,
    b.available_copies,
    b.cover_url,
    b.description,
    b.created_at,
    b.updated_at
FROM books b
JOIN authors a
ON b.author_id = a.id
WHERE b.user_id = ?
ORDER BY b.title
`, [userId]);

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
  `
  SELECT
    b.id,
    b.isbn,
    b.title,
    a.name AS author,
    b.genre,
    b.publisher,
    b.published_year,
    b.total_copies,
    b.available_copies,
    b.cover_url,
    b.description,
    b.created_at,
    b.updated_at
  FROM books b
  JOIN authors a
    ON b.author_id = a.id
  WHERE b.id = ?
    AND b.user_id = ?
  `,
  [id, req.user.id]
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
    const userId = req.user.id;

    const {
      isbn,
      title,
      author,
      genre,
      publisher,
      published_year,
      total_copies,
      available_copies,
      description,
    } = req.body;

    const cover_url = req.file
      ? `/uploads/covers/${req.file.filename}`
      : null;


    // Find existing author or create a new one
    let authorId = null;

    if (author && author.trim() !== "") {
      const [existingAuthor] = await db.query(
  `SELECT id
   FROM authors
   WHERE LOWER(name) = LOWER(?)
     AND user_id = ?`,
  [author.trim(), userId]
);

      if (existingAuthor.length > 0) {
        authorId = existingAuthor[0].id;
      } else {
        const [newAuthor] = await db.query(
  `INSERT INTO authors (user_id, name)
   VALUES (?, ?)`,
  [userId, author.trim()]
);

        authorId = newAuthor.insertId;
      }
    }

    const [result] = await db.query(
      `INSERT INTO books (
        user_id,
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        isbn,
        title,
        authorId,
        genre || null,
        publisher || null,
        published_year ? Number(published_year) : null,
        Number(total_copies),
        Number(available_copies),
        cover_url,
        description || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      bookId: result.insertId,
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
    const userId = req.user.id;

   const {
  isbn,
  title,
  author,
  genre,
  publisher,
  published_year,
  total_copies,
  available_copies,
  description
} = req.body;

let cover_url = req.body.cover_url;

if (req.file) {
  cover_url = `/uploads/covers/${req.file.filename}`;
}
let authorId = null;

if (author && author.trim() !== "") {

  const [existingAuthor] = await db.query(
  `SELECT id
   FROM authors
   WHERE LOWER(name) = LOWER(?)
   AND user_id = ?`,
  [author.trim(), userId]
);

  if (existingAuthor.length > 0) {
    authorId = existingAuthor[0].id;
  } else {
    const [newAuthor] = await db.query(
      "INSERT INTO authors (user_id, name) VALUES (?, ?)",
      [userId, author.trim()]
    );

    authorId = newAuthor.insertId;
  }
}

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
   WHERE id = ? 
   AND user_id = ?`,
  [
  isbn,
  title,
  authorId,
  genre || null,
  publisher || null,
  published_year ? Number(published_year) : null,
  Number(total_copies),
  Number(available_copies),
  cover_url || null,
  description || null,
  id,
  userId
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
  `DELETE FROM books
   WHERE id = ?
   AND user_id = ?`,
  [id, req.user.id]
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