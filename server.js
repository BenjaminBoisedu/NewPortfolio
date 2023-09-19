if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const mutler = require("multer");
const path = require("path");
const fs = require("fs");

const indexRouter = require("./routes/index");
const projectsRouter = require("./routes/projects");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.use("/", indexRouter);
app.use("/projects", projectsRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

const storage = mutler.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = mutler({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  console.log(mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only");
  }
}

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.render("index");
});
