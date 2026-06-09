const express = require("express");
const {
  addRating,
  getRatingsByRestaurant,
  getRatingsByUser,
} = require("../controllers/ratingController");

const router = express.Router();

router.post("/", addRating);
router.get("/restaurant/:res_id", getRatingsByRestaurant);
router.get("/user/:user_id", getRatingsByUser);

module.exports = router;
