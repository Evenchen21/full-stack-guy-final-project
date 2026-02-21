const express = require("express");
const router = express.Router();
const Card = require("../models/card");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/auth");
const Joi = require("joi");
const User = require("../models/users");

//-----------------------------------------//
// Validation Schema //

const cardSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(2).max(500).required(),
  imageUrl: Joi.string().uri().required(),
  isLiked: Joi.boolean().default(false),
  category: Joi.string().default("Main"),
});

const cardUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  description: Joi.string().min(2).max(500),
  imageUrl: Joi.string().uri(),
  isLiked: Joi.boolean(),
});

//-----------------------------------------//
// Get All Cards //

router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get Card By ID //

router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Card Not Found");
    res.json(card);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//-----------------------------------------//
// Create Card //

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { error } = cardSchema.validate(req.body, { allowUnknown: true });
    if (error) {
      console.error(
        "Card create validation error:",
        error.details[0].message,
        "| body:",
        JSON.stringify(req.body),
      );
      return res.status(400).send(error.details[0].message);
    }

    const newCard = new Card({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      isLiked: req.body.isLiked ?? false,
      category: req.body.category || "Main",
    });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    console.error("Card create error:", err.message);
    res.status(500).send("Server Error");
  }
});

//-----------------------------------------//
// Update Card //

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { error } = cardUpdateSchema.validate(req.body, {
      allowUnknown: true,
    });
    if (error) return res.status(400).send(error.details[0].message);

    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    if (!card) return res.status(404).send("Card Not Found");

    res.json(card);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//-----------------------------------------//
// Delete Card //

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).send("Card Not Found");
    res.send("Card Deleted");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//-----------------------------------------//
// Like/Unlike Card //

router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Card Not Found");

    (card.isLiked =
      card.isLiked.indexOf(req.user._id) === -1
        ? [...card.isLiked, req.user._id]
        : card.isLiked.filter((id) => id.toString() !== req.user._id)) &&
      (await card.save());
    res.json(card);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//-----------------------------------------//
// ADMIN - Get All Cards //

router.get("/admin/cards", adminMiddleware, async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// ADMIN - Get Card By ID //

router.get("/admin/cards/:id", adminMiddleware, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Card Not Found!");
    res.status(200).json(card);
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// ADMIN - Create Card //

router.post("/admin/cards", adminMiddleware, async (req, res) => {
  try {
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newCard = new Card(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// ADMIN - Update Any Card //

router.put("/admin/cards/:id", adminMiddleware, async (req, res) => {
  try {
    const { error } = cardUpdateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    if (!card) return res.status(404).send("Card Not Found!");

    res.status(200).json({ message: "Card Updated by Admin!", card });
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//
// ADMIN - Delete Any Card //

router.delete("/admin/cards/:id", adminMiddleware, async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).send("Card Not Found!");
    res.status(200).send("Card Deleted by Admin!");
  } catch (err) {
    res.status(500).send("(X) Internal Server Error (X)");
  }
});

//-----------------------------------------//

module.exports = router;
