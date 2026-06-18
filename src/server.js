import express from "express";
import cors from "cors";
import morgan from "morgan";
import mysqlPool from "~/config/db.js";
import foodRoutes from "~/routes/foodRoutes.js";
import statsRoutes from "~/routes/statsRoutes.js";
import likeRoutes from "~/routes/likeRoutes.js";
import ratingRoutes from "~/routes/ratingRoutes.js";
import orderRoutes from "~/routes/orderRoutes.js";
import { env } from "~/config/environment.js";
import { corsOptions } from "~/config/cors.js";

const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));

//routes
app.use("/api/foods", foodRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/orders", orderRoutes);

//port
const PORT = env.PORT || 8000;

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
