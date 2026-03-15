var express = require("express");
var router = express.Router();
let userModel = require("../schemas/users");

// ⚠️ Yêu cầu 2: POST /users/enable — ĐẶT TRƯỚC /:id
router.post("/enable", async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({ message: "Thiếu email hoặc username" });
    }
    let result = await userModel.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: true },
      { new: true },
    );
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Không tìm thấy user" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ⚠️ Yêu cầu 3: POST /users/disable — ĐẶT TRƯỚC /:id
router.post("/disable", async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({ message: "Thiếu email hoặc username" });
    }
    let result = await userModel.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: false },
      { new: true },
    );
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Không tìm thấy user" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET ALL
router.get("/", async function (req, res, next) {
  let result = await userModel.find({ isDeleted: false }).populate("role");
  res.send(result);
});

// GET BY ID
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel
      .findOne({ _id: id, isDeleted: false })
      .populate("role");
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// CREATE
router.post("/", async function (req, res, next) {
  let newUser = new userModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    role: req.body.role,
  });
  await newUser.save();
  res.send(newUser);
});

// UPDATE
router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// SOFT DELETE
router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
