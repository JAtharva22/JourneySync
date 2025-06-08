const express = require("express");
const router = express.Router();

const driverauthValidations = require("../validations/driverauth_validations");

const loginDriver = require("../controllers/DriverAuthControllers/logindriver.js");
const registerDriver = require("../controllers/DriverAuthControllers/registerdriver.js");

// ROUTE 1: Create a Driver using: POST "/api/auth/createuser". No login required
router.post(
  "/registerdriver",
  driverauthValidations.registerDriverValidation,
  registerDriver
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login/driver",
  driverauthValidations.loginDriverValidation,
  loginDriver
);

module.exports = router;
