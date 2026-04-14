const express = require("express");
const router = express.Router();

const dynamo = require("../config/dynamo");
const s3 = require("../config/aws");

const {
  ScanCommand,
  PutCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

/* =========================
   ADD PRODUCT
========================= */
router.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    const { name, cost, category } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageKey = `${Date.now()}-${file.originalname}`;

    // Upload to S3
    await s3.upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageKey,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise();

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;

    const product = {
      id: Date.now().toString(),
      name,
      cost: Number(cost),
      category: (category || "").toLowerCase(),
      imageUrl,
      imageKey
    };

    await dynamo.send(
      new PutCommand({
        TableName: "products",
        Item: product
      })
    );

    res.json({
      message: "Product added successfully",
      product
    });

  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Failed to add product"
    });
  }
});


/* =========================
   GET ALL PRODUCTS (ADMIN)
========================= */
router.get("/admin/products", async (req, res) => {
  try {
    const data = await dynamo.send(
      new ScanCommand({
        TableName: "products"
      })
    );

    res.json(data.Items || []);

  } catch (err) {
    console.error("ADMIN PRODUCTS ERROR:", err);
    res.status(500).json([]);
  }
});


/* =========================
   GET BY CATEGORY
========================= */
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();

    const data = await dynamo.send(
      new ScanCommand({
        TableName: "products"
      })
    );

    const filtered = (data.Items || []).filter(
      item => item.category === category
    );

    res.json(filtered);

  } catch (err) {
    console.error("CATEGORY ERROR:", err);
    res.status(500).json([]);
  }
});


/* =========================
   DELETE PRODUCT
========================= */
router.delete("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const data = await dynamo.send(
      new ScanCommand({
        TableName: "products"
      })
    );

    const product = (data.Items || []).find(
      p => p.id === productId
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Delete from S3
    if (product.imageKey) {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: product.imageKey
      }).promise();
    }

    // Delete from DynamoDB
    await dynamo.send(
      new DeleteCommand({
        TableName: "products",
        Key: {
          id: productId
        }
      })
    );

    res.json({
      message: "Product deleted successfully"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({
      message: "Failed to delete product"
    });
  }
});

module.exports = router;