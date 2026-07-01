const db = require('../config/db');

// Get all loans
exports.getAllLoans = async (req, res) => {
  try {
    const [loans] = await db.query(`
      SELECT
        l.*,
        b.title AS book_title,
        m.full_name AS member_name
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
      ORDER BY l.id DESC
    `);

    res.json({
      success: true,
      count: loans.length,
      data: loans
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Issue Book
exports.issueBook = async (req, res) => {
  try {
    const { book_id, member_id, due_date, notes } = req.body;

    const [books] = await db.query(
      'SELECT * FROM books WHERE id = ?',
      [book_id]
    );

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const book = books[0];

    if (book.available_copies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No copies available'
      });
    }

    await db.query(
      `INSERT INTO loans
      (book_id, member_id, due_date, notes)
      VALUES (?, ?, ?, ?)`,
      [book_id, member_id, due_date, notes]
    );

    await db.query(
      `UPDATE books
       SET available_copies = available_copies - 1
       WHERE id = ?`,
      [book_id]
    );

    res.status(201).json({
      success: true,
      message: 'Book issued successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Return Book
exports.returnBook = async (req, res) => {
  try {
    const { loan_id } = req.body;

    const [loans] = await db.query(
      'SELECT * FROM loans WHERE id = ?',
      [loan_id]
    );

    if (loans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    const loan = loans[0];
    
    // Prevent returning the same book twice
    if (loan.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Book has already been returned."
      });
}

// Calculate overdue days
const today = new Date();
const dueDate = new Date(loan.due_date);

const diffTime = today - dueDate;
const overdueDays = Math.max(
  0,
  Math.ceil(diffTime / (1000 * 60 * 60 * 24))
);

// Update loan
await db.query(
  `
  UPDATE loans
  SET
    returned_at = NOW(),
    status = 'returned'
  WHERE id = ?
  `,
  [loan_id]
);

// Increase available copies
await db.query(
  `
  UPDATE books
  SET available_copies = available_copies + 1
  WHERE id = ?
  `,
  [loan.book_id]
);

// Create fine only if overdue and no fine exists
if (overdueDays > 0) {

  const [[existingFine]] = await db.query(
    "SELECT id FROM fines WHERE loan_id = ?",
    [loan_id]
  );

  if (!existingFine) {

    const fineAmount = overdueDays * 10;

    await db.query(
      `
      INSERT INTO fines
      (
        loan_id,
        amount,
        reason
      )
      VALUES (?, ?, ?)
      `,
      [
        loan_id,
        fineAmount,
        `${overdueDays} day(s) overdue`
      ]
    );

  }

}

res.json({
  success: true,
  message: "Book returned successfully"
});

} catch (error) {

  console.error("========== RETURN BOOK ERROR ==========");
  console.error(error);

  res.status(500).json({
    success: false,
    error: error.message
  });

}
};

// Overdue Loans
exports.getOverdueLoans = async (req, res) => {
  try {
    const [loans] = await db.query(`
      SELECT *
      FROM loans
      WHERE due_date < CURDATE()
      AND status = 'active'
    `);

    res.json({
      success: true,
      count: loans.length,
      data: loans
    });

  } catch (error) {
  console.error("========== OVERDUE LOANS ERROR ==========");
  console.error(error);

  res.status(500).json({
    success: false,
    error: error.message
  });
}
};