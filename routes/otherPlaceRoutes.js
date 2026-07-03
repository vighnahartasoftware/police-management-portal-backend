const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  createOtherPlace,
  getOtherPlaces,
  deleteOtherPlace,
} = require("../controllers/otherPlaceController");

router.post("/", verifyToken, createOtherPlace);
router.get("/", verifyToken, getOtherPlaces);
router.delete("/:id", verifyToken, deleteOtherPlace);

module.exports = router;