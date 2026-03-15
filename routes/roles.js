var express = require("express");
var router = express.Router();
let roleModel = require("../schemas/roles");
let userModel = require("../schemas/users");

router.get("/:id/users", async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel
      .find({ role: id, isDeleted: false })
      .populate("role");
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/", async function (req, res, next) {
  let result = await roleModel.find({ isDeleted: false });
  res.send(result);
});

router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOne({ _id: id, isDeleted: false });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post("/", async function (req, res, next) {
  let newRole = new roleModel({
    name: req.body.name,
    description: req.body.description,
  });
  await newRole.save();
  res.send(newRole);
});

router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findByIdAndUpdate(
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
