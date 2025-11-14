# 🏨 Hotel Booking Platform - Backend API

## Project Overview

A secure and scalable backend API for a hotel booking platform using Node.js, Express, MongoDB, and Redis. This project implements a complete authentication system, room management, search/filtering with caching, and secure booking functionality.

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

### Room Management Endpoints 

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

### Booking Endpoints 

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|----|
| POST | `/api/bookings` | Create new booking | ✅ Yes | User |
| GET | `/api/bookings` | Get user's bookings | ✅ Yes | User |
| GET | `/api/bookings/:id` | Get booking details | ✅ Yes | User/Admin |
| PUT | `/api/bookings/:id` | Update booking | ✅ Yes | User/Admin |
| DELETE | `/api/bookings/:id` | Cancel booking | ✅ Yes | User/Admin |
| GET | `/api/bookings/all` | Get all bookings | ✅ Yes | Admin |

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


## 📄 License

MIT License - Feel free to use this project for learning and commercial purposes.

---

**Last Updated:** November 10, 2025
**Version:** 1.0.0
**Status:** In Development ⏳


