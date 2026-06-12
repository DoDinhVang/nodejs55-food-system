const express = require("express");
const {
  likeRestaurant,
  unlikeRestaurant,
  getLikesByRestaurant,
  getLikesByUser,
} = require("../controllers/likeController");

const router = express.Router();

router.post("/", likeRestaurant);
router.delete("/", unlikeRestaurant);
router.get("/restaurant/:res_id", getLikesByRestaurant);
router.get("/user/:user_id", getLikesByUser);

module.exports = router;
