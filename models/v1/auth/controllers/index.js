const service = require("../service/index");
const { registerSchema, loginSchema } = require("../validator");

module.exports.Registration = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => err.message);
      return res.status(400).json({
        status: false,
        message: messages.join(", "),
      });
    }

    const response = await service.Registration(value);

    return res.status(response.status ? 201 : 400).json(response);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ------------------------------------ Registration End ------------------------------------------------------//

module.exports.Login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => err.message);
      return res
        .status(400)
        .json({ status: false, message: messages.join(", ") });
    }

    const response = await service.Login(value);

    return res.status(response.status ? 200 : 400).json(response);
  } catch (err) {
    console.error("Controller Error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

// ------------------------------------ Login End ------------------------------------------------------//
