const { client } = require("../config/db");

const OTP = async (req, res, next) => {
  try {
    const Id = req.body.Id;
    const check = await client.get(Id);
    console.log("check", Id,req.body.otp,check);
    if (check == req.body.otp) {
      next();
    } else {
      return res.status(404).json({ message: "wrong otp" });
    }
  } catch (error) {
    return res.status(404).json({ message: "wrong otp" });
  }
};

module.exports = { OTP };
