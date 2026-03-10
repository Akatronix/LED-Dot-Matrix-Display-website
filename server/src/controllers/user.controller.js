const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { loginSchema } = require("../verifier/checkLogin");
const { generateToken } = require("../lib/token/tokenGenerator");
const Display = require("../models/Display.model");

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields (username, email, password) are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "This email is already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Hashed password generated:", passwordHash);

    const newUser = new User({
      username,
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    const userObject = savedUser.toObject();
    delete userObject.passwordHash;

    res.status(201).json({
      message: "User registered successfully!",
      user: userObject,
    });
  } catch (error) {
    console.error("Error during registration:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "This email is already in use." });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function login(req, res) {
  try {
    const data = loginSchema.safeParse(req.body);

    if (!data.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: data.error.errors });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.passwordHash,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = await generateToken(
      { userId: existingUser._id },
      process.env.JWT_ACCESS_SECRET,
      "15m",
    );

    const refreshToken = await generateToken(
      { userId: existingUser._id },
      process.env.JWT_REFRESH_SECRET,
      "7d",
    );

    const userData = {
      username: existingUser.username,
      email: existingUser.email,
    };

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    
    res
      .status(200)
      .json({ message: "Login successful", accessToken, user: userData });
  } catch (error) {
    console.error("Error logging-in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutHandler(req, res) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function refreshTokenController(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      console.log("No refresh token found in cookies");
      return res.status(401).json({ message: "Refresh token is required" });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    // Generate new access token
    const newAccessToken = await generateToken(
      { userId: userId },
      process.env.JWT_ACCESS_SECRET,
      "15m",
    );

    res.status(200).json({
      accessToken: newAccessToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserInfo(req, res) {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const displays = await Display.find({ userID: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      displays: displays,
    });
  } catch (error) {
    console.error("Error fetching user info and displays:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getDisplayInfo(req, res) {
  try {
    const { id: displayId } = req.params;
    const userId = req.user?.userId;

    const display = await Display.findOne({ _id: displayId, userID: userId });
    if (!display) {
      return res.status(404).json({ message: "Display not found." });
    }
    res.status(200).json(display);
  } catch (error) {
    console.error("Error fetching display info:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid display ID format." });
    }
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  register,
  login,
  refreshTokenController,
  getUserInfo,
  getDisplayInfo,
  logoutHandler,
};
