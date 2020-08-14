const express = require('express');
const mysql = require('mysql');
let  nodemailer = require('nodemailer');

const router = express.Router();

let con = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "getm"
  });
con.connect(function (err)
{
    if (err) throw err;
});





router.post('/new_user' , async(req , res) =>
{
    
    let sql_querry = `INSERT INTO users
        (ID,
        LastName,
        FirstName,
        Phone,
        Email,
        Password)
        VALUES
        (? , ?, ? , ? , ? , ?);
        `
    let data_to_insert =  [req.body.ID , req.body.LastName , req.body.FirstName , req.body.Phone , req.body.Email , req.body.Password];
    console.log(data_to_insert);
    
    con.query(sql_querry , data_to_insert , function(err , result)
    {
        if (err) console.log(`err in line 97 post ${err}`);
        console.log(`The result of the new added user is ${JSON.stringify(result)}`);
        res.send(result);
    });
});



router.post('/new_requst' , async(req , res) =>
{
    
    let sql_querry = `INSERT INTO getm.requests
    (tranfer_type,
    carry,
    comments,
    start_from,
    destination,
    ID
    )
    VALUES
    ( ? , ? ,? , ? , ? , ? );`
    let data_to_insert =  [req.body.tranfer_type , req.body.carry , req.body.comments , req.body.start_from , req.body.destination 
        , req.body.ID];
    console.log(data_to_insert);
    
    con.query(sql_querry , data_to_insert , function(err , result)
    {
        if (err) console.log(`err in line 67 post ${err}`);
        console.log(`The result of the new request is ${JSON.stringify(result)}`);
        res.send(result);
    });
});




router.post('/new_rides' , async(req , res) =>
{
    
    let sql_querry = `INSERT INTO getm.rides
        (start_from,
        destination,
        ID,
        supplier_symbol,
        car)
        VALUES
        ( ? , ? , ? , ? , ? );
        `;
    let data_to_insert =  [req.body.start_from , req.body.destination , req.body.ID , req.body.supplier_symbol , req.body.car];
    console.log(data_to_insert);
    
    con.query(sql_querry , data_to_insert , function(err , result)
    {
        if (err) console.log(`err in line 93 post ${err}`);
        console.log(`The result of the new rides created is ${JSON.stringify(result)}`);
        res.send(result);
    });
    
});

router.post('/send_mail' , (req , res) =>
{
    let sql_querry = `SELECT r.* ,
        u.FirstName , u.LastName , 
        u.Email , u.Phone
        FROM getm.rides as a
        join getm.requests as r on
        (
            a.start_from = r.start_from
            and a.destination = r.destination
            and r.status = 0
        )
        join getm.users as u on
        (
            r.ID = u.ID
        );`;
    con.query(sql_querry , (err , result) =>
    {
        if (err) throw err;
        //console.log(result);
        for (let i = 0; i < result.length; i++)
        {
            let mail_to_send = result[i]['Email'];
            let phone = result[i]['Phone'];
            let FirstName = result[i]['FirstName'];
            let msg = `
            יש לך נסיעה חדשה אופציונלית מ
            ${FirstName} 
            בעל מספר הטלפון הבא:  
            ${phone}
            `
            console.log(mail_to_send);
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                    user: '1shakedtest@gmail.com',
                    pass: 'me+This=42' //pls change pass later
                    }
                });
                
                let mailOptions = {
                    from: 'iritmailtojob@gmail.com',
                    to: mail_to_send,
                    subject: 'יש לך נסיעה אופציונלית חדשה',
                    text: msg
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    console.log('Email sent: ' + info.response);
                    }
                });
            
        }
        res.send(result)
    })
});



router.post('/chat_msg' , async(req , res) =>
{
    let sql_querry = `
    INSERT INTO chat
    (sender_id , reciver_id , time , msg)
    VALUES (? , ? , NOW() , ? );`;
    let chat_msg = [req.body.sender_id , req.body.recevier_id  , req.body.msg];
    //let sql_querry = mysql.format(sql_querry , chat_msg);
    con.query(sql_querry , chat_msg , (err , result) =>
    {
        if (err) console.log(`err in line 172 sending the chat msg post  \n ${err}`);
        res.send(result);
    });
});




router.post('/srart_driving' , async(req , res) =>
{
    
    
    let sql_querry = `
    REPLACE INTO drivers
        (driver_id,
        passenger_id,
        time_aproved,
        request_id)
        VALUES (? , ? , NOW() , ?);
        `;
    let driving_details = [req.body.driver_id , req.body.passenger_id , req.body.request_id];
    //let sql_querry = mysql.format(sql_querry , chat_msg);
    con.query(sql_querry , driving_details , (err , result) =>
    {
        if (err) console.log(`err in line 190 sending the chat msg post  \n ${err}`);
        console.log(result);
    });  


    let mail_to_send = req.body.email;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: '1shakedtest@gmail.com',
        pass: 'me+This=42' //pls change pass later
        }
    });
    
    let mailOptions = {
        from: '1shakedtest@gmail.com',
        to: mail_to_send,
        subject: 'יש לך נסיעה אופציונלית חדשה',
        text: req.body.msg_content
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
        res.send(info);
    });

});




router.post('/studentAnswers' , async(req , res) =>
{
    /*
    //let sql_querry = 'REPLACE INTO students_answers (StudentID , QuestionnaireNumbers , Chapter , Question , FirstAnswer , SecondAnswer) VALUES ?'
    //let data_to_insert =  req.body.answers;
    console.log(data_to_insert);
    
    con.query(sql_querry , [data_to_insert] , function(err , result)
    {
        if (err) console.log(`err in line 152 post ${err}`);
        console.log(`The result of the new added classes is ${JSON.stringify(result)}`);
        res.send(result);
    });
    */
});




//export
module.exports = router;