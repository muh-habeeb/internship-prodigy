import { createClient } from "redis";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();
const redisClient = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    // password: process.env.REDIS_PASSWORD,
})

redisClient.on("error", (error) => {
    console.log("Redis Error :", error)
})

redisClient.on("connect", () => {
    console.log(chalk.yellowBright("--------------redis connected---------------"))
})

export default redisClient;