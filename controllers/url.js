const shortid = require("shortid");
const URL = require("../models/url.js");

async function handleGenerateNewShortUrl(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }else{
  const shortID = shortid(7);
  await URL.create({
    shortId: shortID,
    redirectUrl: body.url,
  });

  return res.json({ id: shortID });
}
}

module.exports = { handleGenerateNewShortUrl, };

