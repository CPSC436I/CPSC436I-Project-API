var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userTripSchema = new Schema({
  tripId: String,
  name: String,
  numberOfDays: Number,
  days: [
      { name: String,
        content: [
            {
            type: String
            }
        ]
     }
  ]
});

const userTrip = mongoose.model('userTrip', userTripSchema);

module.exports = userTrip;
