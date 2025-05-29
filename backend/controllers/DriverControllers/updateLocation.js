const path = require('path');
const { validationResult } = require('express-validator');
const DriverList = require('../../models/DriverList');

const updateDriverLocationInList = async (req, res) => {
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the driver list entry to be created and if not found, return error
        const existingDriverList = await DriverList.findOneAndUpdate(
            { driverId: req.driver.id },
            {
                $set: {
                    location: {
                        type: 'Point',
                        coordinates: req.body.src, // array [longitude, latitude]
                    },
                    lastLocationUpdateTime: Date.now()
                }
            },
            { new: true }
        );

        if (!existingDriverList) {
            return res.status(404).send("Not Found");
        }

        res.json(existingDriverList);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = updateDriverLocationInList;
