import db from "~/config/db.js";
import { success, error } from "~/utils/response.js";

/**
 * Tìm 5 người đã like nhà hàng nhiều nhất
 * @param {*} req
 * @param {*} res
 */
const getTop5UsersMostLikes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.full_name, COUNT(l.res_id) AS like_count
      FROM user u
      JOIN like_res l ON u.user_id = l.user_id
      GROUP BY u.user_id
      ORDER BY like_count DESC
      LIMIT 5
    `);
    res.status(200).json(success("Top 5 người like nhà hàng nhiều nhất", rows));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(error("Lỗi khi lấy top 5 người like nhà hàng nhiều nhất"));
  }
};

/**
 * Tìm 2 nhà hàng có lượt like nhiều nhất
 * @param {*} req
 * @param {*} res
 */
const getTop2RestaurantsMostLikes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.res_name, COUNT(l.user_id) AS like_count
      FROM restaurant r
      JOIN like_res l ON r.res_id = l.res_id
      GROUP BY r.res_id
      ORDER BY like_count DESC
      LIMIT 2
    `);
    res
      .status(200)
      .json(success("Top 2 nhà hàng có lượt like nhiều nhất", rows));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(error("Lỗi khi lấy top 2 nhà hàng có lượt like nhiều nhất"));
  }
};

/**
 * Tìm người đã đặt hàng nhiều nhất
 * @param {*} req
 * @param {*} res
 */
const getUserMostOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.full_name, COUNT(o.order_id) AS order_count
      FROM user u
      JOIN \`order\` o ON u.user_id = o.user_id
      GROUP BY u.user_id
      ORDER BY order_count DESC
      LIMIT 1
    `);
    res.status(200).json(success("Người đặt hàng nhiều nhất", rows));
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Lỗi khi lấy người đặt hàng nhiều nhất"));
  }
};

/**
 * Tìm người dùng không hoạt động (không đặt hàng, không like, không rate)
 * @param {*} req
 * @param {*} res
 */
const getInactiveUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.user_id, u.full_name
      FROM user u
      LEFT JOIN \`order\` o ON u.user_id = o.user_id
      LEFT JOIN like_res l ON u.user_id = l.user_id
      LEFT JOIN rate_res r ON u.user_id = r.user_id
      WHERE o.order_id IS NULL
        AND l.res_id IS NULL
        AND r.res_id IS NULL
    `);
    res.status(200).json(success("Danh sách người dùng không hoạt động", rows));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(error("Lỗi khi lấy danh sách người dùng không hoạt động"));
  }
};

export {
  getTop5UsersMostLikes,
  getTop2RestaurantsMostLikes,
  getUserMostOrders,
  getInactiveUsers,
};
