const db = require("../config/db");

// Get all fines
exports.getFines = async (req, res) => {
  try {
    const userId = req.user.id;
    const [fines] = await db.query(
  `
  SELECT
    f.*,
    b.title AS book_title,
    m.full_name AS member_name
  FROM fines f
  JOIN loans l ON f.loan_id = l.id
  JOIN books b ON l.book_id = b.id
  JOIN members m ON l.member_id = m.id
  WHERE f.user_id = ?
  ORDER BY f.created_at DESC
  `,
  [userId]
);

    res.json({
      success: true,
      count: fines.length,
      data: fines,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Pay Fine
exports.payFine = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await db.query(
      `
      UPDATE fines
SET
  paid = 1,
  paid_at = NOW()
WHERE id = ?
AND user_id = ?
      `,
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Fine not found",
      });
    }

    res.json({
      success: true,
      message: "Fine paid successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}; 