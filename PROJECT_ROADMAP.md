# 🏨 Hotel Booking Platform - Backend API

## Project Overview

A secure and scalable backend API for a hotel booking platform using Node.js, Express, MongoDB, and Redis. This project implements a complete authentication system, room management, search/filtering with caching, and secure booking functionality.

---

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Roadmap](#project-roadmap)
3. [Current Project Structure](#current-project-structure)
4. [Data Models](#data-models)
5. [API Endpoints](#api-endpoints)
6. [Setup Instructions](#setup-instructions)
7. [Feature Implementation Guide](#feature-implementation-guide)
8. [Security Best Practices](#security-best-practices)
9. [Deployment Guide](#deployment-guide)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Node.js + Express.js v5.1.0 |
| **Database** | MongoDB (Mongoose ODM v8.19.2) |
| **Authentication** | JWT (jsonwebtoken v9.0.2) |
| **Password Security** | bcryptjs v3.0.2 |
| **Caching** | Redis (redis v5.9.0) |
| **Environment Management** | dotenv v17.2.3 |
| **Development Tool** | Nodemon v3.1.10 |
| **Cookie Management** | cookie-parser v1.4.7 |

---

## 🗺️ Project Roadmap

### Phase 1: Core Infrastructure Setup ✅
- [x] Initialize Node.js project with Express
- [x] Configure MongoDB connection
- [x] Setup Redis client
- [x] Implement environment variables (.env)
- [x] Create basic project structure (MVC pattern)
- [x] Setup cookie parser and body parsers

### Phase 2: User Management Module ✅
- [x] Create User Model (name, email, password, isAdmin, role, age)
- [x] Implement User Registration with bcrypt password hashing
- [x] Implement User Login with JWT token generation
- [x] Create Authentication Middleware (authorized, authorizedAsAdmin)
- [x] Implement User Profile Endpoints (GET, UPDATE, DELETE)
- [x] Create Admin-only Routes for user management
- [x] Add Redis caching for user data
- [x] Implement Logout functionality with cookie clearing
x
### Phase 3: Hotel Room Management Module ⏳
- [x] Create Room Model with schema validation
  - hotelName, location, pricePerNight, available
  - description, images array
  - checkIn, checkOut dates
  - createdBy (reference to User)
- [ ] Create Room Controller with CRUD operations
- [ ] Create Room Routes for admin users
- [ ] Implement room listing and filtering
- [ ] Add image field validation
- [ ] Cache room listings in Redis

### Phase 4: Room Search & Filtering Module ⏳
- [ ] Implement search by location
- [ ] Implement filtering by price range
- [ ] Implement filtering by availability
- [ ] Implement date range filtering (checkIn/checkOut)
- [ ] Integrate Redis caching for search queries
- [ ] Create search optimization strategies
- [ ] Implement pagination for search results

### Phase 5: Booking System Module ⏳
- [ ] Create Booking Model with schema validation
  - user, room references
  - checkIn, checkOut dates
  - totalPrice calculation
  - status field
- [ ] Create Booking Controller with operations
- [ ] Implement booking validation
- [ ] Prevent overlapping bookings (date conflict detection)
- [ ] Implement automatic totalPrice calculation
- [ ] Create booking cancellation logic
- [ ] Implement booking status tracking

### Phase 6: Advanced Security & Validation ⏳
- [ ] Implement comprehensive input validation
- [ ] Create centralized error handling middleware
- [ ] Add request logging middleware
- [ ] Implement rate limiting
- [ ] Add CORS security configuration
- [ ] Sanitize database inputs
- [ ] Implement password strength validation

### Phase 7: Caching Optimization ⏳
- [ ] Implement cache invalidation strategies
- [ ] Cache room search results by parameters
- [ ] Cache user booking history
- [ ] Implement cache warmup strategies
- [ ] Create cache monitoring and analytics
- [ ] Optimize Redis key naming patterns

### Phase 8: Documentation & Testing ⏳
- [ ] Create comprehensive API documentation
- [ ] Generate Postman collection
- [ ] Create .env.example file
- [ ] Write unit tests for controllers
- [ ] Create integration tests
- [ ] Write API test cases

### Phase 9: Optional Enhancements ⏳
- [ ] Admin approval system for room listings
- [ ] Image upload with Multer/Cloudinary
- [ ] Refund and cancellation logic
- [ ] Advanced analytics dashboard
- [ ] Email notifications for bookings
- [ ] Payment gateway integration

### Phase 10: Deployment ⏳
- [ ] Dockerize the application
- [ ] Create docker-compose configuration
- [ ] Setup CI/CD pipeline
- [ ] Deploy to cloud (AWS/Heroku/DigitalOcean)
- [ ] Setup monitoring and logging

---

## 📁 Current Project Structure

```
hotel-booking-platform/
├── index.js                          # Main application entry point
├── package.json                      # Project dependencies
├── .env                             # Environment variables (create)
├── .env.example                     # Environment template (create)
├── .gitignore                       # Git ignore rules
│
├── db/
│   └── connectDb.js                # MongoDB connection logic
│
├── models/
│   ├── userModel.js                # ✅ User schema and methods
│   ├── roomModel.js                # ⏳ To be created
│   └── bookingModel.js             # ⏳ To be created
│
├── controllers/
│   ├── user.controller.js          # ✅ User management logic
│   ├── room.controller.js          # ⏳ To be created
│   ├── booking.controller.js       # ⏳ To be created
│   ├── utils/
│   │   ├── cacheManger.js          # ✅ Redis cache operations
│   │   ├── emailValidator.js       # ✅ Email validation utility
│   │   ├── hashPassword.js         # ✅ Password hashing utility
│   │   └── jwt.js                  # ✅ JWT token generation
│   └── admin/
│       └── adminController.js      # ✅ Admin-specific operations
│
├── middleware/
│   ├── authMIddleware.js           # ✅ Authentication & authorization
│   ├── errorHandler.js             # ⏳ To be created
│   ├── validation.js               # ⏳ To be created
│   └── logging.js                  # ⏳ To be created
│
├── routes/
│   ├── userRoute.js                # ✅ User endpoints
│   ├── roomRoute.js                # ⏳ To be created
│   └── bookingRoute.js             # ⏳ To be created
│
└── utils/
    ├── redis.js                    # ✅ Redis client setup
    ├── emailValidator.js           # ✅ Email validation
    ├── hashPassword.js             # ✅ Password hashing
    ├── jwt.js                      # ✅ JWT utilities
    └── constants.js                # ⏳ To be created (error codes, messages)
```

---

## 📊 Data Models

### 1. User Model

```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  name: String (required),          // Full name of user
  email: String (required, unique), // Email for login
  password: String (required),      // Hashed password using bcryptjs
  age: Number (required),           // User age
  role: String (default: "user"),   // "user" or "admin"
  isAdmin: Boolean (default: false), // Admin flag
  createdAt: Date (default: now),   // Auto-generated timestamp
  updatedAt: Date (default: now)    // Auto-updated timestamp
}
```

**Methods:**
- `comparePassword(enteredPassword)` - Verify password during login

---

### 2. Room Model (To Be Created)

```javascript
{
  _id: ObjectId,
  hotelName: String (required),
  location: String (required),
  pricePerNight: Number (required),
  available: Boolean (default: true),
  description: String,
  images: [String],                 // Array of image URLs
  checkIn: Date (required),          // Available check-in date
  checkOut: Date (required),         // Available check-out date
  createdBy: ObjectId (ref: User),   // Room owner/creator
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

### 3. Booking Model (To Be Created)

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),        // Who made the booking
  room: ObjectId (ref: Room),        // Which room was booked
  checkIn: Date (required),
  checkOut: Date (required),
  totalPrice: Number,                // Auto-calculated
  status: String (default: "booked"), // "booked", "cancelled", "completed"
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

## 🔌 API Endpoints

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|----|
| POST | `/api/users/register` | Register new user | ❌ No | Public |
| POST | `/api/users/login` | Login user | ❌ No | Public |
| POST | `/api/users/logout` | Logout user | ✅ Yes | User |
| GET | `/api/users/profile` | Get current user profile | ✅ Yes | User |
| PUT | `/api/users/profile` | Update current user profile | ✅ Yes | User |
| DELETE | `/api/users/profile` | Delete current user account | ✅ Yes | User |
| GET | `/api/users` | Get all users | ✅ Yes | Admin |
| GET | `/api/users/:id` | Get specific user | ✅ Yes | Admin |
| PUT | `/api/users/:id` | Update specific user | ✅ Yes | Admin |
| DELETE | `/api/users/:id` | Delete specific user | ✅ Yes | Admin |

### Room Management Endpoints (To Be Created)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|----|
| POST | `/api/rooms` | Create new room listing | ✅ Yes | Admin |
| GET | `/api/rooms` | Get all available rooms | ❌ No | Public |
| GET | `/api/rooms/:id` | Get specific room details | ❌ No | Public |
| PUT | `/api/rooms/:id` | Update room details | ✅ Yes | Admin/Owner |
| DELETE | `/api/rooms/:id` | Delete room listing | ✅ Yes | Admin/Owner |
| GET | `/api/rooms/search` | Search and filter rooms | ❌ No | Public |

**Query Parameters for Search:**
- `location` - Filter by city/location
- `priceMin` - Minimum price per night
- `priceMax` - Maximum price per night
- `checkIn` - Check-in date (YYYY-MM-DD)
- `checkOut` - Check-out date (YYYY-MM-DD)
- `page` - Pagination page number

### Booking Endpoints (To Be Created)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|----|
| POST | `/api/bookings` | Create new booking | ✅ Yes | User |
| GET | `/api/bookings` | Get user's bookings | ✅ Yes | User |
| GET | `/api/bookings/:id` | Get booking details | ✅ Yes | User/Admin |
| PUT | `/api/bookings/:id` | Update booking | ✅ Yes | User/Admin |
| DELETE | `/api/bookings/:id` | Cancel booking | ✅ Yes | User/Admin |
| GET | `/api/bookings/admin/all` | Get all bookings | ✅ Yes | Admin |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v14.x or higher
- MongoDB local/cloud instance
- Redis server running
- npm or pnpm package manager

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd hotel-booking-platform
```

### Step 2: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 3: Environment Configuration

Create `.env` file in root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/hotel-booking

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=7d

# Email Configuration (Optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Application Configuration
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### Step 4: Database Setup

#### MongoDB Setup

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your MongoDB Atlas connection string
```

#### Redis Setup

```bash
# Local Redis
redis-server

# Or use Redis Cloud
# Update REDIS_URL in .env with your Redis connection string
```

### Step 5: Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### Step 6: Verify Setup

Create a test request:

```bash
# Register a user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "age": 30
  }'

# Login user
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

---

## 🏗️ Feature Implementation Guide

### 1. Room Management Implementation

#### Create Room Model

**File:** `models/roomModel.js`

```javascript
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
  checkIn: {
    type: Date,
    required: [true, "Check-in date is required"]
  },
  checkOut: {
    type: Date,
    required: [true, "Check-out date is required"],
    validate: {
      validator: function(value) {
        return value > this.checkIn;
      },
      message: "Check-out date must be after check-in date"
    }
  },
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
```

#### Create Room Controller

**File:** `controllers/room.controller.js`

```javascript
import Room from "../models/roomModel.js";
import {
  setCache,
  getCache,
  deleteCache,
  deleteCacheByPattern
} from "./utils/cacheManger.js";

// Create new room listing
export const createRoom = async (req, res) => {
  try {
    const { hotelName, location, pricePerNight, description, images, checkIn, checkOut } = req.body;

    // Validate required fields
    if (!hotelName || !location || !pricePerNight || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const room = new Room({
      hotelName,
      location,
      pricePerNight,
      description,
      images,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      createdBy: req.user.userId
    });

    await room.save();
    
    // Clear cache for room listings
    await deleteCacheByPattern("rooms:*");

    res.status(201).json({
      message: "Room created successfully",
      room
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all available rooms with caching
export const getAllRooms = async (req, res) => {
  try {
    const cacheKey = "rooms:all:available";
    const cachedRooms = await getCache(cacheKey);

    if (cachedRooms) {
      return res.status(200).json({
        message: "All available rooms",
        rooms: cachedRooms,
        source: "cache"
      });
    }

    const rooms = await Room.find({ available: true })
      .populate("createdBy", "name email");

    await setCache(cacheKey, rooms, 3600); // Cache for 1 hour

    res.status(200).json({
      message: "All available rooms",
      rooms,
      source: "database"
    });
  } catch (error) {
    console.error("Get all rooms error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Search and filter rooms
export const searchRooms = async (req, res) => {
  try {
    const { location, priceMin, priceMax, checkIn, checkOut, page = 1 } = req.query;

    // Create cache key based on search parameters
    const cacheKey = `rooms:search:${location}:${priceMin}:${priceMax}:${checkIn}:${checkOut}:${page}`;
    const cachedResults = await getCache(cacheKey);

    if (cachedResults) {
      return res.status(200).json({
        message: "Search results",
        rooms: cachedResults,
        source: "cache"
      });
    }

    let query = { available: true };

    if (location) {
      query.location = new RegExp(location, "i"); // Case-insensitive search
    }

    if (priceMin || priceMax) {
      query.pricePerNight = {};
      if (priceMin) query.pricePerNight.$gte = Number(priceMin);
      if (priceMax) query.pricePerNight.$lte = Number(priceMax);
    }

    if (checkIn && checkOut) {
      query.checkIn = { $lte: new Date(checkIn) };
      query.checkOut = { $gte: new Date(checkOut) };
    }

    const pageNum = Math.max(1, Number(page));
    const limit = 10;
    const skip = (pageNum - 1) * limit;

    const rooms = await Room.find(query)
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit);

    const total = await Room.countDocuments(query);

    const results = {
      rooms,
      pagination: {
        page: pageNum,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    await setCache(cacheKey, results, 1800); // Cache for 30 minutes

    res.status(200).json({
      message: "Search results",
      ...results,
      source: "database"
    });
  } catch (error) {
    console.error("Search rooms error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `rooms:${id}`;

    const cachedRoom = await getCache(cacheKey);
    if (cachedRoom) {
      return res.status(200).json({
        message: "Room details",
        room: cachedRoom,
        source: "cache"
      });
    }

    const room = await Room.findById(id).populate("createdBy", "name email");

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    await setCache(cacheKey, room, 3600);

    res.status(200).json({
      message: "Room details",
      room,
      source: "database"
    });
  } catch (error) {
    console.error("Get room error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update room (admin/owner only)
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { hotelName, location, pricePerNight, description, images, available } = req.body;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check authorization
    if (room.createdBy.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized to update this room" });
    }

    // Update fields
    if (hotelName) room.hotelName = hotelName;
    if (location) room.location = location;
    if (pricePerNight) room.pricePerNight = pricePerNight;
    if (description) room.description = description;
    if (images) room.images = images;
    if (available !== undefined) room.available = available;
    room.updatedAt = new Date();

    await room.save();

    // Clear cache
    await deleteCache(`rooms:${id}`);
    await deleteCacheByPattern("rooms:*");

    res.status(200).json({
      message: "Room updated successfully",
      room
    });
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete room (admin/owner only)
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check authorization
    if (room.createdBy.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized to delete this room" });
    }

    await Room.findByIdAndDelete(id);

    // Clear cache
    await deleteCache(`rooms:${id}`);
    await deleteCacheByPattern("rooms:*");

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: error.message });
  }
};
```

#### Create Room Routes

**File:** `routes/roomRoute.js`

```javascript
import { Router } from "express";
import { authorized, authorizedAsAdmin } from "../middleware/authMIddleware.js";
import {
  createRoom,
  getAllRooms,
  searchRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} from "../controllers/room.controller.js";

const router = Router();

// Public routes
router.get("/", getAllRooms);
router.get("/search", searchRooms);
router.get("/:id", getRoomById);

// Admin/Authorized routes
router.post("/", authorized, authorizedAsAdmin, createRoom);
router.put("/:id", authorized, updateRoom);
router.delete("/:id", authorized, deleteRoom);

export default router;
```

---

### 2. Booking System Implementation

#### Create Booking Model

**File:** `models/bookingModel.js`

```javascript
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"]
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Room ID is required"]
  },
  checkIn: {
    type: Date,
    required: [true, "Check-in date is required"]
  },
  checkOut: {
    type: Date,
    required: [true, "Check-out date is required"],
    validate: {
      validator: function(value) {
        return value > this.checkIn;
      },
      message: "Check-out date must be after check-in date"
    }
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Price cannot be negative"]
  },
  status: {
    type: String,
    enum: ["booked", "cancelled", "completed"],
    default: "booked"
  },
  numberOfNights: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ room: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
```

#### Create Booking Controller

**File:** `controllers/booking.controller.js`

```javascript
import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";
import { getCache, setCache, deleteCache } from "./utils/cacheManger.js";

// Helper function to calculate number of nights
const calculateNights = (checkIn, checkOut) => {
  const check_in = new Date(checkIn);
  const check_out = new Date(checkOut);
  const timeDiff = check_out - check_in;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Helper function to check date conflicts
const checkDateConflict = async (roomId, checkIn, checkOut) => {
  const conflict = await Booking.findOne({
    room: roomId,
    status: "booked",
    $or: [
      { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
    ]
  });
  return conflict;
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get room details
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (!room.available) {
      return res.status(400).json({ error: "Room is not available" });
    }

    // Parse dates
    const check_in = new Date(checkIn);
    const check_out = new Date(checkOut);

    // Validate dates
    if (check_out <= check_in) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" });
    }

    if (check_in < new Date()) {
      return res.status(400).json({ error: "Check-in date cannot be in the past" });
    }

    // Check for date conflicts
    const conflict = await checkDateConflict(roomId, check_in, check_out);
    if (conflict) {
      return res.status(400).json({ 
        error: "Room is already booked for the selected dates",
        conflictDates: {
          checkIn: conflict.checkIn,
          checkOut: conflict.checkOut
        }
      });
    }

    // Calculate total price
    const nights = calculateNights(check_in, check_out);
    const totalPrice = nights * room.pricePerNight;

    // Create booking
    const booking = new Booking({
      user: userId,
      room: roomId,
      checkIn: check_in,
      checkOut: check_out,
      totalPrice,
      numberOfNights: nights
    });

    await booking.save();

    // Clear cache
    await deleteCache(`user:${userId}:bookings`);

    res.status(201).json({
      message: "Booking created successfully",
      booking: {
        ...booking.toObject(),
        room: {
          hotelName: room.hotelName,
          location: room.location,
          pricePerNight: room.pricePerNight
        }
      }
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = `user:${userId}:bookings`;

    const cachedBookings = await getCache(cacheKey);
    if (cachedBookings) {
      return res.status(200).json({
        message: "User bookings",
        bookings: cachedBookings,
        source: "cache"
      });
    }

    const bookings = await Booking.find({ user: userId })
      .populate("room", "hotelName location pricePerNight")
      .sort({ createdAt: -1 });

    await setCache(cacheKey, bookings, 3600);

    res.status(200).json({
      message: "User bookings",
      bookings,
      source: "database"
    });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await Booking.findById(id)
      .populate("room")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check authorization
    if (booking.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized to view this booking" });
    }

    res.status(200).json({
      message: "Booking details",
      booking
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check authorization
    if (booking.user.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    // Update status
    booking.status = "cancelled";
    booking.updatedAt = new Date();
    await booking.save();

    // Clear cache
    await deleteCache(`user:${userId}:bookings`);

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const cacheKey = "bookings:all";
    const cachedBookings = await getCache(cacheKey);

    if (cachedBookings) {
      return res.status(200).json({
        message: "All bookings",
        bookings: cachedBookings,
        source: "cache"
      });
    }

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("room", "hotelName location pricePerNight")
      .sort({ createdAt: -1 });

    await setCache(cacheKey, bookings, 1800);

    res.status(200).json({
      message: "All bookings",
      bookings,
      source: "database"
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ error: error.message });
  }
};
```

#### Create Booking Routes

**File:** `routes/bookingRoute.js`

```javascript
import { Router } from "express";
import { authorized, authorizedAsAdmin } from "../middleware/authMIddleware.js";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
} from "../controllers/booking.controller.js";

const router = Router();

// User routes
router.post("/", authorized, createBooking);
router.get("/user/my-bookings", authorized, getUserBookings);
router.get("/:id", authorized, getBookingById);
router.put("/:id/cancel", authorized, cancelBooking);

// Admin routes
router.get("/admin/all", authorized, authorizedAsAdmin, getAllBookings);

export default router;
```

---

### 3. Update Main Entry Point

**File:** `index.js`

```javascript
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoute.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import { connectDb } from "./db/connectDb.js";
import redisClient from './utils/redis.js'

// Connect to redis 
redisClient.connect();

dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const PORT = process.env.PORT || 5000;
connectDb();

// Routes
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    error: err.message || "Internal Server Error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## 🔒 Security Best Practices

### 1. Password Security
- ✅ Use bcryptjs for password hashing (already implemented)
- ✅ Hash password before saving to database
- ✅ Use strong salt rounds (minimum 10)
- ✅ Compare passwords using dedicated method

```javascript
// Example from userModel.js
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

### 2. JWT Token Security
- ✅ Use environment variable for JWT_SECRET
- ✅ Set appropriate expiration time
- ✅ Store tokens in HTTP-only cookies
- ✅ Verify token on every protected route

### 3. Input Validation
- ✅ Validate all incoming request data
- ✅ Use Mongoose schema validation
- ✅ Sanitize string inputs
- ✅ Check data types and lengths

```javascript
// Example validation
if (!hotelName || !location || !pricePerNight) {
  return res.status(400).json({ error: "Missing required fields" });
}
```

### 4. Authentication & Authorization
- ✅ Implement role-based access control
- ✅ Check authorization before operations
- ✅ Use middleware for route protection

```javascript
// Check authorization
if (room.createdBy.toString() !== req.user.userId && !req.user.isAdmin) {
  return res.status(403).json({ error: "Not authorized" });
}
```

### 5. Environment Variables
- ✅ Never commit .env file
- ✅ Create .env.example template
- ✅ Use strong secret keys
- ✅ Rotate secrets regularly

### 6. Database Security
- ✅ Use connection strings with authentication
- ✅ Validate ObjectIds before queries
- ✅ Use schema validation
- ✅ Index frequently queried fields

### 7. Error Handling
- ✅ Don't expose sensitive error details
- ✅ Log errors for debugging
- ✅ Return generic error messages to clients
- ✅ Use proper HTTP status codes

---

## 🐳 Deployment Guide

### Option 1: Deploy with Docker

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=${MONGO_URI}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
      - redis
    networks:
      - hotel-network

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - hotel-network

  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - hotel-network

volumes:
  mongodb_data:
  redis_data:

networks:
  hotel-network:
    driver: bridge
```

#### Run with Docker Compose

```bash
docker-compose up -d
```

### Option 2: Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set REDIS_URL=your_redis_url

# Deploy
git push heroku main
```

### Option 3: Deploy to AWS

1. Create EC2 instance
2. Install Node.js and dependencies
3. Setup MongoDB and Redis
4. Clone repository
5. Configure environment variables
6. Use PM2 for process management
7. Setup Nginx as reverse proxy
8. Enable SSL certificates

---

## 📚 Additional Resources

### Postman Collection Template

Save as `postman-collection.json`:

```json
{
  "info": {
    "name": "Hotel Booking Platform API",
    "description": "Complete API for hotel booking platform"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/users/register",
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"John\", \"email\": \"john@example.com\", \"password\": \"Pass123\", \"age\": 30}"
            }
          }
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/users/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"john@example.com\", \"password\": \"Pass123\"}"
            }
          }
        }
      ]
    }
  ]
}
```

### Error Code Reference

| Status | Code | Message | Solution |
|--------|------|---------|----------|
| 400 | BAD_REQUEST | Invalid input | Check request parameters |
| 401 | UNAUTHORIZED | Invalid/expired token | Re-login and get new token |
| 403 | FORBIDDEN | Not authorized | Check user role and permissions |
| 404 | NOT_FOUND | Resource not found | Verify resource ID |
| 500 | INTERNAL_ERROR | Server error | Check server logs |

---

## 📝 .env.example File

Create `.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/hotel-booking
MONGO_USER=admin
MONGO_PASSWORD=password

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your_super_secret_key_min_32_characters_long
JWT_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
SMTP_FROM=noreply@hotelplatform.com

# Cloudinary (Optional - for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🎯 Next Steps

1. **Immediate (Week 1)**
   - Create Room and Booking models
   - Implement room management controllers
   - Create and test room routes
   - Setup Redis caching for room searches

2. **Short-term (Week 2-3)**
   - Implement booking system
   - Add date conflict validation
   - Create booking routes
   - Test all endpoints with Postman

3. **Medium-term (Week 4)**
   - Add comprehensive error handling
   - Implement input validation middleware
   - Add request logging
   - Setup rate limiting

4. **Long-term (Week 5+)**
   - Implement admin approval system
   - Add image upload functionality
   - Implement email notifications
   - Setup CI/CD pipeline
   - Deploy to production

---

## 📞 Support & Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Ensure MongoDB is running
mongod

# Check connection string in .env
MONGO_URI=mongodb://localhost:27017/hotel-booking
```

**Redis Connection Error**
```bash
# Ensure Redis is running
redis-server

# Check Redis configuration
REDIS_URL=redis://localhost:6379
```

**JWT Token Issues**
- Clear browser cookies
- Re-login to get new token
- Check JWT_SECRET matches

---

## ✅ Checklist for Completion

- [ ] User Management (Registration, Login, Profile)
- [ ] Room Management (CRUD operations)
- [ ] Room Search & Filtering with Redis caching
- [ ] Booking System with date validation
- [ ] Error handling & validation
- [ ] Input sanitization
- [ ] Role-based access control
- [ ] Rate limiting
- [ ] Comprehensive API documentation
- [ ] Postman collection created
- [ ] .env.example file
- [ ] Docker setup
- [ ] Unit tests
- [ ] Integration tests
- [ ] Production deployment

---

## 📄 License

MIT License - Feel free to use this project for learning and commercial purposes.

---

**Last Updated:** November 10, 2025
**Version:** 1.0.0
**Status:** In Development ⏳

