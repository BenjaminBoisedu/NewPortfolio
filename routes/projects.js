const express = require("express");
const router = express.Router();
const Project = require("../models/projects");

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== "") {
    searchOptions.title = new RegExp(req.query.title, "i");
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
