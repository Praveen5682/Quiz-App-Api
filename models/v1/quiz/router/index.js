const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

router.post("/create-quiz", controller.CreateQuiz);
router.post("/quiz", controller.GetAllQuizzes);
router.post("/edit-quiz", controller.EditQuiz);
router.post("/remove-quiz", controller.DeleteQuiz);
router.post("/submit-quiz", controller.SubmitQuiz);
router.post("/leaderboard", controller.GetGeneralLeaderboard);
router.post("/result", controller.GetMyResults);

module.exports = router;
