require('dotenv').config()

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT
  },
  "production": {
    "username": "postgres",
    "password": "1981912",
    "database": "xxx",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
