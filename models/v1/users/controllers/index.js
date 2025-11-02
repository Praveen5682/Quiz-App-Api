const service = require("../service/index");

module.exports.GetStudents = async (req, res) => {
  try {
    const response = await service.GetStudents();
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
