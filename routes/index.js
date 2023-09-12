const express = require("express");
const router = express.Router();
const Project = require("../models/projects");

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
