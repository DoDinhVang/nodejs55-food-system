import db from "~/config/db.js";
import { success, error } from "~/utils/response.js";

/**
 * Xử lý like nhà hàng
 * POST /api/likes
 * Body: { user_id, res_id }
 */
const likeRestaurant = async (req, res) => {
  try {
    const { user_id, res_id } = req.body;

    // Validate inputs
    if (!user_id || !res_id) {
      return res.status(400).json(error("Thiếu user_id hoặc res_id"));
    }

    const userId = parseInt(user_id, 10);
    const resId = parseInt(res_id, 10);

    if (isNaN(userId) || isNaN(resId)) {
      return res.status(400).json(error("user_id và res_id phải là số hợp lệ"));
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

    // Kiểm tra đã like chưa
    const [likes] = await db.query(
      "SELECT * FROM like_res WHERE user_id = ? AND res_id = ?",
      [userId, resId]
    );
    if (likes.length > 0) {
      return res.status(400).json(error("Người dùng đã thích nhà hàng này rồi"));
    }

    // Thực hiện thêm lượt thích
    await db.query(
      "INSERT INTO like_res (user_id, res_id) VALUES (?, ?)",
      [userId, resId]
    );

    return res.status(201).json(success("Thích nhà hàng thành công"));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Lỗi hệ thống khi thích nhà hàng"));
  }
};

/**
 * Xử lý unlike nhà hàng
 * DELETE /api/likes
 * Body hoặc Query: { user_id, res_id }
 */
const unlikeRestaurant = async (req, res) => {
  try {
    // Lấy thông tin từ query parameters hoặc body
    const user_id = req.query.user_id || req.body.user_id;
    const res_id = req.query.res_id || req.body.res_id;

    // Validate inputs
    if (!user_id || !res_id) {
      return res.status(400).json(error("Thiếu user_id hoặc res_id"));
    }

    const userId = parseInt(user_id, 10);
    const resId = parseInt(res_id, 10);

    if (isNaN(userId) || isNaN(resId)) {
      return res.status(400).json(error("user_id và res_id phải là số hợp lệ"));
    }

    // Kiểm tra lượt like có tồn tại không
    const [likes] = await db.query(
      "SELECT * FROM like_res WHERE user_id = ? AND res_id = ?",
      [userId, resId]
    );
    if (likes.length === 0) {
      return res.status(404).json(error("Thông tin thích nhà hàng không tồn tại"));
    }

    // Thực hiện xóa lượt thích
    await db.query(
      "DELETE FROM like_res WHERE user_id = ? AND res_id = ?",
      [userId, resId]
    );

    return res.status(200).json(success("Bỏ thích nhà hàng thành công"));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Lỗi hệ thống khi bỏ thích nhà hàng"));
  }
};

/**
 * Lấy danh sách like theo nhà hàng
 * GET /api/likes/restaurant/:res_id
 */
const getLikesByRestaurant = async (req, res) => {
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

    // Lấy danh sách user đã like nhà hàng này
    const [rows] = await db.query(
      `SELECT u.user_id, u.full_name, u.email 
       FROM like_res l 
       JOIN user u ON l.user_id = u.user_id 
       WHERE l.res_id = ?`,
      [resId]
    );

    return res.status(200).json(success("Lấy danh sách người dùng thích nhà hàng thành công", rows));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Lỗi hệ thống khi lấy danh sách thích của nhà hàng"));
  }
};

/**
 * Lấy danh sách like theo user
 * GET /api/likes/user/:user_id
 */
const getLikesByUser = async (req, res) => {
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

    // Lấy danh sách nhà hàng được user này like
    const [rows] = await db.query(
      `SELECT r.res_id, r.res_name, r.image, r.desc 
       FROM like_res l 
       JOIN restaurant r ON l.res_id = r.res_id 
       WHERE l.user_id = ?`,
      [userId]
    );

    return res.status(200).json(success("Lấy danh sách nhà hàng người dùng thích thành công", rows));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Lỗi hệ thống khi lấy danh sách nhà hàng đã thích của người dùng"));
  }
};

export {
  likeRestaurant,
  unlikeRestaurant,
  getLikesByRestaurant,
  getLikesByUser,
};
