const { validationResult } = require('express-validator');
const DriverList = require('../../models/Uber/DriverList');
require('dotenv').config();

const matchDriver = async (req, res) => {
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.body;

        // Get the distance
        // const distance = await getDistance(user.src, user.dest);

        // Find drivers within 0.1 km from the user's source location
        const closestDriver = await DriverList.findOne({
            $and: [
                {
                    country: user.country,
                    state: user.state,
                    city: user.city,
                    vehicleType: user.VehicleType,
                    isBusy: false,
                    distanceAvailable: { $lte: user.distance },
                    location: {
                        $near: {
                            $geometry: {
                                type: 'Point',
                                coordinates: user.src,
                            },
                            $maxDistance: 500, // Adjust the maximum distance in meters (0.1 km = 100 meters)
                        },
                    },
                },
            ],
        }).sort({ location: 1 });

        const foundDocument = await DriverList.findOne({ driverId: closestDriver.driverId })
            .populate('driverId') // Populate the 'driverId' field with the corresponding data from the 'Driver' collection
            .exec();

        res.json(foundDocument);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = matchDriver;


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