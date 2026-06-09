const db = require("../config/db");
const { success, error } = require("../utils/response");

const getFoods = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM food");
    res.status(200).json(success("Lấy danh sách món ăn thành công", rows));
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Lỗi khi lấy danh sách món ăn"));
  }
};

module.exports = {
  getFoods,
};
