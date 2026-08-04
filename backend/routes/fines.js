const express = require("express");
const router = express.Router();

const fineController = require("../controllers/fineController");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, fineController.getFines);

router.put("/pay/:id", requireAuth, fineController.payFine);

module.exports = router;