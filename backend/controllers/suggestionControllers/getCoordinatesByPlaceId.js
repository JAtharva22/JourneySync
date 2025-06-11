const googleMapsClient = require("@google/maps").createClient({
  key: process.env.MAPS_API_KEY,
  Promise: Promise,
});

async function getCoordinatesByPlaceId(place_id) {
  if (!place_id) {
    throw new Error("Place ID is required");
  }

  const response = await googleMapsClient
    .reverseGeocode({ place_id })
    .asPromise();

  const result = response.json.results[0];
  if (!result) {
    throw new Error("Location not found");
  }

  const { lat, lng } = result.geometry.location;
  return { latitude: lat, longitude: lng };
}

module.exports = getCoordinatesByPlaceId;
