# Redis Caching Integration Roadmap

## Table of Contents
1. [Overview](#overview)
2. [Roadmap](#roadmap)
3. [Setup Instructions](#setup-instructions)
4. [How Redis Caching Works](#how-redis-caching-works)
5. [Implementation Strategy](#implementation-strategy)
6. [Where to Cache in Your Application](#where-to-cache)
7. [Code Examples](#code-examples)

---

## Overview

Redis is an in-memory data store used for caching to dramatically improve application performance by:
- **Reducing database queries** - Store frequently accessed data in memory
- **Faster response times** - In-memory access is faster than database queries
- **Reducing server load** - Less database strain
- **Session management** - Store user sessions


## Roadmap

### Phase 1: Setup & Configuration
- [ ] Install Redis server locally or use cloud Redis
- [ ] Install `redis` Node.js package
- [ ] Create Redis connection module
- [ ] Configure environment variables
- [ ] Create cache utility functions

### Phase 2: Core Caching Implementation
- [ ] Implement cache middleware
- [ ] Create cache key generator
- [ ] Add cache invalidation strategy
- [ ] Create cache manager utility

### Phase 3: Apply Caching to Endpoints
- [ ] Cache `getAllUsers` endpoint
- [ ] Cache `getUser` endpoint
- [ ] Cache `getUserProfile` endpoint
- [ ] Add cache invalidation on data update/delete

### Phase 4: Testing & Optimization
- [ ] Monitor cache hit/miss rates
- [ ] Optimize cache expiry times
- [ ] Test with load testing
- [ ] Document cache strategy

---

## Setup Instructions

### Step 1: Install Redis

#### Option A: Local Redis (Windows)
```bash
# Using Windows Subsystem for Linux (WSL)
wsl
sudo apt-get install redis-server
redis-server

# OR using Chocolatey
choco install redis
redis-server
```

#### Option B: Docker
```bash
docker run -d -p 6379:6379 redis:latest
```

#### Option C: Cloud Redis
- Use Redis Cloud: https://redis.com/try-free/
- Or Docker Hub: Redis image

### Step 2: Install Redis Node.js Package

```bash
pnpm add redis
```

### Step 3: Update package.json
Your dependencies will now include:
```json
{
  "dependencies": {
    "redis": "^4.x.x"
  }
}
```

### Step 4: Create Redis Connection Module

Create a new file: `db/redis.js`

```javascript
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

export default redisClient;
```

### Step 5: Initialize Redis in index.js

```javascript
import redisClient from './db/redis.js';

// Connect Redis after app setup
await redisClient.connect();
```

### Step 6: Create Cache Utility Functions

Create: `controller/utils/cacheManager.js`

```javascript
import redisClient from '../../db/redis.js';

// Set cache with expiration (in seconds)
export const setCache = async (key, value, expirySeconds = 3600) => {
  try {
    await redisClient.setEx(key, expirySeconds, JSON.stringify(value));
    console.log(`Cache SET: ${key}`);
  } catch (error) {
    console.error('Cache SET Error:', error);
  }
};

// Get cache
export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    if (data) {
      console.log(`Cache HIT: ${key}`);
      return JSON.parse(data);
    }
    console.log(`Cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.error('Cache GET Error:', error);
    return null;
  }
};

// Delete specific cache key
export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
    console.log(`Cache DELETED: ${key}`);
  } catch (error) {
    console.error('Cache DELETE Error:', error);
  }
};

// Delete multiple cache keys (pattern matching)
export const deleteCachePattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cache DELETED (${keys.length} keys): ${pattern}`);
    }
  } catch (error) {
    console.error('Cache DELETE Pattern Error:', error);
  }
};

// Clear all cache
export const clearAllCache = async () => {
  try {
    await redisClient.flushDb();
    console.log('All Cache CLEARED');
  } catch (error) {
    console.error('Clear All Cache Error:', error);
  }
};
```

### Step 7: Add Environment Variables

Create/Update `.env`:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## How Redis Caching Works

### Architecture Diagram
```
Client Request
    ↓
Express Route Handler
    ↓
Check Redis Cache
    ├─ Cache HIT → Return cached data (Fast ⚡)
    └─ Cache MISS ↓
        ↓
    Query MongoDB
    ↓
    Process Data
    ↓
    Store in Redis Cache (with expiry)
    ↓
    Return to Client
```

### Key Concepts

#### 1. Cache Keys
- Unique identifier for cached data
- Format: `resource:id` (e.g., `user:123`, `users:all`)
- Should include all query parameters

#### 2. Cache Expiry (TTL - Time To Live)
- Data automatically deleted after expiration
- Common expiry times:
  - User data: 1 hour (3600 seconds)
  - Lists: 30 minutes (1800 seconds)
  - Authentication tokens: 15 minutes (900 seconds)

#### 3. Cache Invalidation
- Remove cache when data changes
- Prevent stale data issues
- Invalidate on CREATE, UPDATE, DELETE operations

#### 4. Cache-Aside Pattern (Most Common)
```
1. Check cache first
2. If hit → return cached data
3. If miss → query database
4. Store result in cache
5. Return to client
```

---

## Implementation Strategy

### Cache Strategy for Your Application

```
User Data Cache:
├── getAllUsers (list all users)
│   ├── Key: "users:all"
│   ├── Expiry: 1800 seconds (30 min)
│   └── Invalidate on: CREATE, UPDATE, DELETE user
│
├── getUser (single user by ID)
│   ├── Key: "user:{userId}"
│   ├── Expiry: 3600 seconds (1 hour)
│   └── Invalidate on: UPDATE user, DELETE user
│
└── getUserProfile (with relationships)
    ├── Key: "user:profile:{userId}"
    ├── Expiry: 1800 seconds (30 min)
    └── Invalidate on: UPDATE user profile
```

---

## Where to Cache in Your Application

### 1. **READ Operations (Primary Caching Target)**

#### a. `getAllUsers` - Get All Users
- **Current**: Queries all users from database every time
- **With Cache**: Return cached list if available
- **Cache Key**: `users:all`
- **Expiry**: 30 minutes (1800 seconds)
- **Benefit**: Very frequent endpoint, many users means slower queries

#### b. `getUser` - Get Single User by ID
- **Current**: Database query for each request
- **With Cache**: Check cache first before querying
- **Cache Key**: `user:{userId}`
- **Expiry**: 1 hour (3600 seconds)
- **Benefit**: User profile accessed multiple times

#### c. Additional Caching Opportunities
- **Search users** - Cache search results with query as key
- **User authentication** - Cache user session data
- **JWT tokens** - Cache token validation

### 2. **WRITE Operations (Cache Invalidation)**

When data is modified, invalidate related cache:

#### a. `createUser`
- **Action**: Clear cache for `users:all`
- **Why**: New user should appear in list

#### b. `updateUser`
- **Action**: Clear `user:{userId}` and `users:all`
- **Why**: Individual user data changed AND list is affected

#### c. `deleteUser`
- **Action**: Clear `user:{userId}` and `users:all`
- **Why**: User removed from database AND list

### 3. **Authentication & Session Caching**

- **Store user sessions** - Cache login info
- **Token verification** - Cache JWT validation results
- **User permissions** - Cache user roles/permissions

---

## Code Examples

### Example 1: Cache getAllUsers

**Before (Without Cache):**
```javascript
export const getAllUsers = async (req, res) => {
  const users = await User.find({}); // Database query every time
  if (users.length === 0) {
    return res.status(404).json({ error: "No users found" });
  }
  res.status(200).json({
    message: "All users Data",
    users,
  });
};
```

**After (With Cache):**
```javascript
import { getCache, setCache, deleteCachePattern } from './utils/cacheManager.js';

export const getAllUsers = async (req, res) => {
  const cacheKey = 'users:all';
  
  try {
    // Step 1: Check cache first
    const cachedUsers = await getCache(cacheKey);
    if (cachedUsers) {
      return res.status(200).json({
        message: "All users Data (from cache)",
        users: cachedUsers,
        source: "cache"
      });
    }
    
    // Step 2: Query database if cache miss
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    
    // Step 3: Store in cache (30 minutes expiry)
    await setCache(cacheKey, users, 1800);
    
    // Step 4: Return to client
    res.status(200).json({
      message: "All users Data",
      users,
      source: "database"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

### Example 2: Cache getUser (Single User)

```javascript
export const getUser = async (req, res) => {
  const userId = req.params.id;
  
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json("Invalid user ID");
  }
  
  const cacheKey = `user:${userId}`;
  
  try {
    // Check cache first
    const cachedUser = await getCache(cacheKey);
    if (cachedUser) {
      return res.status(200).json({
        ...cachedUser,
        source: "cache"
      });
    }
    
    // Database query on cache miss
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    // Store in cache (1 hour expiry)
    await setCache(cacheKey, user, 3600);
    
    res.status(200).json({
      ...user._doc,
      source: "database"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

### Example 3: Invalidate Cache on Update

```javascript
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, age } = req.body;
  
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, age },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Invalidate related caches
    await deleteCache(`user:${userId}`);           // Clear individual user cache
    await deleteCachePattern('users:*');           // Clear all user list caches
    
    res.status(200).json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

### Example 4: Cache Middleware (Optional)

Create: `middleware/cacheMiddleware.js`

```javascript
import { getCache } from '../controller/utils/cacheManager.js';

export const cacheMiddleware = (cacheKeyGenerator) => {
  return async (req, res, next) => {
    const cacheKey = cacheKeyGenerator(req);
    
    try {
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        res.locals.cached = true;
        res.locals.cachedData = cachedData;
        return res.status(200).json({
          data: cachedData,
          source: "cache"
        });
      }
    } catch (error) {
      console.error('Middleware cache error:', error);
    }
    
    next();
  };
};
```

---

## Performance Improvements Expected

| Operation | Without Cache | With Cache | Improvement |
|-----------|---------------|-----------|------------|
| Get All Users | 100-500ms (DB query) | 2-10ms (Redis) | **10-50x faster** |
| Get Single User | 50-200ms (DB query) | 1-5ms (Redis) | **10-50x faster** |
| Response Time | Database dependent | ~2-5ms avg | **Significantly reduced** |
| Database Load | High (every request) | Low (cache hits) | **50-80% reduction** |
| Server CPU | High | Low | **Better performance** |

---

## Best Practices

1. **Use consistent cache key naming** - `resource:id` format
2. **Set appropriate TTL** - Balance freshness vs. performance
3. **Handle cache misses gracefully** - Fall back to database
4. **Invalidate intelligently** - Don't clear too much cache
5. **Monitor cache hit rates** - Aim for 70%+ hit rate
6. **Log cache operations** - Debug and optimize
7. **Handle Redis connection failures** - Graceful degradation
8. **Use cache for read-heavy endpoints** - Not write-heavy
9. **Avoid caching large objects** - Memory efficiency
10. **Test thoroughly** - Ensure data consistency

---

## Troubleshooting

### Redis Connection Issues
```javascript
// Add error handling to Redis client
redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
  // Fall back to database queries
});
```

### Cache Inconsistency
- Ensure all write operations invalidate cache
- Use cache key patterns consistently
- Monitor cache vs. database data sync

### Memory Issues
- Set appropriate TTL values
- Use pattern deletion for related keys
- Monitor Redis memory usage

---

## Next Steps

1. Install Redis locally or use cloud service
2. Install `redis` npm package
3. Create Redis connection module (`db/redis.js`)
4. Create cache utilities (`controller/utils/cacheManager.js`)
5. Update `getAllUsers` and `getUser` endpoints
6. Add cache invalidation to update/delete operations
7. Test cache functionality
8. Monitor performance improvements
9. Optimize TTL values based on your needs
10. Document cache strategy in your team

---

## Additional Resources

- [Redis Official Documentation](https://redis.io/docs/)
- [Node.js Redis Client](https://github.com/luin/ioredis)
- [Redis Caching Patterns](https://redis.io/docs/manual/patterns/)
- [Cache Invalidation Strategies](https://en.wikipedia.org/wiki/Cache_(computing)#Invalidation)

