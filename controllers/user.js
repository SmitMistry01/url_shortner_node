const User = require("../models/user.js");
const {v4:uuidv4} = require("uuid");
const {setUser,getUser} = require("../services/auth.js")

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;
  try {
    await User.create({ name, email, password });
    return res.render("home");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error creating user");
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      // Correctly check the result of the findOne() call
      return res.render("login", {
        error: "Invalid Credentials",
      });
    }

    const sessionId = uuidv4();
    setUser(sessionId,user);
    res.cookie("uid",sessionId);
    
    // User exists and credentials are valid
    return res.redirect("/");

  } catch (error) {
    console.error(error);
    return res.status(500).send("Error logging in");
  }
}

module.exports = { handleUserSignUp, handleUserLogin };
