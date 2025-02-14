const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserData,
  deleteUserData,
  getUserById,
} = require("../controllers/user.controller");

const { authenticateToken } = require("../middleware/auth");

//to get all users data.
router.get("/", getAllUsers);

//get user based on query key = id
router.get("/search", getUserById);

//for the user to update the user data.
router.put("/:id", authenticateToken, updateUserData);

//for the user to delete their own account, and if they have a store assosicated with it, it would be deleted too.
router.delete("/:id", authenticateToken, deleteUserData);

module.exports = router;
