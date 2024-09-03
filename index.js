const express = require("express");
const app = express();
const urlRoute = require("./routes/routes.js");
const { connectToMongoDb } = require("./connect");
const URL = require("./models/url.js");

const PORT = 8080;
const HOST = "localhost";

connectToMongoDb("mongodb://127.0.0.1:27017/short_url").then(() => {
  console.log("Database connected succesfully");
});

//middlewares
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
app.use("/url", urlRoute);

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

  res.redirect(entry.redirectUrl);
});
app.listen(PORT, HOST, () =>
  console.log(`Server listening at http://${HOST}:${PORT}`)
);
