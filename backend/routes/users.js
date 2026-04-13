const express = require("express");
const router = express.Router();

const dynamo = require("../config/dynamo");
const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await dynamo.send(
      new GetCommand({
        TableName: "users",
        Key: { email }
      })
    );

    if (existing.Item) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = { email, name, password };

    await dynamo.send(
      new PutCommand({
        TableName: "users",
        Item: user
      })
    );

    res.json({ message: "Registered", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await dynamo.send(
      new GetCommand({
        TableName: "users",
        Key: { email }
      })
    );

    const user = data.Item;

    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.password !== password)
      return res.status(401).json({ message: "Wrong password" });

    res.json({ message: "Login success", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;