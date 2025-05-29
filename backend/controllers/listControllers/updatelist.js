const express = require('express');
const path = require('path');
const List = require(path.resolve(__dirname, '../../models/List'));
const { body, validationResult } = require('express-validator');

const updatelist = async (req, res) => {
    try {
        const { src, dest } = req.body;
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
}

module.exports = updatelist;