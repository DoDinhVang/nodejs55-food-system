import db from "~/config/db.js";
import { success, error } from "~/utils/response.js";

const getFoods = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM food");
    res.status(200).json(success("Lấy danh sách món ăn thành công", rows));
  } catch (err) {
    next(err);
  }
};

export { getFoods };
