const express = require('express');
const path = require('path');
const List = require(path.resolve(__dirname, '../../models/List'));
const { body, validationResult } = require('express-validator');

const deletelist = async (req, res) => {
    let success = false
    try {
        // Find the list item to be deleted
        const list = await List.findOne({ userId: req.user.id });
        // Check if the list item exists
        if (!list) {
            return res.status(404).json({ success, message: "List Not Found" });
        }
        // Delete the list item
        await List.deleteOne({ userId: req.user.id });
        success = true
        res.json({ success, message: "List has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, message: "Internal Server Error" });
    }
}

module.exports = deletelist;