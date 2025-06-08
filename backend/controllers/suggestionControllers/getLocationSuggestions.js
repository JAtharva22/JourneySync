// Initialize Google Maps client only once at module load
const googleMapsClient = require("@google/maps").createClient({
  key: process.env.MAPS_API_KEY,
  Promise: Promise,
});

const getLocationSuggestions = async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) {
      return res.status(400).json({ error: "Input parameter is required" });
    }
    const response = await googleMapsClient
      .placesAutoComplete({
        input: input,
        types: "geocode",
      })
      .asPromise();
    const suggestions = response.json.predictions.map((prediction) => ({
      name: prediction.description,
      place_id: prediction.place_id,
    }));
    res.json(suggestions);
  } catch (error) {
    console.error("Google Maps API error:", error);
    res.status(500).json({ error: "Failed to fetch location suggestions" });
  }
};

module.exports = getLocationSuggestions;
