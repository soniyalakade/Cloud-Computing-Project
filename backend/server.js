require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK (IMPORTANT FOR ALB)
========================= */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* =========================
   API ROUTES
========================= */
app.use("/api/cart", require("./routes/cart"));
app.use("/api/users", require("./routes/users"));
app.use("/api", require("./routes/product"));

/* =========================
   STATIC FRONTEND (OPTIONAL)
   IMPORTANT: only works if you open via ALB
========================= */
app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({
    message: "Internal Server Error"
  });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});