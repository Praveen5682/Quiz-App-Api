const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../../../config/db");

module.exports.Registration = async (props = {}) => {
  const { name, email, password } = props;

  if (!name || !email || !password) {
    return { status: false, message: "Name, email, and password are required" };
  }
  try {
    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      return { status: false, message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await db("users").insert({
      fullname: name,
      email,
      password: hashedPassword,
      role: "student",
    });

    const token = jwt.sign(
      { userId, role: "student" },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    return { status: true, message: "Registration successful", token };
  } catch (error) {
    console.error("Service Error:", error);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ Registration End ------------------------------------------------------//

module.exports.Login = async (props = {}) => {
  const { email, password, role } = props;

  if (!email || !password || !role) {
    return { status: false, message: "Email, password, and role are required" };
  }

  try {
    const user = await db("users").where({ email, role }).first();
    if (!user) {
      return { status: false, message: "Invalid email or role" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: false, message: "Incorrect password" };
    }

    const token = jwt.sign(
      { userId: user.userid, role: user.role, name: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return { status: true, message: "Login successful", token };
  } catch (error) {
    console.error("Service Error:", error);
    return { status: false, message: "Internal server error" };
  }
};

// ------------------------------------ Login End ------------------------------------------------------//
