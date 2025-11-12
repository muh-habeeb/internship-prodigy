import { Router } from "express"
import { authorized, authorizedAsUser } from "../middleware/authMIddleware.js";
import { cancelBooking, createBooking, getAllBookings, getBookingById, getUserBookings } from "../controller/booking/booking.controller.js";

const router = Router();

// User routes
router.post("/", authorized, createBooking);
router.get("/my-bookings", authorized, getUserBookings);
router.get("/:id", authorized, getBookingById);
router.put("/:id/cancel", authorized, cancelBooking);

// Admin routes
router.get("/admin/all", authorized, authorizedAsAdmin, getAllBookings);

export default router;
