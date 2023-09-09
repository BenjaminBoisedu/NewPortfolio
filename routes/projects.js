const express = require("express");
const router = express.Router();
const Project = require("../models/projects");

router.get("/", (req, res) => {
  res.render("projects/index");
});

router.get("/new", (req, res) => {
  res.render("projects/new", { project: new Project() });
});

router.post("/", (req, res) => {
  res.send("Create");
});

module.exports = router;
