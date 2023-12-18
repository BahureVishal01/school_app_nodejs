const schoolController = require("../controllers/schoolController");
const express = require("express");
const verifyAuth = require("../middlewares/authVerify");
const imageUpload = require("../middlewares/uploader");

const router = express.Router();

router.post("/newSchool",verifyAuth, imageUpload.any(), schoolController.createSchool);

router.get("/getMySchools",verifyAuth, schoolController.getMySchools);

router.post("/shareInviteCode", verifyAuth, schoolController.shareInviteCode);


module.exports = router;