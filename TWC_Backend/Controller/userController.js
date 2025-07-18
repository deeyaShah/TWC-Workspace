import User from "../Models/users.js";

// Get all users (excluding soft-deleted)
const getAllUsers = async (req, res) => {
    try {
      const showDeleted = req.query.showDeleted === "true";
  
      const users = await User.find(showDeleted ? {} : { isDeleted: false });
  
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  };

// Get deleted users
const getDeletedUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: true });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Soft delete user
const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      isDeleted: true
    }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Restore soft-deleted user
const restoreUser = async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, { isDeleted: false });
      res.json({ message: "User restored successfully" });
    } catch (err) {
      res.status(500).json({ message: "Restore failed" });
    }
  };  

// Permanent delete
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User permanently deleted" });
      } catch (err) {
        console.error("Permanent delete error:", err);
        res.status(500).json({ message: "Failed to permanently delete user" });
      }
};

export default{
    getAllUsers,
    getDeletedUsers,
    getUserById,
    updateUser,
    softDeleteUser,
    restoreUser,
    deleteUser
};
