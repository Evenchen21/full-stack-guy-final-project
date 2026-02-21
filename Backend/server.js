const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const app = express();
const port = process.env.PORT || 8000;
//-------------------------------------//
// CORS configuration //
const corsOption = {
  origin: (origin, callback) => {
    // Allow any localhost origin or no origin (e.g. curl/Postman)
    if (
      !origin ||
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
    "x-auth-token",
  ],
  credentials: true,
};
app.use(cors(corsOption));
//-------------------------------------//
// Middleware //

app.use(logger("dev"));
app.use(express.json());
app.use(express.static("public"));

//-------------------------------------//
// Routes //
app.use("/api/users", require("./routes/users"));
app.use("/api/cards", require("./routes/cards"));

//-------------------------------------//
// Serve frontend build from `dist` when present
const distDir = path.join(process.cwd(), "dist");
app.use(express.static(distDir));

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(distDir, "index.html"), (err) => {
    if (err) next();
  });
});

//-------------------------------------//
// Connect to MongoDB //

mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    console.log("Connected to DataBase 👌");
  })
  .catch((err) => {
    console.log("Error connecting to DataBase X");
  });

// Start the server
app.listen(port, () => {
  console.log(` Server is - running 👌 `);
});
