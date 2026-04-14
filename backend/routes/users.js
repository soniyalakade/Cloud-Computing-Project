const express = require("express");
const router = express.Router();

const dynamo = require("../config/dynamo");
const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

/* =========================
   REGISTER USER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check if user exists
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "users",
        Key: { email }
      })
    );

    if (existing.Item) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = {
      email,
      name,
      password // ⚠️ (for project only, not production)
    };

    await dynamo.send(
      new PutCommand({
        TableName: "users",
        Item: user
      })
    );

    res.json({
      message: "Registered successfully",
      user
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Registration failed"
    });
  }
});


/* =========================
   LOGIN USER
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const data = await dynamo.send(
      new GetCommand({
        TableName: "users",
        Key: { email }
      })
    );

    const user = data.Item;

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    res.json({
      message: "Login successful",
      user
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Login failed"
    });
  }
});

module.exports = router;