const googleMapsClient = require("@google/maps").createClient({
  key: process.env.MAPS_API_KEY,
  Promise: Promise,
});

const getCoordinatesByPlaceId = async (req, res) => {
  try {
    const { place_id } = req.query;
    if (!place_id) {
      return res.status(400).json({ error: "Place ID is required" });
    }

    // Use the .reverseGeocode() method, not .geocode()
    const response = await googleMapsClient
      .reverseGeocode({
        place_id: place_id,
      })
      .asPromise(); // .asPromise() is correct for this library version

    // The first result should contain the geometry
    const result = response.json.results[0];
    if (!result) {
      return res.status(404).json({ error: "Location not found" });
    }

    const { lat, lng } = result.geometry.location;
    res.json({ latitude: lat, longitude: lng });

  } catch (error) {
    console.error("Google Maps API error:", error);
    res.status(500).json({ error: "Failed to fetch coordinates" });
  }
};

module.exports = getCoordinatesByPlaceId;