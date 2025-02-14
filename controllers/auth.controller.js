const User = require("../models/User");
const Store = require("../models/Store");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (user, roleSpecificDetails) => {
  const payload = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    username: user.username,
    role: user.role,
    ...roleSpecificDetails,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
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
      username,
      ownerManagerName,
    } = req.body;

    const hoursOfOperation = JSON.parse(req.body.hoursOfOperation);

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (
      (role === "user" && !username) ||
      (role === "store" &&
        (!ownerManagerName ||
          !hoursOfOperation?.open ||
          !hoursOfOperation?.close))
    ) {
      return res
        .status(400)
        .json({ error: "Role-specific information is missing" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      bio,
      role,
      image: req.file ? req.file.filename : null,
    };

    if (role === "user") {
      userData.username = username;
    }

    const newUser = await User.create(userData);

    let roleSpecificDetails = {};

    if (role === "store") {
      const { open, close } = hoursOfOperation;
      const newStore = await Store.create({
        user: newUser._id,
        ownerManagerName,
        hoursOfOperation: { open, close },
        image: req.file ? req.file.filename : null,
      });

      roleSpecificDetails = {
        ownerManagerName: newStore.ownerManagerName,
        hoursOfOperation: newStore.hoursOfOperation,
      };
    }

    const generatedToken = generateToken(newUser, roleSpecificDetails);

    res
      .status(201)
      .json({ message: "Registration successful", token: generatedToken });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = req.user;
    const roleSpecificDetails = req.roleSpecificDetails;

    const token = generateToken(user, roleSpecificDetails);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, login };
