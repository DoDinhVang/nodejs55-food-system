import mysql from "mysql2/promise";
import { env } from "./environment.js";
const mysqlPool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
  waitForConnections: true, // Chờ nếu pool đầy thay vì báo lỗi ngay
  connectionLimit: 10, // Số kết nối tối đa trong pool
  queueLimit: 0,
});

export default mysqlPool;
