var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userFavouriteSchema = new Schema({
  userId: String,
  favourites: Array,
  trips: Array
});

let trip = {
  _id: "",
  name: "",
  numberofdays: 1,
  days: [
    {
      name: "day name",
      content: [
        {
          type: 'id'
        }
      ]
    }
  ]
}

// const Favourite = mongoose.model('Favourite', favouriteSchema);
const UserFavourite = mongoose.model('UserFavourite', userFavouriteSchema);

module.exports = UserFavourite;
