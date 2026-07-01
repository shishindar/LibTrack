const db = require('../config/db');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const [members] = await db.query('SELECT * FROM members');

    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get member by ID
exports.getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const [members] = await db.query(
      'SELECT * FROM members WHERE id = ?',
      [id]
    );

    if (members.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      data: members[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create member
exports.createMember = async (req, res) => {
  try {
    console.log(req.body);
    
    const {
      full_name,
      email,
      phone,
      address,
      membership_no
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO members
      (
        full_name,
        email,
        phone,
        address,
        membership_no
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        phone,
        address,
        membership_no
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      memberId: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      full_name,
      email,
      phone,
      address,
      membership_no,
      is_active
    } = req.body;

    const [result] = await db.query(
      `UPDATE members
       SET full_name = ?,
           email = ?,
           phone = ?,
           address = ?,
           membership_no = ?,
           is_active = ?
       WHERE id = ?`,
      [
        full_name,
        email,
        phone,
        address,
        membership_no,
        is_active,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM members WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });

  } catch (error) {

  console.error("========== DELETE MEMBER ERROR ==========");
  console.error(error);

  if (error.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(400).json({
      success: false,
      message: "Cannot delete this member because they have loan history."
    });
  }

  res.status(500).json({
    success: false,
    error: error.message
  });
}
};
