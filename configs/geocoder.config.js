const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_KEY,
  formatter: null,
});

module.exports = geocoder;