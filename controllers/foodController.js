const db = require("../config/db");
const { success, error } = require("../utils/response");

const getFoods = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM food");
    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Error in GET ALL foods API"));
  }
};

module.exports = {
  getFoods,
};
