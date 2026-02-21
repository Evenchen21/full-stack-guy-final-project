// routes //
const express = require("express");
const User = require("../models/users");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

//-----------------------------------------//
// Validation Schema //

const registrationSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(20).required(),
    last: Joi.string().min(2).max(20).required(),
  }),
  email: Joi.string().email().min(2).max(100).required(),
  password: Joi.string().min(6).max(1024).required(),
});

// Login Schema //

const loginSchema = Joi.object({
  email: Joi.string().email().min(2).max(100).required(),
  password: Joi.string().min(6).max(1024).required(),
});

// Edit Profile Schema //

const editProfileSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(20),
    last: Joi.string().min(2).max(20),
  }),
  email: Joi.string().email().min(2).max(100),
  password: Joi.string().min(6).max(1024),
  profileImage: Joi.string().uri(),
});

//-----------------------------------------//
// Register New User //

router.post("/register", async (req, res) => {
  try {
    // Validate the request body
    const { error } = registrationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user already exists in the DataBase
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Registered!");

    // Hash/Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create a new user
    user = new User({
      firstName: req.body.name?.first || "",
      lastName: req.body.name?.last || "",
      email: req.body.email,
      password: hashedPassword,
      profileImage: req.body.profileImage || "",
    });
    // Save the user to the DataBase
    await user.save();
    res.status(201).send("User Registered !");
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// Login User //

router.post("/login", async (req, res) => {
  try {
    // Validate the request body //
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists in the DataBase //
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid Email or Password!");

    // Compare the provided password with the hashed password in the DataBase //
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword)
      return res.status(400).send("Invalid Email or Password!");

    // Generate a JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    // Update the user's login status in the DataBase
    user.isLoggedIn = true;
    await user.save();

    res.status(200).json({ token, message: "Login Successful!" });
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// Get User By ID //

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("User Not Found!");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// Update User //

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { error } = editProfileSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is the owner
    if (req.user._id !== req.params.id) {
      return res
        .status(403)
        .send("Access denied. You can only edit your own profile.");
    }
    const updateFields = {};
    if (req.body.name?.first) updateFields.firstName = req.body.name.first;
    if (req.body.name?.last) updateFields.lastName = req.body.name.last;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true },
    );

    if (!user) return res.status(404).send("User Not Found!");

    res.status(200).json({ message: "User Updated!", user });
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// Delete User //

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Check if the user is the owner
    if (req.user._id !== req.params.id) {
      return res
        .status(403)
        .send("Access denied. You can only delete your own profile.");
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("User Not Found!");

    res.status(200).send("User Deleted  !");
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//------------------ ADMIN - Get All Users -----------------------/

router.get("/admin/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// ADMIN - Get User By ID //

router.get("/admin/users/:id", adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("User Not Found!");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// ADMIN - Create User //

router.post("/admin/users", adminMiddleware, async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Registered!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
      firstName: req.body.name?.first || "",
      lastName: req.body.name?.last || "",
      email: req.body.email,
      password: hashedPassword,
      isAdmin: req.body.isAdmin || false,
    });
    await user.save();
    res.status(201).send("User Created by Admin!");
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// ADMIN - Update Any User //

router.put("/admin/users/:id", adminMiddleware, async (req, res) => {
  try {
    const { error } = editProfileSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updateFields = {};
    if (req.body.name?.first) updateFields.firstName = req.body.name.first;
    if (req.body.name?.last) updateFields.lastName = req.body.name.last;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.isAdmin !== undefined) updateFields.isAdmin = req.body.isAdmin;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).send("User Not Found!");

    res.status(200).json({ message: "User Updated by Admin!", user });
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// ADMIN - Delete Any User //

router.delete("/admin/users/:id", adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("User Not Found!");
    res.status(200).send("User Deleted by Admin!");
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
module.exports = router;
