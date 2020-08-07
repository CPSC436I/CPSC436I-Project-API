var express = require('express');
const { google } = require('googleapis');
var router = express.Router();
let YOUTUBE_API_KEY = process.env.Youtube_apiKey;

async function query (req) {
  const youtube = google.youtube({
    version: 'v3',
    auth: YOUTUBE_API_KEY
  });
  if (req.body.nextPageToken === '') {
    const response = await youtube.search.list({
      part: 'id,snippet',
      fields: 'items/id,nextPageToken',
      q: `travel ${req.body.destination}`,
      maxResults: 6
    });
    return response;
  } else {
    const response = await youtube.search.list({
      part: 'id,snippet',
      fields: 'items/id,nextPageToken',
      q: `travel ${req.body.destination}`,
      maxResults: 12,
      pageToken: req.body.nextPageToken
    });
    return response;
  }
  
}

async function callback (req, res) {
  let response = await query(req);
  let idArray = response.data.items.map(videoObj => videoObj.id.videoId);
  return res.status(200).json({
    ids: idArray,
    nextPageToken: response.data.nextPageToken
  });
}

router.post('/', function (req, res, next) {
  callback(req, res);
});

module.exports = router;
