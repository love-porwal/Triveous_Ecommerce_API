const jwt = require("jsonwebtoken");

require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.Secret_Key, function (err, decoded) {
      if (err) {
        return res.status(404).json({ message: "Authentication failed" });
      }
      if (decoded) {
        req.user = decoded;
        next();
      }
    });
    // req.userData = { userId: tokenDecoded.userId, email: tokenDecoded.email };
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = { auth };
