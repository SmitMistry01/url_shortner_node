const express = require("express");
const path = require("path");
const app = express();
const { connectToMongoDb } = require("./connect");
const URL = require("./models/url.js");

const urlRoute = require("./routes/routes.js");
const staticRoute = require("./routes/staticRouter.js");
const userRoute = require("./routes/user.js");

const PORT = 8080;
const HOST = "localhost";

connectToMongoDb("mongodb://127.0.0.1:27017/short_url")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route handlers
app.use("/url", urlRoute);
app.use("/", staticRoute);
app.use("/user", userRoute);

app.get("/url/:shortID", async (req, res) => {
  try {
    const shortId = req.params.shortID;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamps: Date.now() } } }
    );

    if (entry) {
      res.redirect(entry.redirectUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, HOST, () =>
  console.log(`Server listening at http://${HOST}:${PORT}`)
);
