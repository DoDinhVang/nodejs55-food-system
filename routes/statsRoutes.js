const exporess = require("express");
const {
  getTop5UsersMostLikes,
  getTop2RestaurantsMostLikes,
  getUserMostOrders,
  getInactiveUsers,
} = require("../controllers/statsController");
const router = exporess.Router();

router.get("/top-like-user", getTop5UsersMostLikes);
router.get("/top-like-restaurant", getTop2RestaurantsMostLikes);
router.get("/most-order-user", getUserMostOrders);
router.get("/inactive-user", getInactiveUsers);
module.exports = router;
