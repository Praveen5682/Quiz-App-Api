const service = require("../service/index");
const {
  createQuizSchema,
  editQuizSchema,
  deleteQuizSchema,
  submitQuizSchema,
  leaderboardSchema,
  getMyResultsSchema,
} = require("../validator");

module.exports.CreateQuiz = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createQuizSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => err.message);
      return res.status(400).json({
        status: false,
        message: messages.join(", "),
      });
    }

    // Call service, passing logged-in user from auth middleware
    const response = await service.CreateQuiz(value, req.user);

    return res.status(response.status ? 201 : 400).json(response);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ------------------------------------ CreateQuiz End ------------------------------------------------------//

module.exports.GetAllQuizzes = async (req, res) => {
  try {
    const response = await service.GetAllQuizzes();
    return res.status(response.status ? 200 : 500).json(response);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ------------------------------------ GetQuiz End ------------------------------------------------------//

module.exports.EditQuiz = async (req, res) => {
  try {
    const { error, value } = editQuizSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const messages = error.details.map((err) => err.message);
      return res
        .status(400)
        .json({ status: false, message: messages.join(", ") });
    }

    const response = await service.EditQuestion(value);
    return res.status(response.status ? 200 : 400).json(response);
  } catch (error) {
    console.error("Controller Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// ------------------------------------ EditQuiz End ------------------------------------------------------//

module.exports.DeleteQuiz = async (req, res) => {
  try {
    const { error, value } = deleteQuizSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const messages = error.details.map((err) => err.message);
      return res
        .status(400)
        .json({ status: false, message: messages.join(", ") });
    }

    // Pass both quizid and questionid to the service
    const response = await service.DeleteQuestion({
      quizid: value.quizid,
      questionid: value.questionid,
    });

    return res.status(response.status ? 200 : 400).json(response);
  } catch (error) {
    console.error("Controller Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
// ------------------------------------ DeleteQuiz End ------------------------------------------------------//

module.exports.SubmitQuiz = async (req, res) => {
  try {
    const { error, value } = submitQuizSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }

    const { userid, quizid, answers } = value;
    const response = await service.SubmitQuiz({ userid, quizid, answers });

    return res.status(response.status ? 200 : 500).json(response);
  } catch (error) {
    console.error("SubmitQuiz Controller Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ------------------------------------ SubmitQuiz End ------------------------------------------------------//

module.exports.GetGeneralLeaderboard = async (req, res) => {
  try {
    const response = await service.GetGeneralLeaderboard();
    return res.status(response.status ? 200 : 500).json(response);
  } catch (error) {
    console.error("GetGeneralLeaderboard Controller Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ------------------------------------ GetLeaderboard End ------------------------------------------------------//

module.exports.GetMyResults = async (req, res) => {
  try {
    const { error, value } = getMyResultsSchema.validate(req.body); // ← validation

    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }

    const response = await service.GetMyResults(value);
    return res.status(response.status ? 200 : 500).json(response);
  } catch (error) {
    console.error("GetMyResults Controller Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ------------------------------------ GetMyResults End ------------------------------------------------------//
