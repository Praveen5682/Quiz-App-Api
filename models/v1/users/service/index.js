const db = require("../../../../config/db");

module.exports.GetStudents = async () => {
  try {
    const students = await db("users")
      .where("role", "student") // only fetch students
      .select(
        "userid", // primary key
        "fullname",
        "email",
        "role",
        "createdat"
      );

    return { status: true, students };
  } catch (error) {
    console.error("Service Error:", error);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ GetStudents End ------------------------------------------------------//
