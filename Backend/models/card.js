const { required } = require("joi");
const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 1000 },
  description: { type: String, required: true, minlength: 2, maxlength: 500 },
  imageUrl: { type: String, required: true },
  isLiked: { type: Boolean, default: false },
  category: { type: String, default: "Main" },
  createdAt: { type: Date, default: Date.now() },
});

const CardModel = mongoose.model("cards", CardSchema);

module.exports = CardModel;
