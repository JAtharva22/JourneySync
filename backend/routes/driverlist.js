const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const fetchdriver = require('../middleware/fetchdriver');
const DriverListValidation = require('../validations/driverlistvalidations');
const addDriver = require('../controllers/driverControllers/addDriver');
const deleteDriverFromList = require('../controllers/driverControllers/deleteDriver');
const updateDriverLocationInList = require('../controllers/driverControllers/updateLocation');
const selectedDriver = require('../controllers/driverControllers/selectedDriver');
const matchDriverFromList = require('../controllers/driverControllers/matchDriver');
const fetchuser = require('../middleware/fetchuser');

router.post('/adddriverinlist', fetchdriver, DriverListValidation.addDriverValidation, addDriver);

router.post('/matchdriverfromlist', fetchuser, DriverListValidation.matchDriverValidation,  matchDriverFromList);

router.put('/updatedriverlocationinlist', fetchdriver, [
    body('src', 'Enter a valid source'),
], updateDriverLocationInList);

router.put('/updatedrivertobusyinlist', fetchdriver, selectedDriver);

router.delete('/deletedriverfromlist', fetchdriver, deleteDriverFromList);


module.exports = router;