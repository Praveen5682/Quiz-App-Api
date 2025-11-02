const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

router.post("/get-students", controller.GetStudents);

module.exports = router;
