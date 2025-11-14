import mongoose from "mongoose";
import Booking from "../../models/bookingModel.js";
import { checkDateConflict } from "./helper/dateConflict.js";
import { calculateNights } from "./helper/calculateNights.js";
import Room from "../../models/roomModel.js";
import chalk from "chalk";
import { setCache,getCache,deleteCache } from "../utils/cacheManger.js";


//custom error and success function
const ErrorMsg = (...err) => {
    console.log(chalk.bgRed(chalk.white(err)));
};
const SuccessMsg = (...val) => {
    console.log(chalk.bgCyan(chalk.black(val)));
};
//////////////


export const createBooking = async (req, res) => {
    try {
        const { roomId, checkIn, checkOut } = req.body;
        const userId = req.user.userId;
        //validate required fields
        if (!roomId || !checkIn || !checkOut) {
            return res.status(400).json({
                error: "Room ID, check-in date, and check-out date are required",
            });
        }
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        if (!room.available) {
            return res
                .status(400)
                .json({ error: "Room is not available for booking" });
        }
        //parse dates
        const check_in = new Date(checkIn);
        const check_out = new Date(checkOut);

        //validate dates
        // if (check_in < new Date()) {
        //     return res
        //         .status(400)
        //         .json({ error: "Check-in date cannot be in the past" });
        // }
        if (check_out <= check_in) {
            return res
                .status(400)
                .json({ error: "Check-out date must be after check-in date" });
        }

        const conflict = await checkDateConflict(roomId, check_in, check_out);
        if (conflict) {
            return res.status(400).json({
                error: "The room is already booked for the selected dates",
                conflictDates: {
                    checkIn: conflict.checkIn,
                    checkOut: conflict.checkOut,
                },
            });
        }

        const nights = calculateNights(check_in, check_out);
        const totalPrice = nights * room.pricePerNight;
        const booking = new Booking({
            user: userId,
            room: roomId,
            checkIn: check_in,
            checkOut: check_out,
            totalPrice,
            numberOfNights: nights,
        });

        await booking.save();
        await deleteCache(`user:${userId}:bookings`); //clear relevant caches

        return res.status(201).json({
            message: "Booking created successfully",
            booking: {
                ...booking.toObject(),
                roomDetails: {
                    hotelName: room.hotelName,
                    location: room.location,
                    pricePerNight: room.pricePerNight,
                },
            },
        });
    } catch (error) {
        ErrorMsg(`error occurred in createBooking: ${error}`);
        console.log(error)
        return res
            .status(500)
            .json({ message: "internal server error ", error: error.message });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cacheKey = `user:${userId}:bookings`;
        const cachedBookings = await getCache(cacheKey);
        if (cachedBookings) {
            SuccessMsg("bookings fetched from cache");
            return res.status(200).json({
                message: "User bookings fetched successfully",
                bookings: cachedBookings,
                source: "cache",
            });
        }
        const bookings = await Booking.find({ user: userId })
            .populate("room", "hotelName location pricePerNight")
            .sort({ createdAt: -1 });

        await setCache(cacheKey, bookings, 1800); //cache for 1 hour

        res.status(200).json({
            message: "user Bookings",
            bookings,
            source: "database",
        });
    } catch (error) {
        ErrorMsg(`error occurred in getUserBookings: ${error}`);
        return res
            .status(500)
            .json({ message: "internal server error ", error: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid booking ID" });
        }
        const userId = req.user.userId;
        const booking = await Booking.findById(id)
            .populate("room")
            .populate("user", "name email");
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        //check authorization
        if (booking.user._id.toString() !== userId) {
            return res
                .status(403)
                .json({ error: "Access denied. This booking does not belong to you." });
        }


        res.status(200).json({
            message: "Booking details",
            booking,
        });
    } catch (error) {
        ErrorMsg(`error occurred in getBookingById: ${error}`);
        return res
            .status(500)
            .json({ message: "internal server error ", error: error.message });
    }
};


export const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ error: "Invalid booking ID" });
        }
        const userId = req.user.userId;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }


        //check authorization
        if (booking.user.toString() !== userId) {
            return res
                .status(403)
                .json({ error: "Access denied. This booking does not belong to you." });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({ error: "Booking is already cancelled." });
        }
        booking.status = "cancelled";
        booking.updatedAt = Date.now();
        await booking.save();
        //clearing cache
        await deleteCache(`user:${userId}:bookings`); //clear relevant caches

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking,
        });

    } catch (error) {
        ErrorMsg("error occurred in cancelBooking:", error);
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }

}

export const getAllBookings = async (req, res) => {
    try {

        const cacheKey = `bookings:all`;
        const cachedBookings = await getCache(cacheKey);
        if (cachedBookings) {
            SuccessMsg("all bookings fetched from cache");
            return res.status(200).json({
                message: "All bookings fetched successfully",
                bookings: cachedBookings,
                source: "cache",
            });
        }
        const bookings = await Booking.find()
            .populate("room", "hotelName location pricePerNight")
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        await setCache(cacheKey, bookings, 1800); //cache for 1 hour

        res.status(200).json({
            message: "All bookings fetched successfully",
            bookings,
            source: "database",
        });
    } catch (error) {
        ErrorMsg("error occurred in getAllBookings:", error);
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }

}