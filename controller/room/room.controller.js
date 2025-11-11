import Room from "../../models/roomModel.js";
import mongoose from "mongoose";
import {
    setCache,
    getCache,
    deleteCache,
    deleteCacheByPattern,
} from "../utils/cacheManger.js";
import chalk from "chalk";


const clError = (err) => {
    console.log(chalk.bgRed(chalk.white(err)));
};
const successful = (val) => {
    console.log(chalk.bgCyan(chalk.black(val)));
}

export const createRoom = async (req, res) => {
    // if (!req.body === undefined) {
    try {
        const { hotelName, location, pricePerNight, description, images } =
            req.body;
        //validate required fields
        if (!hotelName || !location || !pricePerNight || !images || !images.length > 0) {
            return res
                .status(400)
                .json({
                    error: "Hotel name, location, price per night, and images are required",
                });
        }
        const room = new Room({
            hotelName,
            location,
            pricePerNight,
            description,
            images,
            createdBy: req.user.userId, //from auth middleware
        });
        await room.save();
        await deleteCacheByPattern("rooms:*"); //clear relevant caches
        successful("room created ok");
        res.status(201).json({
            message: "Room created successfully",
            room,
        });
        //clear relevant caches
    } catch (error) {
        clError(error);
        res.status(500).json({ error: "Internal server error" });
    }
    // }
    // else{
    //     return res.status(400).json({ error: "Request body is missing" });
    // }
};

export const getAllRooms = async (req, res) => {
    res.send("ok");
};

export const getRoomById = async (req, res) => {
    res.send("ok");
};

export const updateRoomById = async (req, res) => {
    res.send("ok");
};
export const deleteRoomById = async (req, res) => {
    res.send("ok");
};
export const searchRooms = async (req, res) => {
    res.send("ok");
};
