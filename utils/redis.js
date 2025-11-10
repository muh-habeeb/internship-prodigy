import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();
const redisClient = createClient({
    host: process.env.REDIS_HOST ?? "localhost",
    port: process.env.REDIS_PORT ?? 5000,
    password: process.env.REDIS_PASSWORD ?? undefined

})

redisClient.on("error", (error) => {
    console.log("Redis Error", error)
})

redisClient.on("connect", (cnn) => {
    console.log("redis connected", cnn)
})

export default redisClient;