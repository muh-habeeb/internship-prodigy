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
import userRouter from "./routes/userRoute.js";
import roomRouter from "./routes/roomRoute.js";

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

app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);



app.listen(PORT, () => {
  console.log(chalk.bgGreen(chalk.black(`Server is running on port ${PORT}`)));
});
