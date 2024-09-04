const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const download = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const UserModel = require("./models/User");
const PlaceModel = require("./models/Place");

require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
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
    socketTimeoutMS: 450000,
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 50000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.get("/test", (req, res) => {
  res.json("test ok");
});

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

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
          res
            .cookie("token", token)
            .json({ email: userDoc.email, id: userDoc._id });
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

// IMAGE UPLOAD BY LINKjhwe fgyrtgfg rgfyer r
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";

  const url = await download.image({
    url: link,
    dest: "/tmp/" + newName,
  });

  //   const url = await uploadToS3(
  //     "/tmp/" + newName,
  //     newName,
  //     mime.lookup("/tmp/" + newName)
  //   );
  res.json(url);
});

const photosMiddleware = multer({ dest: "/tmp" });

// IMAGE UPLOAD
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

// CREATE A PLACE
app.post("/places", (req, res) => {
  //   mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const deets = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await PlaceModel.create({
      owner: userData.id,
      ...deets,
    });
    res.json(placeDoc);
  });
});

// GET ALL PLACES BY USER ID
app.get("/user-places", (req, res) => {
  //   mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await PlaceModel.find({ owner: id }));
  });
});

// GET A PLACE BY ID
app.get("/places/:id", async (req, res) => {
  // mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await PlaceModel.findById(id));
});

// UPDATE A PLACE
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const { id, ...deets } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await PlaceModel.findById(id);

    if (userData.id !== placeDoc.owner.toString()) {
      return res.status(403).json("You are not the owner of this place!");
    } else {
      placeDoc.set(deets);
      placeDoc.save();
      res.json("Place updated!");
    }
  });
});

// GET ALL PLACES
app.get("/places", async (req, res) => {
  res.json(await PlaceModel.find());
});

app.listen(4000);
