const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "beduan1h3ri0fvyreow5-mysql.services.clever-cloud.com",
  user: "u7cyqqzi2vvqgeve",
  password: "CudbI0VsHmpTIb3p32Se",
  database: "beduan1h3ri0fvyreow5",
});

connection.connect(function (err) {
  if (err) {
    // console.error("error connecting: " + err.stack);

    // Handle the error and return a JSON response
    return console.error({
      success: false,
      message: "Connection to the database failed.",
      error: err.message,
    });
  }

  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
