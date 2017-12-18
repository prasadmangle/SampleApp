const express = require('express')
const app = express();
const mongoose = require('mongoose');
const init = require('./config/init.json')
const bodyParser = require('body-parser');
const auth = require('./common/auth');

const productRouter = require('./routes/products');
const userRouter = require('./routes/users');


//app.use(bodyParser);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/products', productRouter)

app.use('/api/users', userRouter)

app.post('/api/login', (req, res, next) => {
    const user = { id: 2 };
    const token = jwt.sign({ user }, init.secretKey);

    res.json({
        token: token
    });
})

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