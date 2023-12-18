const classController = require("../controllers/classController");
const express = require("express");
const verifyAuth = require("../middlewares/authVerify");

const router = express.Router();
router.post("/addNewClass", verifyAuth, classController.createClass)
router.get("/getClass", verifyAuth, classController.getAllClass);
module.exports = router;