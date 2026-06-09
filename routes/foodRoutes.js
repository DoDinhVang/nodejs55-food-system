const exporess = require("express");
const { getFoods } = require("../controllers/foodController");
const router = exporess.Router();

router.get("/getall", getFoods);
module.exports = router;
