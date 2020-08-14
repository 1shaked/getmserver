const express = require('express');
const router = express.Router();
let  nodemailer = require('nodemailer');

router.post('/sendContact' , async(req , res) =>
{
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '1shakedtest@gmail.com',
          pass: 'secretpass' //pls change pass later
        }
      });
      
      let mailOptions = {
        from: 'iritmailtojob@gmail.com',
        to: req.body.to,
        subject: req.body.title,
        text: req.body.text
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.send(req.body);
});




module.exports = router;