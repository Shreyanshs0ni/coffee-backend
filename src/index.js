import "dotenv/config";

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on : ${process.env.PORT}`);
    });
    app.on("error", (error) => {
      console.log("error : ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed :", err);
  });
