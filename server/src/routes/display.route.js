const express = require("express");
const {
  handleCreateDisplay,
  handleUpdateDisplay,
  handleDeleteDisplay,
  handleGetDisplay,
} = require("../controllers/handler.controller");
const { verifyUser } = require("../middlewares/verifyUser");

const router = express.Router();

router.post("/create", verifyUser, handleCreateDisplay);
router.get("/hardware/:hardwareID", handleGetDisplay);
router.put("/update/:id", verifyUser, handleUpdateDisplay);
router.delete("/delete/:id", verifyUser, handleDeleteDisplay);

module.exports = router;
