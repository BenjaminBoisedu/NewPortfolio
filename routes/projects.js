const express = require("express");
const router = express.Router();
const Project = require("../models/projects");

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const projects = await Project.find({});
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
router.post("/", async (req, res) => {
  const project = new Project({
    title: req.body.title,
    description: req.body.description,
    tag: req.body.tag,
  });
  try {
    const newProject = await project.save();
    // res.redirect(`projects/${newProject.id}`);
    res.redirect("projects");
    console.log(newProject);
  } catch {
    res.render("projects/new", {
      project: project,
      errorMessage: "Error creating project",
    });
  }
});

module.exports = router;
