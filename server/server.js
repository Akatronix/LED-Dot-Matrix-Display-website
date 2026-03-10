const express = require("express");
const DisplayRoutes = require("./src/routes/display.route");
const UserRoutes = require("./src/routes/auth.route");
const connectDB = require("./src/config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/display", DisplayRoutes);
app.use("/api/user", UserRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
