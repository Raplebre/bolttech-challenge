var { expressjwt: jwt }=require("express-jwt");
var config=require('../../config.json');

module.exports=jwt({secret:config.backend.jwt_secret, algorithms: ["HS256"]})
.unless(
	{
		path:["/api/login","/api/signup","/api/password"]
	}
)