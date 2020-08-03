const yelp = require('yelp-fusion');
var axios = require('axios');
const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});
let axiosInstance = axios.create({});
const yelpClient = yelp.client('IL2FAbCiYXXpcxEYV6PQVmLctUKFbk5kw-jNKFlx36oMrKjl87A2r6-h8Vs48JiCvyydd7bo0E6ftscdmBEEOC646YYsQCH70GitQwUpR3Yodoa-pAuQREa2LTIbX3Yx');
var express = require('express');
var router = express.Router();

let previousQueryCoordinates = {};

async function getPlaceCoordinates (location) {
  let coordinates = await client
    .findPlaceFromText({
      params: {
        input: location,
        inputtype: 'textquery',
        key: 'AIzaSyAKDqQlGYP74UfAeSQDG6h9bKrN6hA0wAA',
        fields: ['formatted_address', 'geometry']
      },
      timeout: 1000
    }, axiosInstance);
  return coordinates;
}

async function callback (req, res) {
  let officialCoordinates = {};
  if (!req.body.getMore) {
    getPlaceCoordinates(req.body.destination)
    .then(coord => {
      if (coord.data.candidates.length > 0) {
        officialCoordinates.lat = coord.data.candidates[0].geometry.location.lat;
        officialCoordinates.lng = coord.data.candidates[0].geometry.location.lng;
        previousQueryCoordinates.lat = coord.data.candidates[0].geometry.location.lat;
        previousQueryCoordinates.lng = coord.data.candidates[0].geometry.location.lng;
      }
      yelpClient.search({
        latitude: officialCoordinates.lat,
        longitude: officialCoordinates.lng,
        term: 'food',
        limit: 50,
        radius: 40000
      }).then(response => {
        let restaurants = [];
        response.jsonBody.businesses.forEach(rest => {
          let restaurantObj = {
            name: rest.name,
            id: rest.id,
            photoUrl: rest.image_url,
            tags: [req.body.destination],
            mediaType: 'restaurant'
          };
          restaurants.push(restaurantObj);
        });
        return res.status(200).json({
          restaurants: restaurants
        });
      }).catch(e => {
          return res.status(400).json('Something went wrong');
        });
      });
  } else {
    yelpClient.search({
      latitude: previousQueryCoordinates.lat,
      longitude: previousQueryCoordinates.lng,
      term: 'food',
      limit: 50,
      radius: 40000,
      offset: 50
    }).then(response => {
      let restaurants = [];
      response.jsonBody.businesses.forEach(rest => {
        let restaurantObj = {
          name: rest.name,
          id: rest.id,
          photoUrl: rest.image_url,
          tags: [req.body.destination],
          mediaType: 'restaurant'
        };
        restaurants.push(restaurantObj);
      });
      return res.status(200).json({
        restaurants: restaurants
      });
    }).catch(e => {
        return res.status(400).json('Something went wrong');
      });
  }
}    
router.post('/', function (req, res, next) {
  callback(req, res);
});
module.exports = router;