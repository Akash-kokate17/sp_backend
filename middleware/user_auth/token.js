const jwt = require("jsonwebtoken");
require("dotenv").config();

function userTokenAuth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).send({ msg: "authorization is missing in header" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).send({ msg: "token is missing in header" });
    }

    const decoded = jwt.verify(token, process.env.MYSECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
   res.send({msg:'error in authorization'})
  }
}
