const express = require('express')
const router = express.Router();
const ProductSchema = require("../models/airline");
const auth = require('../common/auth');




router.get('/', function (req, res, next) {
    //var ProductSchema = new ProductSchema();

    AirlineSchema.find((err, Airlines) => {
        if (err) {
            // Note that this error doesn't mean nothing was found,
            // it means the database had an error while searching, hence the 500 status
            res.status(500).send(err)
        } else {
            // send the list of all people
            res.status(200).send(Airlines);
        }
    });
});


router.post('/',auth.verifyToken, function (req, res, next) {
    var airline = new AirlineSchema();
    product.name = req.body.name

    product.save((err, createdProductObject) => {
        if (err) {
            res.status(500).send(err);
        }
        // This createdTodoObject is the same one we saved, but after Mongo
        // added its additional properties like _id.
        res.status(200).send(createdProductObject);
    });
});

router.delete('/:id',auth.verifyToken, function (req, res, next) {
    AirlineSchema.findByIdAndRemove(req.params.id, (err, deletedAirline) => {
        if (deletedAirline) {
            let response = {
                message: "Airline successfully deleted",
                id: deletedAirline._id
            };
            res.status(200).send(response);
        }
        else
        {
            let response = {
                message: "Airline not found",
            };
            res.status(404).send(response);
        }
    });
});

router.patch('/:id', function (req, res, next) {
    ProductSchema.findById(req.params.id, (err, productToUpdate) => {
        // Handle any possible database errors
        if (err) {
            res.status(500).send(err);
        } else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            productToUpdate.name = req.body.name || productToUpdate.name;

            // Save the updated document back to the database
            productToUpdate.save((err, productUpdated) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(productUpdated);
            });
        }
    });
});


module.exports = router;
