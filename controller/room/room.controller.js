import Room from "../../models/roomModel.js";
import mongoose, { mongo } from "mongoose";
import {
    setCache,
    getCache,
    deleteCache,
    deleteCacheByPattern,
} from "../utils/cacheManger.js";
import chalk from "chalk";

//custom error and success function

const ErrorMsg = (...err) => {
    console.log(chalk.bgRed(chalk.white(err)));
};
const SuccessMsg = (...val) => {
    console.log(chalk.bgCyan(chalk.black(val)));
};
//////////////


export const createRoom = async (req, res) => {
        try {
            const { hotelName, location, pricePerNight, description, images } =
                req.body;
            //validate required fields
            if (
                !hotelName ||
                !location ||
                !pricePerNight ||
                !images ||
                !images.length > 0
            ) {
                return res.status(400).json({
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
            SuccessMsg("room created ok");
            res.status(201).json({
                message: "Room created successfully",
                room,
            });
            //clear relevant caches
        } catch (error) {
            ErrorMsg(`error occurred in createRoom: ${error}`);
            return res.status(500).json({ message: "internal server error ", error: error.message });
        }
};

/**
|--------------------------------------------------
|  get all available rooms
|--------------------------------------------------
*/
export const getAvailableRooms = async (req, res) => {
    try {
        const cacheKey = "rooms:all:available";
        const cachedRooms = await getCache(cacheKey);
        if (cachedRooms) {
            SuccessMsg("rooms fetched from cache");
            return res.status(200).json({
                message: "All rooms available",
                rooms: cachedRooms,
                source: "cache",
            });
        } else {
            const rooms = await Room.find({ available: true }).populate(
                "createdBy",
                "name email"
            );
            await setCache(cacheKey, rooms, 3600); //cache for 1 hour
            return res.status(200).json({
                message: "All rooms available",
                rooms,
                source: "database",
            });
        }
    } catch (error) {
        ErrorMsg(`error occurred in getAllRooms: ${error}`);
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
};

export const getRoomById = async (req, res) => {
    const roomId = req.params.id;
    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({
            error: "invalid room id or no id found",
        });
    }
    try {
        const cacheKey = `rooms:${roomId}`;
        const cachedRoom = await getCache(cacheKey);
        if (cachedRoom) {
            return res.status(200).json({
                message: "Room details",
                cachedRoom,
                source: "cache",
            });
        }
        const room = await Room.findById(roomId).populate(
            "createdBy",
            "name email"
        );
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        await setCache(cacheKey, room, 3600); //cache for 1 hour
        return res.status(200).json({
            message: "Room details",
            room,
            source: "database",
        });
    } catch (error) {
        ErrorMsg("error occurred in getRoomById:", error);
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
};
/**
|--------------------------------------------------
| update room data function
|--------------------------------------------------
*/
export const updateRoomById = async (req, res) => {
    const roomId = req.params.id;
    //check the id is present
    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({
            error: "invalid room id or no id found",
        });
    }

    try {
        //get the fields to be updated and check for missing body
        const {
            hotelName,
            pricePerNight,
            description,
            images,
            available,
            location,
        } = req.body;
        if (
            !hotelName &&
            !pricePerNight &&
            !description &&
            !images &&
            available === undefined &&
            !location
        ) {
            return res
                .status(400)
                .json({ error: "At least one field must be provided for update" });
        }
        //check if room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        const updates = { hotelName, location, pricePerNight, description, images, available };

        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: { ...updates, updatedAt: new Date() } },
            { new: true, runValidators: true }
        );
        //clear relevant caches
        await deleteCache(`rooms:${roomId}`); //clear relevant caches
        await deleteCacheByPattern("rooms:all*"); //clear relevant caches
        SuccessMsg("room updated successfully");
        //send response
        res.status(200).json({
            message: "Room updated successfully",
            room: updatedRoom,
        });


    } catch (error) {
        ErrorMsg("error occurred in update room by id:", error);
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
};



export const deleteRoomById = async (req, res) => {
    const roomId = req.params.id;
    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({
            error: "invalid id or no id found"
        })
    }
    try {
        const room = await Room.findByIdAndDelete(roomId);
        if (!room) {
            return res.status(404).json({
                error: "room not found"
            })
        }
        //delete the room 
        await room.findByIdAndDelete(roomId);

        // clear caches 
        await deleteCache(`rooms:${roomId}`);
        await deleteCacheByPattern("rooms:*");

        return res.status(200).json({
            message: "room deleted successfully"
        })

    } catch (error) {
        ErrorMsg("error in delete room ", error)
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }

};
export const searchRooms = async (req, res) => {
    try {
        //get the data from query params 
        const { location, minPrice, maxPrice, checkIn, checkOut, page = 1 } = req.query;

        // await deleteCacheByPattern("rooms:search:*");
        const cacheKey = `rooms:search:${location}:${minPrice}:${maxPrice}:${checkIn}:${checkOut}:${page}`
        const cacheResult = await getCache(cacheKey)

        if (cacheResult) {
            return res.status(200).json({
                message: "search result",
                rooms: cacheResult,
                source: "cache"
            })
        }


        let query = { available: true }

        if (location) {
            query.location = new RegExp(location, "i")// case insensitive search

        }
        if (minPrice || maxPrice) {
            query.pricePerNight = {};
            if (minPrice) query.pricePerNight.$gte = Number(minPrice)
            if (maxPrice) query.pricePerNight.$lte = Number(maxPrice)
        }

        if (checkIn || checkOut) {
            query.checkIn = { $lte: new Date(checkIn) }
            query.checkOut = { $gte: new Date(checkOut) }
        }

        const pageNum = Math.max(1, Number(page))
        const limit = 10;
        const skip = (pageNum - 1) * limit;

        const rooms = await Room.find(query).populate("createdBy", "name email").skip(skip).limit(limit)

        const total = await Room.countDocuments(query);

        const result = {
            rooms,
            pagination: {
                page: pageNum,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
        await setCache(cacheKey, result, 900)

        return res.status(200).json({
            message: "search result",
            ...result,
            source: "database"
        })

    } catch (error) {
        ErrorMsg("error occurred in search", error);
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
};
