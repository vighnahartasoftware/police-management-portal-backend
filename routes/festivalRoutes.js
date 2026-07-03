const express = require("express");
const multer = require("multer");
const path = require("path");

const verifyToken = require("../middleware/authMiddleware");

const {
  createFestivalPermission,
  getFestivalPermissions,
  getSingleFestivalPermission,
  updateFestivalPermission,
  deleteFestivalPermission,
} = require("../controllers/festivalController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, "festival-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", verifyToken, upload.single("photo"), createFestivalPermission);
router.get("/", verifyToken, getFestivalPermissions);
router.get("/:id", verifyToken, getSingleFestivalPermission);
router.put("/:id", verifyToken, updateFestivalPermission);
router.delete("/:id", verifyToken, deleteFestivalPermission);

module.exports = router;