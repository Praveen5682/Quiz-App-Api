const express = require("express");
const router = express.Router();

// Auth
router.use("/auth", require("../models/v1/auth/router/index"));

// Quiz
router.use("/quiz", require("../models/v1/quiz/router/index"));

// Students
router.use("/students", require("../models/v1/users/router/index"));

module.exports = router;
