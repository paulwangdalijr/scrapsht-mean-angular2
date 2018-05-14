const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blog')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err){
        console.log("Could not connect to DB", err);
    }else{
        console.log("Connected to database: " + config.db);
    }
});

// dev purposes
app.use(cors({
    origin: 'http://localhost:4200'
}));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

// Static directory for the front-end
// app.use(express.static(__dirname + '/client/dist/client')); //dev
app.use(express.static(__dirname + '/public')); //prod

// Routes
app.use('/authentication', authentication);
app.use('/blogs', blogs);


// Connect server to Angular 2 index.html
app.get('*', (req,res)=> {
    // res.sendFile(path.join(__dirname + '/client/dist/client/index.html')); //dev
    res.sendFile(path.join(__dirname + '/public/index.html')); //prod
});

// Start server
app.listen(port,  ()=> {
    console.log("Listening to port " + port);
})