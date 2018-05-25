const express = require('express')
const router = express.Router();
const ProductSchema = require("../models/product");

router.post('/', function (req, res, next) {

    console.log("productid: " + req.body.product_id);
    console.log("commentid: " + req.body.comment_id);

    ProductSchema.findById(req.body.product_id, (err, product) => {
        if (product == null || err) {
            res.status(501).send({ "message": "Product " + req.body.product_id + " not found." })
        }
        else {
            if (!err) {
                product.comments.remove(req.body.comment_id);
                product.save((err,product)=>{
                    res.status(200).send(product)
                });
            }
        }
    });
});

router.post('/:comment', function (req, res, next) {
    console.log("id: " + req.body._id);
    console.log("Email: " + req.body.userEmail);
    console.log("comment: " + req.params.comment);
    ProductSchema.findById(req.body._id, (err, product) => {
        if (product == null || err) {
            res.status(501).send({ "message": "Product " + req.body.pid + " not found." })
        }
        else {
            if (!err) {
                product.comments.push({ body: req.params.comment, userEmail: req.body.userEmail });
                product.save((err) => {
                    res.status(200).send(product);
                })
            }
        }
    });
});



module.exports = router;
