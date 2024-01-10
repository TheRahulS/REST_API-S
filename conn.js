const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node",
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
