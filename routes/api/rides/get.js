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
  user: "shakedA",
  password: "",
  database: "getm",
  dateStrings: ['DATE', 'DATETIME']
});
con.connect(function (err)
{
  if (err) throw err;
});

router.get('/user' , async (req , res) =>
{
  let sql_querry = `SELECT * FROM users
  WHERE FirstName = ? and Password = ?;`;
  let params = [req.query.FirstName , req.query.Password];
  sql_querry = mysql.format(sql_querry , params)
  con.query(sql_querry , function (err, result, fields) 
  {
    if (err) throw err;
    res.status(200);
    res.send( result );
  });
});


router.get('/requests' , async (req , res) =>
{
  let sql_querry = `
      SELECT r.* , u.FirstName , u.LastName , 
    u.Email  , u.Phone FROM getm.requests as r
    join getm.users as u
    on u.ID = r.ID and status = 0;`;
  con.query(sql_querry , function (err, result, fields) 
  {
    if (err) throw err;
    res.status(200);
    res.send( result );
  });
});


router.get('/chat_conv' , async (req , res) =>
{
  let sql_querry = `SELECT * FROM getm.chat
  Where sender_id = ? 
  and reciver_id = ?
  ORDER BY time desc`;

  let params = [req.query.sender_id , req.query.reciver_id];
  sql_querry = mysql.format(sql_querry , params)

  con.query(sql_querry , function (err, result, fields) 
  {
    if (err) throw err;
    res.status(200);
    res.send( result );
  });
});


router.get('/rides_to_aprove' , async (req , res) =>
{
  let sql_querry = `SELECT w.*,
  u.FirstName as driver_name FROM getm.wait_for_approve as w
  join users as u on 
  (
    u.ID = w.driver_id
      and passenger_id = ?
  );`;

  let params = [req.query.passenger_id];
  sql_querry = mysql.format(sql_querry , params)

  con.query(sql_querry , function (err, result) 
  {
    if (err) throw err;
    res.status(200);
    res.send( result );
  });
});

router.get('/most_rides' , async(req , res) => 
{
  let sql_querry = `SELECT * FROM getm.most_rides;`
  con.query(sql_querry , function (err, result) 
  {
    if (err) throw err;
    res.status(200);
    res.send( result );
  });
});



module.exports = router;