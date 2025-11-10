import jwt from "jsonwebtoken";

export const authorized = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    //  No token provided
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided.",
      });
    }
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // token invalid or expired
      return res.status(401).json({
        message: "Unauthorized: Invalid or expired token.",
      });
    }
    // Attach decoded payload to request for later use
    req.user = decoded;
    // move to next middleware/controller
    next();
  } catch (error) {
    console.error("Internal server error during auth:", error);
    return res.status(500).json({
      message: "Internal Server Error in token verification.",
    });
  }
};

//check for admin function
export const authorizedAsAdmin = (req, res, next) => {
  //check if user is admin by all the properties in payload
  if (req.user.userId && req.user.isAdmin && req.user.role === "admin") {
    next();
  } else {
    return res.status(401).json({
      message: "Not authorized as admin",
    });
  }
};
