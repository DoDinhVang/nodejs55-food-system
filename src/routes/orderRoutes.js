import express from "express";
import { addOrder } from "~/controllers/orderController.js";

const router = express.Router();

router.post("/", addOrder);

export default router;
