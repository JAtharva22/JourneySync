const express = require("express");
const path = require("path");
const List = require(path.resolve(__dirname, "../../models/List"));
const User = require(path.resolve(__dirname, "../../models/User"));
const { validationResult } = require("express-validator");
const getCoordinatesByPlaceId = require(path.resolve(
  __dirname,
  "../suggestionControllers/getCoordinatesByPlaceId"
));

const getlist = async (req, res) => {
  try {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the user's source and destination coordinates
    const { src, dest, filterDistance } = req.body;

    // Process source coordinates
    let sourceCoords;
    if (src.place_id) {
      const coords = await getCoordinatesByPlaceId(src.place_id);
      sourceCoords = [coords.longitude, coords.latitude];
    } else if (src.coordinates) {
      sourceCoords = [src.coordinates.lng, src.coordinates.lat];
    } else {
      return res.status(400).json({ error: "Invalid source data" });
    }

    // Process destination coordinates
    let destCoords;
    if (dest.place_id) {
      const coords = await getCoordinatesByPlaceId(dest.place_id);
      destCoords = [coords.longitude, coords.latitude];
    } else {
      return res
        .status(400)
        .json({ error: "Destination place_id is required" });
    }

    // Find items within filterDistance km from both source and destination
    const nearbyItems = await List.find({
      $and: [
        {
          src: {
            $geoWithin: {
              $centerSphere: [sourceCoords, filterDistance / 6371], // filterDistance km radius for source
            },
          },
        },
        {
          dest: {
            $geoWithin: {
              $centerSphere: [destCoords, filterDistance / 6371], // filterDistance km radius for destination
            },
          },
        },
      ],
    });

    // Filter out documents with userId equal to req.user.id
    const filteredItems = nearbyItems.filter(
      (item) => item.userId.toString() != req.user.id
    );
    
    const itemsWithUser = await Promise.all(
      filteredItems.map(async (item) => {
        const user = await User.findById(item.userId).select("-password").lean();
        return { ...item.toObject(), user };
      })
    );
    
    res.json(itemsWithUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = getlist;

// function haversineDistance(coord1, coord2) {
//     const R = 6371; // Radius of the Earth in kilometers
//     const lat1 = (coord1.lat * Math.PI) / 180;
//     const lat2 = (coord2.lat * Math.PI) / 180;
//     const lon1 = (coord1.lng * Math.PI) / 180;
//     const lon2 = (coord2.lng * Math.PI) / 180;

//     const dLat = lat2 - lat1;
//     const dLon = lon2 - lon1;

//     const a =
//         Math.sin(dLat / 2) ** 2 +
//         Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     const distance = R * c; // Distance in kilometers

//     return distance;
// }
