import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id is required"],
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: [true, "Room id is required"],
    },
    checkIn: {
        type: Date,
        required: [true, "check in is required"],
    },
    checkOut: {
        type: Date,
        required: [true, "check out is required"],
        validate: {
            validator: function (val) {
                return val > this.checkIn;
            },
            message: "checkout Date must be after check in date ",
        },
    },
    totalPrice: {
        type: Number,
        required: [true, "total price is required"],
        min: [0, "Price cannot be negative"],
    },
    status: {
        type: String,
        enum: ["booked", "cancelled", "completed"],
        default: "booked",
    },
    numberOfNights: Number,
    cratedAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

//indexing for faster queries
bookingSchema.index({ user: 1, status: 1 })
bookingSchema.index({ room: 1, status: 1 })

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;