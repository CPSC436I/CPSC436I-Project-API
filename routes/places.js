var express = require('express');
var axios = require('axios');
var router = express.Router();
const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});
let axiosInstance = axios.create({});

let nextPageToken = '';

async function compactPlace (place, query) {
  if (place.photos) {
    let photoObj;
    try {
      photoObj = await client.placePhoto({
        params: {
          photoreference: place.photos[0].photo_reference,
          key: 'AIzaSyAKDqQlGYP74UfAeSQDG6h9bKrN6hA0wAA',
          maxheight: 500
        },
        responseType: 'arraybuffer'
      }, axiosInstance);
    } catch (err) {
      photoObj = await client.placePhoto({
        params: {
          photoreference: place.photos[0].photo_reference,
          key: 'AIzaSyAKDqQlGYP74UfAeSQDG6h9bKrN6hA0wAA',
          maxheight: 500
        },
        responseType: 'arraybuffer'
      }, axiosInstance);
    }
    let url = 'https://' + photoObj.request.socket._host + photoObj.request.path;
    let shortenedUrl = photoObj.request.path.substr(3);
    let compactedPlaceObj = {
      id: shortenedUrl,
      name: place.name,
      photoUrl: url,
      tags: [query],
      mediaType: 'place'
    };
    if (compactedPlaceObj.name.length > 0 && compactedPlaceObj.photoUrl.length > 8) {
      return new Promise((resolve, reject) => {
        resolve(compactedPlaceObj);
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve({
          name: 'Random Photo',
          photoUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/types-of-flowers-1579719085.jpg?crop=0.671xw:1.00xh;0.189xw,0&resize=640:*'
        });
      });
    }
  }
}

async function getPlaceDetails (coordinates, query, pageToken = '') {
  let placeNearByObj = await client
    .placesNearby({
      params: {
        location: { lat: coordinates.lat, lng: coordinates.lng },
        key: 'AIzaSyAKDqQlGYP74UfAeSQDG6h9bKrN6hA0wAA',
        radius: 50000,
        keyword: 'attractions',
        inputtype: 'textquery',
        language: 'en',
        pagetoken: pageToken
      },
      timeout: 1000
    });
  let promiseArray = [];
  let potentialPageToken = placeNearByObj.data.next_page_token;
  if (potentialPageToken) {
    nextPageToken = potentialPageToken;
  } else {
    nextPageToken = '';
  }
  placeNearByObj.data.results.forEach(async (place, index) => {
    let photoObj = compactPlace(place, query);
    promiseArray.push(photoObj);
  });
  return Promise.all(promiseArray);
}

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
  console.log('1~~~~~~~~~ COORDINATES: ' + req.body.destination);
  let preCoordinates = await getPlaceCoordinates(req.body.destination);
  preCoordinates = preCoordinates.data.candidates;
  let coordinates = {};
  if (preCoordinates[0]) {
    coordinates.lat = preCoordinates[0].geometry.location.lat;
    coordinates.lng = preCoordinates[0].geometry.location.lng;
  }
  console.log('2~~~~~~~~~ COORDINATES: ' + coordinates.lat + ' AND ' + coordinates.lng);
  let response;
  console.log('3~~~~~~~~~ got here: ' + coordinates.lat + ' AND ' + coordinates.lng);
  if (req.body.nextPageToken === undefined) {
    console.log('4~~~~~~~~~ got here: ' + coordinates.lat + ' AND ' + coordinates.lng);
    response = await getPlaceDetails(coordinates, req.body.destination);
  } else {
    response = await getPlaceDetails(coordinates, req.body.destination, req.body.nextPageToken);

  }
  if (response.length > 0) {
    if (nextPageToken !== '') {
      return res.status(200).json({
        places: response,
        pageToken: nextPageToken
      });
    } else {
      return res.status(200).json({
        places: response
      });
    }
  } else {
    return res.status(400).json('Something went wrong');
  }
}
router.post('/', function (req, res, next) {
  callback(req, res);
});
module.exports = router;
