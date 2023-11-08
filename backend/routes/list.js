const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const List = require('../models/List');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Add a new List using: POST "/api/lists/addlist". Login required
router.post('/addlist', fetchuser, [
    body('src', 'Enter a valid source'),
    body('dest', 'Enter a valid destination'),
], async (req, res) => {
    try {
        const { src, dest } = req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the list to be created and if found return error
         const existingList = await List.findOne({ userId: req.user.id });
        if (existingList) {
            return res.status(200).send('Resource already exists');
        }

        const list = new List({
            src, dest, userId: req.user.id
        })
        const savedNote = await list.save()

        res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Update an existing List using: PUT "/api/lists/updatelist". Login required
router.put('/updatelist', fetchuser, async (req, res) => {
    const { src, dest } = req.body;
    try {
        // Create a newList object
        const newList = {};
        if (src) { newList.src = src };
        if (dest) { newList.dest = dest };

        // Find the list to be updated and update it
        let list = await List.findOne({ userId: req.user.id });
        if (!list) { return res.status(404).send("Not Found") }

        list = await List.findOneAndUpdate({ userId: req.user.id }, { $set: newList }, { new: true })

        res.json({ list });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Delete an existing Listitem using: DELETE "/api/lists/deletelist". Login required
router.delete('/deletelist', fetchuser, async (req, res) => {
    let success = false
    try {
        // Find the list item to be deleted
        const list = await List.findOne({ userId: req.user.id });
        // Check if the list item exists
        if (!list) {
            return res.status(404).json({success, message: "List Not Found" });
        }
        // Delete the list item
        await List.deleteOne({ userId: req.user.id });
        success = true
        res.json({ success, message: "List has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success, message : "Internal Server Error"});
    }
});


router.get('/getlist',fetchuser, [
    body('src', 'Enter a valid source'),
    body('dest', 'Enter a valid destination'),
], async (req, res) => {
    try {
        const { src, dest } = req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the list to be created and if found return error
         const existingList = await List.find({});
        
        res.json(existingList)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router