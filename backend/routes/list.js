const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const List = require('../models/List');
const { body, validationResult } = require('express-validator');

// ROUTE 2: Add a new List using: POST "/api/lists/addlist". Login required
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
            const list = new List({
                src, dest, user: req.user.id
            })
            const savedNote = await list.save()

            res.json(savedNote)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    });

// ROUTE 3: Update an existing List using: PUT "/api/lists/updatelist". Login required
router.put('/updatelist/:id', fetchuser, async (req, res) => {
    const { src, dest } = req.body;
    try {
        // Create a newList object
        const newList = {};
        if (src) { newList.src = src };
        if (dest) { newList.dest = dest };

        // Find the list to be updated and update it
        let list = await List.findById(req.params.id);
        if (!list) { return res.status(404).send("Not Found") }

        if (list.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        list = await List.findByIdAndUpdate(req.params.id, { $set: newList }, { new: true })
        
        res.json({ list });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing Listitem using: DELETE "/api/lists/deletelistitem". Login required
router.delete('/deletelistitem/:id', fetchuser, async (req, res) => {
    try {
        // Find the list to be delete and delete it
        let list = await List.findById(req.params.id);
        if (!list) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this List
        if (list.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        list = await List.findByIdAndDelete(req.params.id)
        res.json({ "Success": "List has been deleted", list: list });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router
