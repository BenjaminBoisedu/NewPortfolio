const express = require("express");
const router = express.Router();
const Project = require("../models/projects");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join("public", Project.ProjectImageBasePath);
const multer = require("multer");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, true);
  },
});

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (
    (req.query.title != null && req.query.title !== "") ||
    (req.query.tag != null && req.query.tag !== "")
  ) {
    searchOptions.title = new RegExp(req.query.title, "i");
    searchOptions.tag = new RegExp(req.query.tag, "i");
  }
  try {
    const projects = await Project.find(searchOptions);
    res.render("projects/index", {
      projects: projects,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  res.render("projects/new", { project: new Project() });
});

router.post("/", upload.single("img"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const project = new Project({
    title: req.body.title,
    description: req.body.description,
    tag: req.body.tag,
    createdAt: new Date(),
    ProjectImage: fileName,
  });
  try {
    const newProject = await project.save();
    res.redirect(`projects/${newProject.id}`);
    console.log(newProject);
  } catch {
    res.render("projects/new", {
      removeProjectImage: removeProjectImage(fileName),
      project: project,
      errorMessage: "Error creating project",
    });
  }
});

function removeProjectImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.render("projects/show", { project: project });
  } catch {
    res.redirect("/");
  }
});

router.post("/:id", async (req, res) => {
  let project;
  try {
    project = await Project.findById(req.params.id);
    await project.deleteOne();
    res.redirect("/projects");
    console.log("Deleted project");
  } catch {
    if (project == null) {
      res.redirect("/");
    } else {
      res.redirect(`/projects/${project.id}`);
    }
  }
});

module.exports = router;
