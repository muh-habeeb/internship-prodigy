import e, { json } from "express";
import redisClient from "../../utils/redis.js";

export const setCache = async (key, value, expInSec = 3600) => {
    try {
        await redisClient.setEx(key, expInSec, JSON.stringify(value));
        console.log("Cache Set Successfully");
        console.log(JSON.stringify(value))
    } catch (error) {
        console.error("Cache Set Error", error);
    }
}


export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        if (data) {
            console.log("Cache Hit ", key)
            return JSON.parse(data);
        }
        else {
            console.log("Cache Miss ", key)
        }
    } catch (error) {

        console.error("Cache get Error", error);
    }
}

export const deleteCache = async (key) => {
    try {
        await redisClient.del(key);
        console.log("Cache Deleted Successfully", key);
    }
    catch (error) {
        console.error("Cache Delete Error", error);
    }
}

export const clearAllCache = async () => {
    try {
        await redisClient.flushAll();
        console.log("all cache deleted")
    } catch (error) {
        console.log("cache delete error", error)
    }
}