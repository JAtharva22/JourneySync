const express = require('express');
const path = require('path');
const List = require(path.resolve(__dirname, '../../models/List'));
const { validationResult } = require('express-validator');

const getlist = async (req, res) => {
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get the user's source and destination coordinates
        const { src, dest } = req.body;
        
        // Find items within 0.1 km from both source and destination
        const nearbyItems = await List.find({
            $and: [
                {
                    src: {
                        $geoWithin: {
                            $centerSphere: [src, 0.1 / 6371], // 0.1 km radius for source
                        },
                    },
                },
                {
                    dest: {
                        $geoWithin: {
                            $centerSphere: [dest, 0.1 / 6371], // 0.1 km radius for destination
                        },
                    },
                },
            ],
        });

        res.json(nearbyItems);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
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