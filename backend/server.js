require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

connectDB();

// CORS — allow localhost AND any netlify domain
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.includes("localhost") ||
      origin.includes("netlify.app") ||
      origin.includes("vercel.app")
    ) {
      return callback(null, true);
    }
    return callback(null, true); // allow all origins
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Food Delivery API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

module.exports = app;