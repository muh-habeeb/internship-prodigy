import { Router } from "express"
import { authorized, authorizedAsAdmin, } from "../middleware/authMIddleware.js";
import { cancelBooking, createBooking, getAllBookings, getBookingById, getUserBookings } from "../controller/booking/booking.controller.js";

const router = Router();

// Admin routes
router.get("/all", authorized, authorizedAsAdmin, getAllBookings);

// User routes
router.post("/", authorized, createBooking);
router.get("/my-bookings", authorized, getUserBookings);
router.get("/:id", authorized, getBookingById);
router.put("/:id/cancel", authorized, cancelBooking);


export default router;
