import db from "../config/db.js";
import { success, error } from "../utils/response.js";

const getFoods = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM food");
    res.status(200).json(success("Lấy danh sách món ăn thành công", rows));
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Lỗi khi lấy danh sách món ăn"));
  }
};

export {
  getFoods,
};
