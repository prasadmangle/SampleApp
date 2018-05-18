const express = require('express')
const app = express();
const mongoose = require('mongoose');
const init = require('./config/init.json')
const bodyParser = require('body-parser');
const auth = require('./common/auth');
const cors = require('cors');


const productRouter = require('./routes/products');
const userRouter = require('./routes/users');
const airlineRouter = require('./routes/airlines');
const commentsRouter = require('./routes/comments')


//app.use(bodyParser);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","*")
    next();
  });

app.use('/api/products', productRouter)

app.use('/api/users', userRouter)

app.use('/api/airlines', airlineRouter)

app.use('/api/comments',commentsRouter)

app.get('/api/protected', auth.verifyToken,auth.isAdmin, (req, res, next) => {

    res.json({
        message: 'This is protected',
        data: req.data
    });

});

app.use((req, res, next) => {
    res.status(200).json({
        message: 'It works!!'
    });
});

mongoose.connect(init.connString);

module.exports = app;