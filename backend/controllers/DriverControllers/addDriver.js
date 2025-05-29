const express = require('express');
const path = require('path');
const { body, validationResult } = require('express-validator');
const DriverList = require('../../models/DriverList');


const addDriver = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the driver list entry to be created and if found, return error
        const existingDriverListEntry = await DriverList.findOne({ driverId: req.driver.id });
        if (existingDriverListEntry) {
            return res.status(200).send('Resource already exists');
        }

        const driverListEntry = new DriverList({
            driverId: req.driver.id,
            vehicleType: req.body.vehicleType,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            location: {
                type: 'Point',
                coordinates: req.body.location, // array [longitude, latitude]
            },
        });

        const savedDriverListEntry = await driverListEntry.save();

        res.json(savedDriverListEntry);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = addDriver;
