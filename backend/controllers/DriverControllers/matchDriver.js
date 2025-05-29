const { validationResult } = require('express-validator');
const DriverList = require('../../models/DriverList');
require('dotenv').config();

const matchDriverFromList = async (req, res) => {
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() });
        }

        // Extract user data from request body
        const { country, state, city, vehicleType, src, range } = req.body;
        console.log(req.body)

        // Find a driver that matches the criteria
        const closestDriver = await DriverList.findOne({
            country,
            state,
            city,
            vehicleType: vehicleType,
            isBusy: false,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: src,
                    },
                    $maxDistance: range, // Adjust the maximum distance in meters
                },
            },
        }).sort({ location: 1 });

        
        if (!closestDriver){
            return res.status(400).json({ message: "no driver found" });
        }

        const foundDriver = await DriverList.findOne({ driverId: closestDriver.driverId })
            .populate('driverId').exec();

        res.status(200).json(foundDriver);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = matchDriverFromList;


// const googleMapsClient = require('@google/maps').createClient({
//     key: process.env.MAPS_API_KEY,
//     Promise: Promise
// });

// async function getDistance(origin, destination) {
//     try {
//         const response = await googleMapsClient.distanceMatrix({
//             origins: [origin],
//             destinations: [destination],
//             mode: 'driving',
//         }).asPromise();

//         if (response.json.rows[0].elements[0].status === 'OK') {
//             const distance = response.json.rows[0].elements[0].distance.text;
//             console.log(distance);
//             return distance;
//         } else {
//             throw new Error('Unable to retrieve distance information');
//         }
//     } catch (err) {
//         console.error(err.message);
//         throw err;
//     }
// }