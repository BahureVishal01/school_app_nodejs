const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const schoolRoutes = require("./school")
const studentRoutes = require("./student");
const classRoutes = require("./class");
router.use("/user", userRoutes);
router.use("/school", schoolRoutes)
router.use("/class", classRoutes);
router.use("/student", studentRoutes);

module.exports = router;