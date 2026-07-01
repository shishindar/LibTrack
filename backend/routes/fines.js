const express = require("express");
const router = express.Router();

const fineController = require("../controllers/fineController");

router.get("/", fineController.getFines);
router.put("/pay/:id", fineController.payFine);

module.exports = router;