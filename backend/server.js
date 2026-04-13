require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/product");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend FIRST
app.use(express.static(path.join(__dirname, "../frontend")));

// Health check (separate path)
app.get("/health", (req, res) => {
  res.send("OK");
});

// Routes
app.use("/api/cart", require("./routes/cart"));
app.use("/api/users", require("./routes/users"));
app.use("/api", productRoutes);

app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});