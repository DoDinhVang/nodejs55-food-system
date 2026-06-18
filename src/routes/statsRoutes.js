import express from "express";
import {
  getTop5UsersMostLikes,
  getTop2RestaurantsMostLikes,
  getUserMostOrders,
  getInactiveUsers,
} from "~/controllers/statsController.js";
const router = express.Router();

router.get("/top-like-user", getTop5UsersMostLikes);
router.get("/top-like-restaurant", getTop2RestaurantsMostLikes);
router.get("/most-order-user", getUserMostOrders);
router.get("/inactive-user", getInactiveUsers);
export default router;
