import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: [true, "Hotel name is required"],
    trim: true
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    lowercase: true,
    trim: true
  },
  pricePerNight: {
    type: Number,
    required: [true, "Price per night is required"],
    min: [0, "Price cannot be negative"]
  },
  available: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  images: [{
    type: String,
    validate: {
      validator: (url) => /^https?:\/\/.+/.test(url),
      message: "Invalid image URL"
    }
  }],
  // checkIn: {
  //   type: Date,
  //   required: [true, "Check-in date is required"]
  // },
  // checkOut: {
  //   type: Date,
  //   required: [true, "Check-out date is required"],
  //   validate: {
  //     validator: function(value) {
  //       return value > this.checkIn;
  //     },
  //     message: "Check-out date must be after check-in date"
  //   }
  // },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search optimization
roomSchema.index({ location: 1, pricePerNight: 1 });

const Room = mongoose.model("Room", roomSchema);
export default Room;