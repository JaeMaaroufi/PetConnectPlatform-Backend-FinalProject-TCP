const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./database");
connectDB();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const storeRoutes = require("./routes/store.routes");
const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const port = 7001;
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes for user sign-up and login
app.use("/api/v1/auth", authRoutes);

//to get all users, update and delete users. (In the update user you can update the store's data so, I'll leave that for later.)
app.use("/api/v1/users", userRoutes);

//to get all stores, and search stores based on the store name.
app.use("/api/v1/stores", storeRoutes);

app.use("/api/v1/blogs", blogRoutes);

//middlewares
app.use(errorHandler);
app.use("*", notFound);

app.listen(port, () => {
  console.log(`This server is running on port ${port}`);
});
