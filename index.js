const express = require("express");
const path = require("path");
const app = express();
const urlRoute = require("./routes/routes.js");
const { connectToMongoDb } = require("./connect");
const { handleGenerateNewShortUrl } = require("./controllers/url.js");
const staticRoute = require("./routes/staticRouter.js");
const URL = require("./models/url.js");

const PORT = 8080;  
const HOST = "localhost";

connectToMongoDb("mongodb://127.0.0.1:27017/short_url").then(() => {
  console.log("Database connected successfully");
});

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Corrected: extended should be a boolean

// Route handlers
app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/:shortID", async (req, res) => {
  const shortId = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamps: Date.now(),
        },
      },
    }
  );
  if (entry) {
    res.redirect(entry.redirectUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(PORT, HOST, () =>
  console.log(`Server listening at http://${HOST}:${PORT}`)
);
