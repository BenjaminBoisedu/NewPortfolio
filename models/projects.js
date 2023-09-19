const mongoose = require("mongoose");
const path = require("path");
const ProjectImageBasePath = "uploads/projectImages";

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
    required: true,
    default: Date.now,
  },
  ProjectImage: {
    type: String,
    required: true,
  },
});

projectSchema.virtual("ProjectImagePath").get(function () {
  if (this.ProjectImage != null) {
    return path.join("/", ProjectImageBasePath, this.ProjectImage);
  }
});
module.exports = mongoose.model("Project", projectSchema);
module.exports.ProjectImageBasePath = ProjectImageBasePath;
