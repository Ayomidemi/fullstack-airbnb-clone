const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const UserModel = require("./models/User");

require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// mongoose.connect(process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 4500000, // 45 seconds
    connectTimeoutMS: 3000000, // 30 seconds
    serverSelectionTimeoutMS: 500000, // 5 seconds to connect to the server
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.get("/test", (req, res) => {
  res.json("test ok");
});

// SIGN UP
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(422)
        .json({ error: "User with this email already exists." });
    }

    const userDoc = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(userDoc);
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration." });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  //   mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await UserModel.findOne({ email }).maxTimeMS(20000);

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("Invaliid password!");
    }
  } else {
    res.json("User not found!");
  }
});

// GET PROFILE
app.get("/profile", (req, res) => {
  //   mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await UserModel.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

//   LOGOUT
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.listen(4000);
