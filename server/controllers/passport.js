var passport = require("passport");
var CustomStrategy = require("passport-custom").Strategy;

const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

var dbHandlers = require("../db");
var crypto = require("crypto");

var config = require("../config.json");

var verifyPassword = (accountInfo, password) => {
  console.log("Verifying password");
  let temphash = crypto
    .pbkdf2Sync(password, accountInfo.salt, 100000, 64, "sha512")
    .toString("hex");
  if (accountInfo.hash === temphash) {
    // Valid password
    return true;
  } else {
    // Invalid password
    return false;
  }
};
passport.use(
  "email",
  new CustomStrategy(({ body }, done) => {
    console.log("Getting account by email");

    dbHandlers.Qgen_user.Qget_UserByEmail(
      body.email,
      (err, accountInfo) => {
        if (err) {
          console.log("Error getting account");
          return done(err);
        }
        if (!accountInfo) {
          console.log("Account not found");
          return done(null, false, { message: "Account not found" });
        }
        if (!verifyPassword(accountInfo, body.password)) {
          return done(null, false, { message: "Wrong password" });
        } else {
          return done(null, {
            _id: accountInfo.idUser,
            email: accountInfo.email,
            username: accountInfo.username
          });
        }
      }
    );
  })
);

passport.serializeUser(function(account, done) {
  //serialize by user id
  done(null, account._id);
});

passport.deserializeUser(function(id, done) {
  //find user in database again
  dbHandlers.Qgen_accounts.Qget_byIdAccount(id, (err, results) => {
    if (!err) {
      done(null, results);
    } else {
      done(err);
    }
  });
});