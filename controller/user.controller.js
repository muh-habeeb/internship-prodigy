import isValidEmail from "./utils/emailValidator.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { setToken } from "./utils/jwt.js";
import { hashPasswordUsingBcrypt } from "./utils/hashPassword.js";

/**
|--------------------------------------------------
| function to get the user data by uuid
|--------------------------------------------------
*/

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  if (users.length === 0) {
    return res.status(404).json({ error: "No users found" });
  }
  res.status(200).json({
    message: "All users Data",
    users,
  });
};
export const getUser = async (req, res) => {
  const userId = req.params.id; //get the user id from request params
  //check if userId is valid Id
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json("Invalid user ID");
  }
  //search for user by uuid
  try {
    const user = await User.findById(userId);
    //if user not found
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
|--------------------------------------------------
| function to create new userData
|--------------------------------------------------
*/

export const createUser = async (req, res) => {
  //get the data from body
  await User.syncIndexes(); // remove mongo indexes for email checks

  const { name, email, password, age } = req.body;
  if (!name || !email || !password || !age) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // validate email format
  if (isValidEmail(email) === false) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  //check for user existence
  if (await User.findOne({ email })) {
    return res.status(400).json({ error: "User with this email already exists" });
  }
  //password hashing done in models
  try {
    const hashedPassword = await hashPasswordUsingBcrypt(password);
    const user = await User.create({ name, email, password: hashedPassword, age });
    res.status(201).json({
      message: "User created successfully",
      user: user._doc,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
|--------------------------------------------------
| function for login
|--------------------------------------------------
*/

export const loginUser = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  email = email.toLowerCase();
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "invalid email or password " });
    }
    setToken(res, { userId: user._id, isAdmin: user.isAdmin, role: user.role });
    let ms = user.isAdmin ? "Admin user logged in" : "Regular user logged in";
    res.status(200).json({
      message: "Login successful",
      info: ms,
      userid: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};
/**
|--------------------------------------------------
| function to update user data
|--------------------------------------------------
*/
export const updateUser = async (req, res) => {
  const userId = req.params.id; //get the user id from request params
  //check for it valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  ///destructure the body
  const { name, email, password, age } = req.body;

  // validate email if provided
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only provided fields
    if (name) existingUser.name = name;
    if (email) existingUser.email = email;
    if (password) {
      existingUser.password = await hashPasswordUsingBcrypt(password);
    }
    if (age !== undefined) {
      existingUser.age = parseInt(age);
    }

    // Save changes
    const updatedUser = await existingUser.save();

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
|--------------------------------------------------
    function for logOut
|--------------------------------------------------
*/

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}

/**
|--------------------------------------------------
| function to delete a user 
|--------------------------------------------------
*/

export const deleteUser = async (req, res) => {
  //get the userId from req params
  const userId = req.params.id;
  //check if userId is valid number
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  //search for the user by uuid
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
