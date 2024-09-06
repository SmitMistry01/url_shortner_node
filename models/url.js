const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId:{
        type:"string",
        required:"true",
        unique:"true"
    },
    redirectUrl:{
        type:"string",
        required:"true",
    },
    visitHistory:[{timestamps: { type : Number}}],
  },
    {timestamps: true},
)
const URL = mongoose.model("url",urlSchema);

module.exports = URL;
