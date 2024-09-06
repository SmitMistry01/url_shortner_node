const shortid = require("shortid");
const URL = require("../models/url.js");

async function handleGenerateNewShortUrl(req, res) {
  const { body } = req; // Use req.body to access the request body
  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  } else {
    const shortID = shortid.generate(); // Generate a unique short ID
    await URL.create({
      shortId: shortID,
      redirectUrl: body.url,
      visitHistory: [],
    });

    return res.render("home", {
      id: shortID,
    });
  }
}

module.exports = { handleGenerateNewShortUrl };
