const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const path = require('path');
const Driver = require('../../models/Driver');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// const { name, email, password, vehicleName, vehicleType, vehicleNoPlate, vehicleColor, driver_license, luggage, isBusy, location, country, state, city, lastLocationUpdateTime, date
// } = req.body;
// console.log(name, email, password, vehicleName, vehicleType, vehicleNoPlate, vehicleColor, driver_license, luggage, isBusy, location, country, state, city, lastLocationUpdateTime, date
// );

const registerDriver = async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        // Check whether the driver with this email exists already
        let driver = await Driver.findOne({ email: req.body.email });
        if (driver) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new driver
        driver = await Driver.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
            phone: req.body.phone,
            vehicleName: req.body.vehicleName,
            vehicleType: req.body.vehicleType,
            vehicleNoPlate: req.body.vehicleNoPlate,
            vehicleColor: req.body.vehicleColor,
            license: req.body.license,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city
        });
        const data = {
            driver: {
                id: driver.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }

};

module.exports = registerDriver;