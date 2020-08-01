var express = require('express');
var router = express.Router();
const UserTrip = require('../models/UserTrip');
const passport = require('passport');

/* GET trips listing. */
router.get('/', function(req, res, next) {
    UserTrip.findOne({userId: req.user.googleId})
    .then(record => {
        if (record) {
            res.json(record.trips);
        } else {
            res.json({});
        }
    })
});


/* POST a trip */
router.post('/', function(req, res, next) {
    UserTrip.findOne({userId: req.user.googleId})
    .then(record => {
        if (record) {
            record.trips.push({...req.body});
            record.save();
            res.json(record);
        } else {
            let newRecord = new UserTrip();
            newRecord.userId = req.user.googleId;
            newRecord.trips.push({...req.body});
            newRecord.save();
            res.json(newRecord);
        }
    })
});

/* DELETE a trip */
router.delete('/:id', function(req, res, next) {
    UserTrip.findOne({userId: req.user.googleId})
    .then(record => {
        if (record) {
            let trips = record.trips;
            let index = trips.findIndex(trip => trip.id === req.params.id);
            record.trips.splice(index, 1);
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
