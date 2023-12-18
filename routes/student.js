const studentController = require("../controllers/studentController");
const express = require("express");
const imageUpload = require("../middlewares/uploader");
const verifyAuth = require("../middlewares/authVerify");

const router = express.Router();

router.get("/getAllStudent", verifyAuth, studentController.getAllStudent)
router.post("/addNewStudent", verifyAuth, imageUpload.any(), studentController.createNewStudent);
router.post("/assignClass", verifyAuth, studentController.assingClassToStudent)
router.get("/getMyClassmates", verifyAuth, studentController.getClassmatesList)
router.get("/getAllClassesStudent", verifyAuth, studentController.getStudentsList)

module.exports = router;
