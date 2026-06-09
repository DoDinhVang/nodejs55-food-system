const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true, // Chờ nếu pool đầy thay vì báo lỗi ngay
  connectionLimit: 10, // Số kết nối tối đa trong pool
  queueLimit: 0,
});

module.exports = mysqlPool;
