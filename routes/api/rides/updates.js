const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
/*
--------------------------------------
This will handel all get requests
--------------------------------------
*/

let con = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "getm",
  dateStrings: ['DATE', 'DATETIME']
});
con.connect(function (err)
{
  if (err) throw err;
});

router.put('/approve_drive' , async(req , res) =>
{
 let update_request = `
 UPDATE requests
 SET
 status = 1
 WHERE rowNumber = ?; 
 `;
 let update_drivers = `
    UPDATE drivers
    SET
      is_done = 1
    WHERE driver_id = ?
    and request_id = ?; 
 `;
 //note the request_id and the rowNumber is the same;
 let update_request_data = [req.body.rowNumber];
 let update_drivers_data = [req.body.driver_id , req.body.request_id];

  con.query(update_request , update_request_data , (err , result) =>
      {
          if (err) console.log('can not updae request the error is \n' + err);
          console.log(result);
          res.status(200).send(result);
      });
  con.query(update_drivers , update_drivers_data , (err , result) =>
  {
      if (err) console.log(`can not update driveres because error acuord \n ${err}`);
      console.log(result);
      //res.status(200).send(result);
  });
});






module.exports = router;