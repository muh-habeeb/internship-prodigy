
//for admin to update user by id
export const updateUserById = async (req, res) => {
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


    await deleteCacheByPattern(`users:*`); //delete cache after update


    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//for admin to delete user by id
export const deleteUserById = async (req, res) => {
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
