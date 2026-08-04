const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    // Dashboard Cards
    const [[books]] = await db.query(
  `SELECT COUNT(*) AS totalBooks
   FROM books
   WHERE user_id = ?`,
  [userId]
);

    const [[members]] = await db.query(
  `SELECT COUNT(*) AS totalMembers
   FROM members
   WHERE user_id = ?`,
  [userId]
);

    const [[issued]] = await db.query(
  `SELECT COUNT(*) AS booksIssued
   FROM loans
   WHERE status = 'active'
     AND user_id = ?`,
  [userId]
);

    const [[overdue]] = await db.query(
  `
  SELECT COUNT(*) AS overdueBooks
  FROM loans
  WHERE status = 'active'
    AND due_date < CURDATE()
    AND user_id = ?
  `,
  [userId]
);

    const [[fines]] = await db.query(
  `
  SELECT IFNULL(SUM(amount), 0) AS unpaidFines
  FROM fines
  WHERE paid = 0
    AND user_id = ?
  `,
  [userId]
);

    // Recent Activity
const [recentActivity] = await db.query(
  `
  SELECT
    b.title AS book_title,
    m.full_name AS member_name,
    l.checked_out_at,
    l.due_date,
    l.status
  FROM loans l
  JOIN books b ON l.book_id = b.id
  JOIN members m ON l.member_id = m.id
  WHERE l.user_id = ?
  ORDER BY l.checked_out_at DESC
  LIMIT 5
  `,
  [userId]
);
    
    res.json({
      success: true,
      data: {
        totalBooks: books.totalBooks,
        totalMembers: members.totalMembers,
        booksIssued: issued.booksIssued,
        overdueBooks: overdue.overdueBooks,
        unpaidFines: fines.unpaidFines,
        recentActivity,
      },
    });
  } catch (error) {

  console.error("========== STATS ERROR ==========");
  console.error(error);

  res.status(500).json({
    success: false,
    error: error.message
  });

}
};