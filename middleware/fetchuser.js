var jwt = require("jsonwebtoken");
const JWT_SECRET = "Tuhinisagoodb$oy";

const fetchuser = (req, res, next) => {
  //Get the user from JWT token and add id to req object
  const token = req.header("auth-token");
  if (!token)
    return res
      .status(401)
      .send({ msg: "Please authenticate using a valid token" });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ msg: "Please authenticate using a valid token" });
  }
};
module.exports = fetchuser;
