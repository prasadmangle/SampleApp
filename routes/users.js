const express = require('express')
const router = express.Router();
const UserSchema = require("../models/user");
const auth = require('../common/auth');
var dateTime = require('node-datetime');
const bcrypt = require('bcrypt');
const init = require('../config/init')
const jwt = require('jsonwebtoken');
const roles = require('../config/roles')


router.get('/', function (req, res, next) {
    //var UserSchema = new UserSchema();

    UserSchema.find((err, Users) => {
        if (err) {
            // Note that this error doesn't mean nothing was found,
            // it means the database had an error while searching, hence the 500 status
            res.status(500).send(err)
        } else {
            // send the list of all people
            res.status(200).send(Users);
        }
    });
});

router.post('/register', function (req, res, next) {
    console.log('Inside register')
    var user = new UserSchema();
    user.name = req.body.name;

    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    console.log(req.body.email);
    user.email = req.body.email;
    user.created = new Date(dateTime.create().now());
    user.role = req.body.role;

    console.log(JSON.stringify(user));
    user.save((err, createdUserObject) => {
        if (err) {
            res.status(500).send(err);
        }
        createdUserObject.password = '';
        res.status(200).send(createdUserObject);
    });
});

router.post('/registerAdmin', auth.verifyToken, auth.isAdmin, function (req, res, next) {
    var user = new UserSchema();
    user.name = req.body.name;

    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    user.email = req.body.email;
    user.created = new Date(dateTime.create().now());
    user.role = roles.admin;


    user.save((err, createdUserObject) => {
        if (err) {
            res.status(500).send(err);
        }
        createdUserObject.password = '';
        res.status(200).send(createdUserObject);
    });
});

router.post('/login', (req, res, next) => {
    UserSchema.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            res.status(403).json({
                message: "Error during finding user"
            })
        }
        else {
            if (!user) {
                res.status(401).json({
                    message: "User not found"
                })
            }
            else {
                console.log(req.body.password);
                console.log(user.password);

                bcrypt.compare(req.body.password, user.password, (err, outcome) => {
                    if (err) {
                        res.status(401).json({ message: 'Error while authentication.' });
                    }
                    else {
                        if (outcome) {
                            user.password = '';
                            res.status(200).json({
                                token: jwt.sign({ user }, init.secretKey, {
                                    expiresIn: 120,
                                    subject: user.email
                                }),
                                role: init.superAdmin === user.email ? roles.admin : user.role
                            });
                        }
                        else {
                            res.status(401).json({ message: 'Authentication failed. Wrong password.' });
                        }
                    }
                })
            }
        }
    })
})

module.exports = router;