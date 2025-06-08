const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const fetchdriver = require("../middleware/fetchdriver");
const fetchuser = require("../middleware/fetchuser");
const driverlistValidations = require("../validations/driverlist_validations");

const addDriver = require("../controllers/DriverControllers/addDriver");
const deleteDriverFromList = require("../controllers/DriverControllers/deleteDriver");
const updateDriverLocationInList = require("../controllers/DriverControllers/updateLocation");
const selectedDriver = require("../controllers/DriverControllers/selectedDriver");
const matchDriverFromList = require("../controllers/DriverControllers/matchDriver");

router.post(
  "/adddriverinlist",
  fetchdriver,
  driverlistValidations.addDriverValidation,
  addDriver
);

router.post(
  "/matchdriverfromlist",
  fetchuser,
  driverlistValidations.matchDriverValidation,
  matchDriverFromList
);

router.put(
  "/updatedriverlocationinlist",
  fetchdriver,
  driverlistValidations.updateDriverLocationValidation,
  updateDriverLocationInList
);

router.put("/updatedrivertobusyinlist", fetchdriver, selectedDriver);

router.delete("/deletedriverfromlist", fetchdriver, deleteDriverFromList);

module.exports = router;
