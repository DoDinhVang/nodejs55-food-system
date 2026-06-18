import express from "express";
import {
  likeRestaurant,
  unlikeRestaurant,
  getLikesByRestaurant,
  getLikesByUser,
} from "~/controllers/likeController.js";

const router = express.Router();

router.post("/", likeRestaurant);
router.delete("/", unlikeRestaurant);
router.get("/restaurant/:res_id", getLikesByRestaurant);
router.get("/user/:user_id", getLikesByUser);

export default router;
