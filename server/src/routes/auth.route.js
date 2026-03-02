const express = require("express");
const {
  register,
  login,
  refreshTokenController,
  getUserInfo,
  getDisplayInfo,
  logoutHandler,
} = require("../controllers/user.controller");
const { verifyUser } = require("../middlewares/verifyUser");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refreshTokenController);
router.post("/logout", logoutHandler);
router.get("/getData", verifyUser, getUserInfo);
router.get("/getDetails/:id", verifyUser, getDisplayInfo);

module.exports = router;
