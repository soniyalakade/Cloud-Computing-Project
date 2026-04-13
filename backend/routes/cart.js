const express = require("express");
const router = express.Router();

const dynamo = require("../config/dynamo");

const {
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");


// ================= GET CART =================
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


// ================= ADD TO CART =================
router.post("/", async (req, res) => {
  try {

    const { userId, productId, name, price, image } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const data = await dynamo.send(
      new QueryCommand({
        TableName: "cart",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": userId
        }
      })
    );

    const existing = data.Items.find(i => i.productId === productId);

    if (existing) {
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


// ================= CLEAR CART (MUST BE FIRST) =================
router.delete("/:userId/clear", async (req, res) => {
  try {
    const userId = req.params.userId;

    const data = await dynamo.send(
      new QueryCommand({
        TableName: "cart",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": userId
        }
      })
    );

    const items = data.Items || [];

    if (items.length === 0) {
      return res.json({ message: "Cart already empty", deleted: 0 });
    }

    await Promise.all(
      items.map(item =>
        dynamo.send(
          new DeleteCommand({
            TableName: "cart",
            Key: {
              userId: item.userId,
              productId: item.productId
            }
          })
        )
      )
    );

    return res.json({
      message: "Cart cleared successfully",
      deleted: items.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// ================= REMOVE ITEM =================
router.delete("/:userId/:productId", async (req, res) => {
  try {
    await dynamo.send(
      new DeleteCommand({
        TableName: "cart",
        Key: {
          userId: req.params.userId,
          productId: req.params.productId
        }
      })
    );

    res.json({ message: "Item removed" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;