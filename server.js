const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running👋🏻");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
