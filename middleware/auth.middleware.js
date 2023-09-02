const jwt = require("jsonwebtoken");

require("dotenv").config();

const auth = (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1];
    const tokenDecoded = jwt.verify(token, process.env.Secret_Key);
    req.userData = { userId: tokenDecoded.userId, email: tokenDecoded.email };
    next(); 

  } 
  
    catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }

};

module.exports = { auth };