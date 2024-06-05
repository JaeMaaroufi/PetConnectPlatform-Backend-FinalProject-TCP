const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./database");
connectDB();

const express = require("express");
const port = 7001;
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middleware/errorHandler");

app.use("/api/PetConnect/v1/profiles", userRoutes);
app.use(errorHandler);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});
app.listen(port, () => {
  console.log(`This server is running on port ${port}`);
});
