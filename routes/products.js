var express = require("express");
var router = express.Router();
let productModel = require("../schemas/products");
const multer = require("multer");
const path = require("path");

// Cấu hình lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// READ ALL
router.get("/", async function (req, res, next) {
  try {
    let result = await productModel.find({});
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// READ ONE
router.get("/:id", async function (req, res, next) {
  try {
    let result = await productModel.findById(req.params.id);
    if (!result) return res.status(404).send({ message: "Product not found" });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// CREATE
router.post("/", upload.single("image"), async function (req, res, next) {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const imagePath = req.file ? `/images/${req.file.filename}` : null;
    let result = await productModel.create({
      ...req.body,
      image: imagePath,
    });
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// UPDATE
router.put("/:id", upload.single("image"), async function (req, res, next) {
  try {
    const imagePath = req.file ? `/images/${req.file.filename}` : undefined;
    const updateData = imagePath
      ? { ...req.body, image: imagePath }
      : { ...req.body };

    let result = await productModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    if (!result) return res.status(404).send({ message: "Product not found" });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// DELETE
router.delete("/:id", async function (req, res, next) {
  try {
    let result = await productModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ message: "Product not found" });
    res.send({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
