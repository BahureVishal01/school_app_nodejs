const authController = require("../controllers/authController");
const express = require("express");
const upload = require("../middlewares/uploader");
const verifyAuth = require("../middlewares/authVerify");

const router = express.Router();

router.post("/signup",upload.any(), authController.registerUser);

router.post("/login", authController.userLogin);


module.exports = router;
