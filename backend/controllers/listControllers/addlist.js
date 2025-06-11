const express = require('express');
const path = require('path');
const List = require(path.resolve(__dirname, '../../models/List'));
const { body, validationResult } = require('express-validator');
const getCoordinatesByPlaceId = require(path.resolve(__dirname, '../suggestionControllers/getCoordinatesByPlaceId'));

const addlist = async (req, res) => {
    try {
        const { src, dest } = req.body;

        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check for existing list
        const existingList = await List.findOne({ userId: req.user.id });
        if (existingList) {
            return res.status(200).send('Resource already exists');
        }

        // Process source coordinates
        let sourceCoords;
        if (src.place_id) {
            const coords = await getCoordinatesByPlaceId(src.place_id);
            sourceCoords = [coords.longitude, coords.latitude];
        } else if (src.coordinates) {
            sourceCoords = [src.coordinates.lng, src.coordinates.lat];
        } else {
            return res.status(400).json({ error: "Invalid source data" });
        }

        // Process destination coordinates
        let destCoords;
        if (dest.place_id) {
            const coords = await getCoordinatesByPlaceId(dest.place_id);
            destCoords = [coords.longitude, coords.latitude];
        } else {
            return res.status(400).json({ error: "Destination place_id is required" });
        }

        // Create new list
        const list = new List({
            src: {
                type: 'Point',
                coordinates: sourceCoords,
            },
            dest: {
                type: 'Point',
                coordinates: destCoords,
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
