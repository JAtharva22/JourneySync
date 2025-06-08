const express = require("express");
const router = express.Router();
const getLocationSuggestions = require("../controllers/suggestionControllers/getLocationSuggestions");
const getCoordinatesByPlaceId = require("../controllers/suggestionControllers/getCoordinatesByPlaceId");

router.get("/suggestions", getLocationSuggestions);
router.get("/coordinates", getCoordinatesByPlaceId);

module.exports = router;
