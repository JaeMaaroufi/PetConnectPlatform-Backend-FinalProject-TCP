const express = require("express");
const router = express.Router();

const { registerUser, login } = require("../controllers/auth.controller");
const { authenticateUser } = require("../middleware/auth");
const upload = require("../middleware/multer.config");

//for the user to add an account.
router.post("/sign-up", upload.single("file"), registerUser);

//for the user to login to their account.
router.post("/login", authenticateUser, login);

module.exports = router;
