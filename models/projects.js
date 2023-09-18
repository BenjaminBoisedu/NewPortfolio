const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tag: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Project", projectSchema);
