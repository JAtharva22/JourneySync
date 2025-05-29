const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const path = require('path');
const Driver = require('../../models/Driver');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


const loginDriver = async (req, res) => {
    let success = false;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, driver.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }
        success = true;
        const data = {
            driver: {
                id: driver.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        // res.cookie('cookietoken', authtoken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'none',
        //   }).json("sended");
          
        res.json({ success, authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Internal Server Error" });
    }
}

module.exports = loginDriver