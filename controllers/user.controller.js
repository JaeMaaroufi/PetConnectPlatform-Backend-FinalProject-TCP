const User = require("../models/User");
const Profile = require("../models/Profile");
const Store = require("../models/Store");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (profile, roleSpecificDetails) => {
  const payload = {
    id: profile._id,
    fullname: profile.fullname,
    email: profile.email,
    role: profile.role,
    ...roleSpecificDetails,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.EXP,
  });
  return token;
};

const getAllProfiles = async (req, res, next) => {
  try {
    const allProfiles = await Profile.find();

    res.status(200).json({ allProfiles });
  } catch (error) {
    next(error);
  }
};

const getAllStores = async (req, res, next) => {
  try {
    const allStores = await Store.find().populate({
      path: "profile",
      select: "-password",
    });

    res.status(200).json({ allStores });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find().populate({
      path: "profile",
      select: "-password",
    });
    res.status(200).json({ allUsers });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      password,
      bio,
      role,
      avatar,
      username,
      ownerManagerName,
      hoursOfOperation,
    } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (
      (role === "user" && !username) ||
      (role === "store" && (!ownerManagerName || !hoursOfOperation))
    ) {
      return res
        .status(400)
        .json({ error: "Role-specific information is missing" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProfile = await Profile.create({
      ...req.body,
      password: hashedPassword,
    });

    let roleSpecificDetails = {};

    if (role === "user") {
      if (!username) {
        return res
          .status(400)
          .json({ error: "Username is required for users" });
      }
      await User.create({ profile: newProfile._id, username });
      roleSpecificDetails = { username };
    } else if (role === "store") {
      if (
        !ownerManagerName ||
        !hoursOfOperation?.open ||
        !hoursOfOperation?.close
      ) {
        return res.status(400).json({
          error:
            "Owner manager name, open time, and close time are required for store owners",
        });
      }
      await Store.create({
        profile: newProfile._id,
        ownerManagerName,
        hoursOfOperation,
      });
      roleSpecificDetails = { ownerManagerName, hoursOfOperation };
    } else {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const generatedToken = generateToken(newProfile, roleSpecificDetails);
    res
      .status(201)
      .json({ message: "Registration successful", token: generatedToken });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const profile = req.profile;
    const roleSpecificDetails = req.roleSpecificDetails;

    const token = generateToken(profile, roleSpecificDetails);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {}
};

const getStoreProfileBystoreName = async (req, res, next) => {
  try {
    const { storeName } = req.query;
    console.log(storeName);

    if (!storeName) {
      return res.status(400).json({ error: "Store name is required" });
    }

    const storeProfile = await Profile.findOne({ fullname: storeName });

    res.status(200).json({ storeName: storeProfile });
  } catch (error) {
    next(error);
  }
};

//update profile data

const updateProfileData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this profile" });
    }

    if (updatedData.password) {
      if (updatedData.password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long",
        });
      }
      const hashedPassword = await bcrypt.hash(updatedData.password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedProfile = await Profile.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res
      .status(200)
      .json({ message: "Profile data updated successfully", updatedProfile });
  } catch (error) {
    next(error);
  }
};

// Update user data
const updateUserData = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this profile" });
    }

    const updatedUser = await User.findOneAndUpdate({ profile: id }, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User data updated successfully", updatedUser });
  } catch (error) {
    next(error);
  }
};

// Update store data
const updateStoreData = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this profile" });
    }

    const updatedStore = await Store.findOneAndUpdate(
      { profile: id },
      req.body,
      { new: true }
    );
    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found" });
    }
    res
      .status(200)
      .json({ message: "Store data updated successfully", updatedStore });
  } catch (error) {
    next(error);
  }
};

const deleteProfileData = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this profile" });
    }

    const deletedProfile = await Profile.findById(id);
    if (!deletedProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    if (deletedProfile.role === "user") {
      await User.findOneAndDelete({ profile: id });
    }

    if (deletedProfile.role === "store") {
      await Store.findOneAndDelete({ profile: id });
    }

    await Profile.findByIdAndDelete(id);

    res.status(200).json({
      message: "Profile and associated data deleted successfully",
      deletedProfile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getAllProfiles,
  getAllStores,
  registerUser,
  login,
  getStoreProfileBystoreName,
  updateUserData,
  updateProfileData,
  updateStoreData,
  deleteProfileData,
};
