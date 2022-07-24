var mysql = require("mysql");
// Pool for db connections
var env = process.env.NODE_ENV || 'development';
if(env == 'development') {var pool = mysql.createPool(require("../config.json").db_conn);}
if(env == 'production' || env != 'development') {var pool = mysql.createPool(require("../config.json").db_conn_PROD);}


myQuery = function(queryString, values, callback) {
  console.log(queryString)
  if (pool) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      //execute the queryString
      connection.query(queryString, values, function(error, results, fields) {
        if (error) {
          callback(error);
        } else {
          callback(false, results);
        }
      });
      connection.release();
    });
  } else {
    callback(true);
  }
};

module.exports = {
  Qgen_user: require("./Quser")(myQuery),
  Qgen_project: require('./Qproject')(myQuery),
  Qgen_task: require('./Qtask')(myQuery)
};