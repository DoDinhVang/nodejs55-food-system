import express from "express";
import {
  addRating,
  getRatingsByRestaurant,
  getRatingsByUser,
} from "~/controllers/ratingController.js";

const router = express.Router();

router.post("/", addRating);
router.get("/restaurant/:res_id", getRatingsByRestaurant);
router.get("/user/:user_id", getRatingsByUser);

export default router;
