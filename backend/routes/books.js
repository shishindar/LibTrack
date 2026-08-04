const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");
const { requireAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", requireAuth, bookController.getAllBooks);
router.get("/:id", requireAuth, bookController.getBookById);

router.post(
  "/",
  requireAuth,
  upload.single("cover"),
  bookController.createBook
);

router.put(
  "/:id",
  requireAuth,
  upload.single("cover"),
  bookController.updateBook
);

router.delete("/:id", requireAuth, bookController.deleteBook);

module.exports = router;