const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

var fetchuser = require('../middleware/fetchuser');
const createuser  = require('../controllers/authControllers/createuser');
const loginuser  = require('../controllers/authControllers/loginuser');
const getuserbyid  = require('../controllers/authControllers/getuserbyid');
const updateuser  = require('../controllers/authControllers/updateuser');


// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
    body('age', 'Age must be a positive number').isInt({ min: 10, max: 150 }),
    body('gender', 'Invalid gender').isIn(['Male', 'Female', 'Other']),
], createuser);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], loginuser);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.get('/getuserbyid', fetchuser, getuserbyid);

// ROUTE 4: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.put('/updateuser', fetchuser, updateuser);

module.exports = router;