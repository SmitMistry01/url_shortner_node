const {getUser} = require("../services/auth");

async function restrictToLoggedInUserOnly(eq,res,next){
    const userId = req.cookies.uid;

    if(!userUid) return res.redirect("/login");
    const user = getUser(userUid);

    if(!user) return res.redirect("/login");

    req.user = user;
    next();

    
}