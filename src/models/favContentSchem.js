const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contentModel = require("../models/content");

const favContSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: contentModel,
    required: true,
  },
  tittle: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Favourite-Content", favContSchema);
