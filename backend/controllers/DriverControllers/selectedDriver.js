const path = require('path');
const DriverList = require('../../models/DriverList');

const selectedDriver = async (req, res) => {
    try {
        // Find the driver list entry to be updated
        const existingDriverList = await DriverList.findOne({ driverId: req.driver.id });

        // If the driver list entry doesn't exist, return a 404 error
        if (!existingDriverList) {
            return res.status(404).send("Not Found");
        }

        // Toggle the value of isBusy
        existingDriverList.isBusy = !existingDriverList.isBusy;
        
        // Save the updated driver list entry
        const updatedDriverList = await existingDriverList.save();

        // Respond with the updated driver list entry
        res.json(updatedDriverList);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = selectedDriver;
