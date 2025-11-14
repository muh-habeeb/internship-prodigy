import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import chalk from "chalk";
/**
 |--------------------------------------------------
 | function imports 
 |--------------------------------------------------
 */


import { connectDb } from "./db/connectDb.js";
import redisClient from './utils/redis.js'
import userRoute from "./routes/userRoute.js";
import roomRoute from "./routes/roomRoute.js";
import bookingRoute from "./routes/bookingRoute.js"
//connect to redis 
redisClient.connect();

dotenv.config();
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
connectDb();

/**
|--------------------------------------------------
| Routes 
|--------------------------------------------------
*/

app.use("/api/users", userRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/bookings", bookingRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(chalk.bgGreen(chalk.black(`Server is running on port ${PORT}`)));
});


// console.log(new Date().toISOString());
// const now = new Date();

// // 3 days in milliseconds
// const threeDays = 3 * 24 * 60 * 60 * 1000;

// // Timestamp for 3 days later
// const afterThreeDays = new Date(now.getTime() + threeDays);

// console.log(afterThreeDays.toISOString());