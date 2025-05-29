const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const fetchuser = require('../middleware/fetchuser');

const addlist  = require('../controllers/listControllers/addlist');
const updatelist  = require('../controllers/listControllers/updatelist');
const deletelist  = require('../controllers/listControllers/deletelist');
const getlist  = require('../controllers/listControllers/getlist');


// ROUTE 1: Add a new List using: POST "/api/lists/addlist". Login required
router.post('/addlist', fetchuser, [
    body('src', 'Enter a valid source'),
    body('dest', 'Enter a valid destination'),
], addlist);

// ROUTE 2: Update an existing List using: PUT "/api/lists/updatelist". Login required
router.put('/updatelist', fetchuser, [
    body('src', 'Enter a valid source'),
    body('dest', 'Enter a valid destination'),
], updatelist);

// ROUTE 3: Delete an existing Listitem using: DELETE "/api/lists/deletelist". Login required
router.delete('/deletelist', fetchuser, deletelist);

// ROUTE 4: Get an existing Listitem using: GET "/api/lists/getlist". Login required
router.post('/getlist',fetchuser, [
    body('src', 'Enter a valid source'),
    body('dest', 'Enter a valid destination'),
], getlist);

module.exports = router;