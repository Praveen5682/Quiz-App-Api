// utils/knexfile.js
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      user: "yogadev",
      password: "Roacs2025",
      database: "yoga_dev",
    },
    pool: { min: 2, max: 10 },
    debug: false,
  },
  production: {
    client: "mysql2",
    connection: {
      host: "193.203.184.189",
      user: "u596329347_yoga",
      password: "Roacs@2025",
      database: "u596329347_yoga",
    },
    pool: { min: 2, max: 10 },
    debug: false,
  },
};
