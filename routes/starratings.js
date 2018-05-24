const express = require('express')
const router = express.Router();
const ProductSchema = require("../models/product");

router.post('/:rating', function (req, res, next) {
    console.log("id: " + req.body._id);
    console.log("email: " + req.body.userEmail);
    console.log("rating: " + req.params.rating);

    ProductSchema.findById(req.body._id, (err, product) => {
        if (product == null || err) {
            res.status(501).send({ "message": "Product " + req.body._id + " not found." })
        }
        else {
            if (!err) {
                console.log(product.starRatings);
                console.log(product.starRatings.filter(x => x.userEmail === req.body.userEmail));
                var toBeDeleted = product.starRatings.filter(x => x.userEmail === req.body.userEmail)

                //Delete existing rating
                for (var i = 0; i <= toBeDeleted.length - 1; i++) {
                    product.starRatings.remove(toBeDeleted[i]._id)
                }

                //Add New Rating
                product.starRatings.push({ rating: req.params.rating, userEmail: req.body.userEmail });

                //Update Average Rating
                var total = 0;
                var count = product.starRatings.length;
                for (var i = 0; i <= product.starRatings.length - 1; i++) {
                    total += product.starRatings[i].rating;
                }

                product.starsCount = Math.round(total / count);

                product.save((err, product) => {
                    res.status(200).send(product)
                });
            }
        }
    });

    /*
    ProductSchema.findById(req.body._id, (err, product) => {
        if (product == null || err) {
            res.status(501).send({ "message": "Product " + req.body.pid + " not found." })
        }
        else {
            if (!err) {
                product.starRatings.push({ rating: req.params.rating, userEmail: req.body.userEmail });
                product.save((err) => {
                    res.status(200).send(product);
                })
            }
        }
    });*/
});



module.exports = router;
