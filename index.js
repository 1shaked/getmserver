const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//Mideleware 
app.use(bodyParser.json());
app.use(cors());

//links routes
const get = require('./routes/api/rides/get');
const posts = require('./routes/api/rides/posts');
const updates = require('./routes/api/rides/updates');

//using them
app.use('/api/rides/get' , get);
app.use('/api/rides/posts' , posts);
app.use('/api/rides/updates' , updates);


app.use(express.static(__dirname + '/public'));

//Handel Singel Page app
app.get(/.*/ , (req , res) => {
    res.sendFile(__dirname + '/public/SDK.html')
});

// Handel production
if(process.env.NODE_ENV === 'production')
{
    //Static folder
    app.use(express.static(__dirname + '/public'));

    //Handel Singel Page app
    app.get(/.*/ , (req , res) => {
        res.sendFile(__dirname + '/public/index.html')
    });
}

const port = process.env.PORT || 5000;

app.listen(port , () => {console.log(`the port is ${port}`);
})
