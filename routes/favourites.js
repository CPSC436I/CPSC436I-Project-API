var express = require('express');
var router = express.Router();
const UserFavourite = require('../models/UserFavourite');
const passport = require('passport');

/* GET favourites listing. */
router.get('/', function(req, res, next) {
    UserFavourite.findOne({userId: req.user.googleId})
    .then(record => {
        if (record) {
            res.json(record.favourites);
        } else {
            res.json({});
        }
    })
});


/* POST a favourite */
router.post('/', function(req, res, next) {
    UserFavourite.findOne({userId: req.user.googleId})
    .then(record => {
        if (record) {
            record.favourites.push({...req.body});
            record.save();
            res.json(record);
        } else {
            let newRecord = new UserFavourite();
            newRecord.userId = req.user.googleId;
            newRecord.favourites.push({...req.body});
            newRecord.save();
            res.json(newRecord);
        }
    })
});

/* DELETE a favourite */
router.delete('/:id', function(req, res, next) {
    UserFavourite.findOne({userId: req.user.googleId})
    .then(record => {
        if (record) {
            let favourites = record.favourites;
            let index = favourites.findIndex(favourite => favourite.id === req.params.id);
            record.favourites.splice(index, 1);
            record.save()
            .then(() => {
                res.json({
                    message: 'item deleted succesfully'
                });
            });
        } else {
            res.json({
                error: 'no item to delete with this id'
            })
        }
    })
});

module.exports = router;
