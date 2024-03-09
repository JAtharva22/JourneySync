const express = require('express');
const path = require('path');
const List = require(path.resolve(__dirname, '../../models/List'));
const { body, validationResult } = require('express-validator');

const addlist = async (req, res) => {
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
            src: {
                type: 'Point',
                coordinates: src, // array [longitude, latitude]
            },
            dest: {
                type: 'Point',
                coordinates: dest, // array [longitude, latitude]
            },
            userId: req.user.id,
        });

        const savedList = await list.save();

        res.json(savedList);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = addlist;


// const addlist = async (req, res) => {
//     try {
//         const { src, dest } = req.body;

//         // If there are errors, return Bad request and the errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         // Find the list to be created and if found return error
//         const existingList = await List.findOne({ userId: req.user.id });
//         if (existingList) {
//             return res.status(200).send('Resource already exists');
//         }

//         const list = new List({
//             src, dest, userId: req.user.id
//         })
//         const savedNote = await list.save()

//         res.json(savedNote)

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// }

// module.exports = addlist;