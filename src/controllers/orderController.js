import db from "~/config/db.js";
import { success, error } from "~/utils/response.js";

/**
 * Thêm đơn đặt món (Order)
 * POST /api/orders
 * Body: { user_id, food_id, amount, code, arr_sub_id }
 */
const addOrder = async (req, res, next) => {
  try {
    const { user_id, food_id, amount, code, arr_sub_id } = req.body;

    // Validate inputs
    if (
      user_id === undefined ||
      food_id === undefined ||
      amount === undefined
    ) {
      return res
        .status(400)
        .json(error("Thiếu thông tin user_id, food_id hoặc amount"));
    }

    const userId = parseInt(user_id, 10);
    const foodId = parseInt(food_id, 10);
    const orderAmount = parseInt(amount, 10);

    if (isNaN(userId) || isNaN(foodId) || isNaN(orderAmount)) {
      return res
        .status(400)
        .json(
          error("Các thông số user_id, food_id và amount phải là số hợp lệ"),
        );
    }

    if (orderAmount <= 0) {
      return res
        .status(400)
        .json(error("Số lượng đặt món (amount) phải lớn hơn 0"));
    }

    // Kiểm tra user có tồn tại không
    const [users] = await db.query("SELECT * FROM user WHERE user_id = ?", [
      userId,
    ]);
    if (users.length === 0) {
      return res.status(404).json(error("Người dùng không tồn tại"));
    }

    // Kiểm tra món ăn (food) có tồn tại không
    const [foods] = await db.query("SELECT * FROM food WHERE food_id = ?", [
      foodId,
    ]);
    if (foods.length === 0) {
      return res.status(404).json(error("Món ăn không tồn tại"));
    }

    // Xử lý mã đơn hàng (code)
    // Nếu không truyền code thì tự sinh dựa trên timestamp
    const orderCode = code ? String(code).trim() : `ORD-${Date.now()}`;

    // Xử lý arr_sub_id (món phụ kèm theo, nếu dạng mảng thì chuyển sang chuỗi nối dấu phẩy)
    let arrSubId = "";
    if (Array.isArray(arr_sub_id)) {
      arrSubId = arr_sub_id.join(",");
    } else if (arr_sub_id !== undefined && arr_sub_id !== null) {
      arrSubId = String(arr_sub_id).trim();
    }

    // Thực hiện lưu đơn hàng
    const [result] = await db.query(
      "INSERT INTO `order` (user_id, food_id, amount, code, arr_sub_id) VALUES (?, ?, ?, ?, ?)",
      [userId, foodId, orderAmount, orderCode, arrSubId],
    );

    return res.status(201).json(
      success("Đặt món thành công", {
        order_id: result.insertId,
        user_id: userId,
        food_id: foodId,
        amount: orderAmount,
        code: orderCode,
        arr_sub_id: arrSubId,
      }),
    );
  } catch (err) {
    next(err);
  }
};

export { addOrder };
