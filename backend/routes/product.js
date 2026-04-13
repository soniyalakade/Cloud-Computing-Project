const express = require("express");
const router = express.Router();

const dynamo = require("../config/dynamo");
const s3 = require("../config/aws");

const {
  ScanCommand,
  PutCommand
} = require("@aws-sdk/lib-dynamodb");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// ================= ADD PRODUCT =================
router.post("/add-product", upload.single("image"), async (req, res) => {
  try {

    const { name, cost, category } = req.body;

    const file = req.file;

const imageKey = Date.now() + "-" + file.originalname;

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
  cost,
  category: category.toLowerCase(),
  imageUrl,
  imageKey   // 🔥 IMPORTANT ADD THIS
};

    await dynamo.send(
      new PutCommand({
        TableName: "products",
        Item: product
      })
    );

    res.json({ message: "Product added", product });

  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json(err);
  }
});

// ================= GET ALL PRODUCTS (ADMIN) =================
router.get("/admin/products", async (req, res) => {
  try {

    const data = await dynamo.send(
      new ScanCommand({
        TableName: "products"
      })
    );

    res.json(data.Items);

  } catch (err) {
    console.error("ADMIN PRODUCTS ERROR:", err);
    res.status(500).json(err);
  }
});

// ================= GET BY CATEGORY =================
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const data = await dynamo.send(
      new ScanCommand({
        TableName: "products"
      })
    );

    const filtered = data.Items.filter(
      item => item.category === category.toLowerCase()
    );

    res.json(filtered);

  } catch (err) {
    console.error("CATEGORY ERROR:", err);
    res.status(500).json(err);
  }
});

const { GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");


router.delete("/product/:id", async (req, res) => {
  try {

    const productId = req.params.id;

    // 1️⃣ Get product first (to get imageKey)
    const data = await dynamo.send(
      new ScanCommand({
        TableName: "products"
      })
    );

    const product = data.Items.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ DELETE FROM S3
    if (product.imageKey) {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: product.imageKey
      }).promise();
    }

    // 3️⃣ DELETE FROM DYNAMODB
    await dynamo.send(
      new DeleteCommand({
        TableName: "products",
        Key: {
          id: productId   // IMPORTANT: must match partition key
        }
      })
    );

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json(err);
  }
});
module.exports = router;