const dbHandlers = require("../db");
const config = require("../config.json");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
let exp;

const verifyPassword = (user, password) => {
  console.log("Verifying password");
  let temphash = crypto
    .pbkdf2Sync(password, user.salt, 100000, 64, "sha512")
    .toString("hex");
  if (user.hash === temphash) {
    // Valid password
    return true;
  } else {
    // Invalid password
    return false;
  }
};

const generateToken = account => {
  let expire = new Date();
  expire.setDate(expire.getDate() + 7);
  exp = parseInt(expire.getTime() / 1000)

  return jwt.sign(
    {
      _id: account._id,
      email: account.email,
      username: account.username,
      exp
    },
    config.backend.jwt_secret
  );
};

const signup = (req, res) => {
  console.log("Creating account");
    console.log(req.body)
    if (req.body.email && req.body.username && req.body.password) {
      //set account's password
      let salt = crypto.randomBytes(16).toString("hex");
      let hash = crypto
        .pbkdf2Sync(req.body.password, salt, 100000, 64, "sha512")
        .toString("hex");
      //create account

      dbHandlers.Qgen_user.Qcreate_User(
        [req.body.username, req.body.email, hash, salt],
        (error, results) => {
          if (error) {
            console.log(error)
            if (error.code === "ER_DUP_ENTRY") {
              res.status(400).send({ message: "User already exists" });
            } else {
              console.log(error)
              res.status(500).send({message: "Database error attempting to create user.", error});
            }
          } else {
            console.log("User created");
            res.status(200).send({
              token: generateToken({
                _id: results.insertId,
                username: req.body.username,
                email: req.body.email,
              })
            });
          }
        }
      );
    } else {
      res.status(400).json({ message: "Bad params.", });
    }
}

const login = (req, res) => {
  console.log("Received login");
    if (req.body.email && req.body.password) {
      let email = req.body.email
      let password = req.body.password
      console.log("Attempting to login");
      dbHandlers.Qgen_user.Qget_UserByEmail(
        email,
        (err, user) => {
          if (err) {
            console.log("Error getting user");
            return res.status(500).json({message: "Database error getting user", err});
          }
          if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "Email and password combination not found." });
          }
          if (!verifyPassword(user, password)) {
            console.log('Wrong password')
            return res.status(404).json({ message: "Email and password combination not found." });
          } else {
            if (user && !user.deleted && email) {
              console.log("Valid email and password combination");
  
              let token = generateToken({
                _id: user.idUser,
                email: user.email,
                username: user.username
              });
              console.log(user)
  
              res.status(200).json({
                token,
                expiresIn: exp - (new Date().getTime() / 1000)
              });
  
              console.log({
                token,
                expiresIn: exp - (new Date().getTime() / 1000)
              });
              console.log('User with ID ' + user.idUser + ' has logged in.')
            } else {
              res.status(401).json({message: 'Authentication error'});
            }
          }
        }
      );
    }
}

module.exports = {
  signup,
  login
};