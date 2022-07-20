require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const http = require("http");
const authRoutes = require("./routes/auth-routes");
const usersRoutes = require("./routes/users-routes");
const logger = require("./util/logger");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// If you pass four parameters, express knows it's for error handling
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    // Check if response is sent
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An Unknown Error Occurred!" });
});

app.use(express.json());
app.use(cors());

mongoose
  .connect(`${process.env.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
    app.listen(process.env.PORT || 5555);
  })
  .catch((err) => {
    console.log(err);
  });
