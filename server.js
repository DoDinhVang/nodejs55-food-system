const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mysqlPool = require("./config/db");
dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));

//routes
const foodRoutes = require("./routes/foodRoutes");
const statsRoutes = require("./routes/statsRoutes");
const likeRoutes = require("./routes/likeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/foods", foodRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/orders", orderRoutes);

//port
const PORT = process.env.PORT || 8000;

//listen
mysqlPool
  .getConnection()
  .then((connection) => {
    connection.release();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MySQL database:", err);
    process.exit(1);
  });
