const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  registerUser,
  login,
  getStoreProfileBystoreName,
  updateUserData,
  updateProfileData,
  updateStoreData,
  deleteProfileData,
  getAllProfiles,
  getAllStores,
} = require("../controllers/user.controller");

const { authenticateUser, authenticateToken } = require("../middleware/auth");

//to get all profiles data.
router.get("/", getAllProfiles);

//to get all stores data.
router.get("/stores", getAllStores);

//to get all users data.
router.get("/users", getAllUsers);

//to get profile based on storename | query: key = storeName
router.get("/search", getStoreProfileBystoreName);

//for the user to add an account.
router.post("/sign-up", registerUser);

//for the user to login to their account.
router.post("/login", authenticateUser, login);

//for the user to update the profile data.
router.put("/:id", authenticateToken, updateProfileData);

//for the user to update the user data.
router.put("/stores/:id", authenticateToken, updateStoreData);

//for the user to update the store data.
router.put("/users/:id", authenticateToken, updateUserData);

//for the user to delete their profile.
router.delete("/:id", authenticateToken, deleteProfileData);

module.exports = router;
