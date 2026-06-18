import db from "~/config/db.js";
import { success, error } from "~/utils/response.js";

/**
 * Thêm hoặc cập nhật đánh giá nhà hàng
 * POST /api/ratings
 * Body: { user_id, res_id, amount }
 */
const addRating = async (req, res) => {
  try {
    const { user_id, res_id, amount } = req.body;

    // Validate inputs
    if (user_id === undefined || res_id === undefined || amount === undefined) {
      return res.status(400).json(error("Thiếu thông tin user_id, res_id hoặc amount"));
    }

    const userId = parseInt(user_id, 10);
    const resId = parseInt(res_id, 10);
    const ratingAmount = parseInt(amount, 10);

    if (isNaN(userId) || isNaN(resId) || isNaN(ratingAmount)) {
      return res.status(400).json(error("Các thông số user_id, res_id và amount phải là số hợp lệ"));
    }

    if (ratingAmount < 1 || ratingAmount > 5) {
      return res.status(400).json(error("Số điểm đánh giá (amount) phải từ 1 đến 5"));
    }

    // Kiểm tra user có tồn tại không
    const [users] = await db.query("SELECT * FROM user WHERE user_id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json(error("Người dùng không tồn tại"));
    }

    // Kiểm tra nhà hàng có tồn tại không
    const [restaurants] = await db.query("SELECT * FROM restaurant WHERE res_id = ?", [resId]);
    if (restaurants.length === 0) {
      return res.status(404).json(error("Nhà hàng không tồn tại"));
    }

    // Kiểm tra xem đã có đánh giá chưa
    const [ratings] = await db.query(
      "SELECT * FROM rate_res WHERE user_id = ? AND res_id = ?",
      [userId, resId]
    );

    if (ratings.length > 0) {
      // Đã tồn tại đánh giá, thực hiện cập nhật
      await db.query(
        "UPDATE rate_res SET amount = ?, date_rate = CURRENT_TIMESTAMP WHERE user_id = ? AND res_id = ?",
        [ratingAmount, userId, resId]
      );
      return res.status(200).json(success("Cập nhật đánh giá nhà hàng thành công"));
    } else {
      // Chưa tồn tại đánh giá, thực hiện thêm mới
      await db.query(
        "INSERT INTO rate_res (user_id, res_id, amount) VALUES (?, ?, ?)",
        [userId, resId, ratingAmount]
      );
      return res.status(201).json(success("Thêm đánh giá nhà hàng thành công"));
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Lỗi hệ thống khi đánh giá nhà hàng"));
  }
};

/**
 * Lấy danh sách đánh giá theo nhà hàng
 * GET /api/ratings/restaurant/:res_id
 */
const getRatingsByRestaurant = async (req, res) => {
  try {
    const { res_id } = req.params;
    const resId = parseInt(res_id, 10);

    if (isNaN(resId)) {
      return res.status(400).json(error("res_id phải là số hợp lệ"));
    }

    // Kiểm tra nhà hàng có tồn tại không
    const [restaurants] = await db.query("SELECT * FROM restaurant WHERE res_id = ?", [resId]);
    if (restaurants.length === 0) {
      return res.status(404).json(error("Nhà hàng không tồn tại"));
    }

    // Lấy danh sách đánh giá cùng thông tin người dùng
    const [rows] = await db.query(
      `SELECT r.user_id, u.full_name, u.email, r.amount, r.date_rate 
       FROM rate_res r 
       JOIN user u ON r.user_id = u.user_id 
       WHERE r.res_id = ?`,
      [resId]
    );

    return res.status(200).json(success("Lấy danh sách đánh giá của nhà hàng thành công", rows));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Lỗi hệ thống khi lấy danh sách đánh giá của nhà hàng"));
  }
};

/**
 * Lấy danh sách đánh giá theo user
 * GET /api/ratings/user/:user_id
 */
const getRatingsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userId = parseInt(user_id, 10);

    if (isNaN(userId)) {
      return res.status(400).json(error("user_id phải là số hợp lệ"));
    }

    // Kiểm tra người dùng có tồn tại không
    const [users] = await db.query("SELECT * FROM user WHERE user_id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json(error("Người dùng không tồn tại"));
    }

    // Lấy danh sách đánh giá cùng thông tin nhà hàng của user này
    const [rows] = await db.query(
      `SELECT r.res_id, res.res_name, res.image, res.desc, r.amount, r.date_rate 
       FROM rate_res r 
       JOIN restaurant res ON r.res_id = res.res_id 
       WHERE r.user_id = ?`,
      [userId]
    );

    return res.status(200).json(success("Lấy danh sách đánh giá của người dùng thành công", rows));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Lỗi hệ thống khi lấy danh sách đánh giá của người dùng"));
  }
};

export {
  addRating,
  getRatingsByRestaurant,
  getRatingsByUser,
};
