const express = require('express');
const path = require('path');
const List = require(path.resolve(__dirname, '../../models/List'));
const { body, validationResult } = require('express-validator');

const getlist = async (req, res) => {
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
}

module.exports = getlist;