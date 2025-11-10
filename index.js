import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

/**
 |--------------------------------------------------
 | function imports 
 |--------------------------------------------------
 */


import userRouter from "./routes/userRoute.js";
import { connectDb } from "./db/connectDb.js";
import redisClient from './utils/redis.js'

//connect to redis 
redisClient.connect();

dotenv.config();
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
connectDb();
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
