const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');


const loginDriver = require('../controllers/DriverAuthControllers/logindriver.js');
const registerDriver = require('../controllers/DriverAuthControllers/registerdriver.js');


// ROUTE 1: Create a Driver using: POST "/api/auth/createuser". No login required
router.post('/registerdriver', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], registerDriver);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login/driver', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], loginDriver);

module.exports = router;