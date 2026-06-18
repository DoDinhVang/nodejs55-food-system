import express from "express";
import { getFoods } from "~/controllers/foodController.js";
const router = express.Router();

router.get("/getall", getFoods);
export default router;
