const express = require('express')
const jwt = require('jsonwebtoken');
const init = require('../config/init.json')
const UserSchema = require('../models/user');
const roles = require('../config/roles');

module.exports = {

    verifyToken: function (req, res, next) {

        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader != 'undefined') {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;

            jwt.verify(req.token, init.secretKey, (err, data) => {
                if (err) {
                    res.status(403).json({
                        message: "You are not authorized as authentication token not matching."
                    });
                }
                else {
                    req.data = data;
                    next();
                }

            });

        } else {
            res.status(403).json({
                message: "You are not authorized as authentication token not found."
            });
        }


    },

    isAdmin: function (req, res, next) {

        if (req.data.user.email) {
            UserSchema.findOne({
                email: req.data.user.email
            }, (err, FoundUser) => {
                if (err) {
                    res.status(403).json({
                        message: "Error during finding user"
                    })
                }
                else {
                    if (!FoundUser) {
                        res.status(401).json({
                            message: "User not found"
                        })
                    }
                    else {
                        if (FoundUser.role === roles.admin || FoundUser.email === init.superAdmin) {
                            next();
                        }
                        else {
                            res.status(401).json({
                                message: "User not in Admin role"
                            });
                        }
                    }
                }
            })
        }
    }

};