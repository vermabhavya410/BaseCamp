import jwt from "jsonwebtoken";
import  User  from "../models/user.modal.js";

export const verifyJwt = async (req, res, next) => {
  try {
    // Step 1: Get token from cookies
    const token = req.cookies?.accessToken;

    // WHY: If no token → user not logged in
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Step 2: Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded JWT:", decoded); // Debugging line to check decoded token contents
   
    // WHY: Extract user ID from token
    const user = await User.findById(decoded._id).select("-password");
    

    // Step 3: Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Step 4: Attach user to request
    req.user = user;

    // Step 5: Move to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};