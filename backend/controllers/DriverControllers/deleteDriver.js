const express = require('express');
const path = require('path');
const { body, validationResult } = require('express-validator');
const DriverList = require('../../models/DriverList');

const deleteDriverFromList = async (req, res) => {
    let success = false
    try {
        // Find the list item to be deleted
        const driver = await DriverList.findOne({ driverId: req.driver.id });
        // Check if the list item exists
        if (!driver) {
            return res.status(404).json({ success, message: "Driver Not Found" });
        }
        // Delete the list item
        await DriverList.deleteOne({ driverId: req.driver.id });
        success = true
        res.json({ success, message: "List has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, message: "Internal Server Error" });
    }
}

module.exports = deleteDriverFromList;