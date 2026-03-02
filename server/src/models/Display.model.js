const mongoose = require("mongoose");

const displaySchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    hardwareID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    firstline: {
      type: String,
      required: true,
    },
    firstlineScroll: {
      type: Boolean,
      required: true,
    },
    secondline: {
      type: String,
      required: true,
    },
    secondlineScroll: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Display = mongoose.model("Display", displaySchema);

module.exports = Display;
