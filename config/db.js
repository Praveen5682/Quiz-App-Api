const knex = require("knex");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
      rejectUnauthorized: true, // extra safety
    },
  },
  pool: { min: 2, max: 10 },
});

// ✅ Test connection
db.raw("SELECT 1")
  .then(() => console.log("✅ Securely connected to TiDB Cloud Db!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

module.exports = db;
