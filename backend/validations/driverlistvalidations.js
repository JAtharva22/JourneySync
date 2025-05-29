
const { body, validationResult } = require('express-validator');

const addDriverValidation = [
    body('vehicleType','Enter valid vehicle type'),
    body('distanceAvailable','Enter valid '),
    body('country','Enter valid country'),
    body('state','Enter valid state'),
    body('city','Enter valid city'),
    body('location','Enter valid location')
]

const matchDriverValidation = [
    body('vehicleType','Enter valid vehicle type'),
    body('isBusy','Specify if driver is busty or not'),
    body('country','Enter valid country'),
    body('state','Enter valid state'),
    body('city','Enter valid city'),
    body('location','Enter valid location'),
    body('range', 'specify range')
]


module.exports = {addDriverValidation, matchDriverValidation};