const express = require("express");
const router = express.Router();

const dynamo = require("../config/dynamo");

const {
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand
} = require("@aws-sdk/lib-dynamodb");


/* ================= GET CART ================= */
router.get("/:userId", async (req, res) => {
  try {
    const data = await dynamo.send(
      new QueryCommand({
        TableName: "cart",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": req.params.userId
        }
      })
    );

    res.json(data.Items || []);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ================= ADD TO CART (OPTIMIZED) ================= */
router.post("/", async (req, res) => {
  try {
    const { userId, productId, name, price, image } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // 🔥 DIRECT CHECK (FAST)
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "cart",
        Key: {
          userId,
          productId
        }
      })
    );

    if (existing.Item) {
      await dynamo.send(
        new UpdateCommand({
          TableName: "cart",
          Key: { userId, productId },
          UpdateExpression: "SET quantity = quantity + :inc",
          ExpressionAttributeValues: {
            ":inc": 1
          }
        })
      );

      return res.json({ message: "Quantity updated" });
    }

    // NEW ITEM
    await dynamo.send(
      new PutCommand({
        TableName: "cart",
        Item: {
          userId,
          productId,
          name,
          price,
          image,
          quantity: 1
        }
      })
    );

    res.json({ message: "Added to cart" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ================= REMOVE ITEM ================= */
router.delete("/:userId/clear", async (req, res) => {
  try {
    const data = await dynamo.send(
      new QueryCommand({
        TableName: "cart",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": req.params.userId
        }
      })
    );

    const items = data.Items || [];

    if (items.length === 0) {
      return res.json({
        message: "Cart already empty",
        deleted: 0
      });
    }

    // 🔥 SAFE PARALLEL DELETE
    await Promise.all(
      items.map(item =>
        dynamo.send(
          new DeleteCommand({
            TableName: "cart",
            Key: {
              userId: String(item.userId),
              productId: String(item.productId)
            }
          })
        )
      )
    );

    return res.json({
      message: "Cart cleared",
      deleted: items.length
    });

  } catch (err) {
    console.error("CLEAR ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;