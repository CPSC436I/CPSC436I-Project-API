var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// var favouriteSchema = new Schema({
//   id: String, // String is shorthand for {type: String}
//   url: String,
//   mediaType: String,
//   title: String,
//   location: String,
//   comment: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
// });

var userFavouriteSchema = new Schema({
  userId: String,
  favourites: Array
});

// const Favourite = mongoose.model('Favourite', favouriteSchema);
const UserFavourite = mongoose.model('UserFavourite', userFavouriteSchema);

module.exports = UserFavourite;
