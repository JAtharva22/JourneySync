// Validation rules for driverauth.js routes
const { body } = require("express-validator");

const registerDriverValidation = [
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be atleast 5 characters").isLength({
    min: 5,
  }),
];

const loginDriverValidation = [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
];

module.exports = {
  registerDriverValidation,
  loginDriverValidation,
};
