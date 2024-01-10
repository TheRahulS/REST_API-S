const express = require("express");
const app = express();
const connection = require("./conn");

const PORT = 3000;
app.use(express.json());

app.get("/data", (req, res) => {
  const sql = "select * from data";
  connection.query(sql, (err, rows) => {
    if (!err) {
      const modifiedData = {
        message: "data fetched successfully",
        data: rows.map((row) => ({
          user_id: row.id,
          user_name: row.name,
          user_email: row.email,
          user_mobile: row.mobile,
        })),
      };

      res.status(200).json(modifiedData);
    } else {
      res.send(err);
    }
  });
});
// to get data to according to id or name or email or mobile
app.get("/data/:paramValue", (req, res) => {
  const paramValue = req.params.paramValue;

  // Determine the type of parameter based on the format of the value
  let sql;
  let params;

  if (paramValue.includes("@")) {
    // If the value contains '@', assume it's an email
    sql = "SELECT * FROM data WHERE email = ?";
    params = [paramValue];
  } else if (!isNaN(paramValue)) {
    // If the value is a number, assume it's an ID or a mobile number
    sql = "SELECT * FROM data WHERE id = ? OR mobile = ?";
    params = [paramValue, paramValue];
  } else {
    // Otherwise, assume it's a name
    sql = "SELECT * FROM data WHERE name = ?";
    params = [paramValue];
  }

  connection.query(sql, params, (err, rows) => {
    if (!err) {
      if (rows.length === 0) {
        res.status(404).json({ error: "Data not found" });
      } else {
        const modifiedData = {
          message: "Data fetched successfully",
          data: rows.map((row) => ({
            user_id: row.id,
            user_name: row.name,
            user_email: row.email,
            user_mobile: row.mobile,
          })),
        };

        res.status(200).json(modifiedData);
      }
    } else {
      res.status(500).send(err);
    }
  });
});

// to insert data through json
app.post("/data", (req, res) => {
  const ins = req.body; //we store all data through json are stroed in ins variable.

  const { name, email, mobile } = ins;
  // console.log(ins);
  if (!name || !email || !mobile) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }
  sql = "insert into data(name,email,mobile) values(?,?,?)";
  // console.log(sql);
  connection.query(sql, [name, email, mobile], (err) => {
    if (err) {
      res.status(500).json({ error: "data not inserted successfully" });
    } else {
      res.status(200).json({ message: "data inserted successfully" });
    }
  });
});

// delete data throught json
app.delete("/data/:id", (req, res) => {
  const id = req.params.id;
  // Check if the ID exists in the database before attempting to delete
  const checkIfExistsQuery = "SELECT * FROM data WHERE id = ?";

  connection.query(checkIfExistsQuery, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error checking ID existence" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "ID not found in the database" });
      } else {
        // If the ID exists, proceed with the deletion
        const deleteQuery = "DELETE FROM data WHERE id = ?";
        connection.query(deleteQuery, id, (err) => {
          if (err) {
            res.status(500).json({ error: "Data not deleted successfully" });
          } else {
            res.status(200).json({ message: "Data deleted successfully" });
          }
        });
      }
    }
  });
});

// update data through  json
app.put("/data/:id", (req, res) => {
  const ins = req.body;
  const { name, email, mobile } = ins;
  const id = req.params.id;

  // Check if the id exists in the database
  const checkIdQuery = "SELECT * FROM data WHERE id=?";
  connection.query(checkIdQuery, id, (checkErr, results) => {
    if (checkErr) {
      res.status(500).send("error checking to id existance");
    } else {
      if (results.length === 0) {
        res.status(404).send("ID not found in the database");
      } else {
        // Update data if the id exists
        const updateQuery =
          "UPDATE data SET name=?, email=?, mobile=? WHERE id=?";
        connection.query(
          updateQuery,
          [name, email, mobile, id],
          (updateErr) => {
            if (updateErr) {
              res.status(500).json({ error: "data not updated successfully" });
            } else {
              res.status(200).json({
                message: "data updated successfully",
              });
            }
          }
        );
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`port is running on server ${PORT}`);
});
