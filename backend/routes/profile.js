const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const { requireAuth } = require("../middleware/auth");
const upload = require("../middleware/profileUpload");

router.get("/", requireAuth, profileController.getProfile);

router.put("/", requireAuth, profileController.updateProfile);

router.put(
  "/photo",
  requireAuth,
  (req, res, next) => {
    console.log("PHOTO ROUTE HIT");
    next();
  },
  upload.single("photo"),
  profileController.uploadProfilePicture
);

router.put(
  "/password",
  requireAuth,
  profileController.changePassword
);

router.delete(
  "/photo",
  requireAuth,
  profileController.removeProfilePicture
);

module.exports = router;