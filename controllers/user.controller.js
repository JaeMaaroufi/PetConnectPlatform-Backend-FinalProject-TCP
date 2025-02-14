const User = require("../models/User");
const Store = require("../models/Store");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find().select("-password");
    res.status(200).json({ allUsers });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user: foundUser });
  } catch (error) {
    next(error);
  }
};

const updateUserData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this profile" });
    }

    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({ error: "Profile not found" });
    }

    if (updatedData.password) {
      const isSamePassword = await bcrypt.compare(
        updatedData.password,
        currentUser.password
      );
      if (isSamePassword) {
        return res.status(400).json({
          error: "New password cannot be the same as the current password",
        });
      }

      if (updatedData.password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long" });
      }

      const hashedPassword = await bcrypt.hash(updatedData.password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (currentUser.role === "store") {
      const { ownerManagerName, hoursOfOperation, image } = updatedData;

      const updatedStoreData = {};
      if (ownerManagerName !== undefined)
        updatedStoreData.ownerManagerName = ownerManagerName;
      if (hoursOfOperation !== undefined)
        updatedStoreData.hoursOfOperation = hoursOfOperation;
      if (image !== undefined) updatedStoreData.image = image;

      await Store.findOneAndUpdate(
        { user: currentUser._id },
        updatedStoreData,
        { new: true }
      );
    }

    res
      .status(200)
      .json({ message: "User data updated successfully", updatedUser });
  } catch (error) {
    next(error);
  }
};

const deleteUserData = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this profile" });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userToDelete.role === "store") {
      await Store.findOneAndDelete({ user: id });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User and associated data deleted successfully",
      deletedUser: userToDelete,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserData,
  deleteUserData,
};
