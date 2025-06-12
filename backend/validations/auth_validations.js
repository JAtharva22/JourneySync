// Validation rules for auth.js routes
const { body } = require("express-validator");

const createUserValidation = [
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be atleast 5 characters").isLength({
    min: 5,
  }),
  body("age", "Age must be a positive number").isInt({ min: 10, max: 150 }),
  body("gender", "Invalid gender").isIn(["Male", "Female", "Other"]),
];

const loginUserValidation = [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
];

const updateUserValidation = [
  body("name", "Enter a valid name").isLength({ min: 3 }).optional(),
  body("email", "Enter a valid email").isEmail().optional(),
  body("age", "Age must be a positive number").isInt({ min: 10, max: 150 }).optional(),
];

const updatePasswordValidation = [
  body("currentPassword", "Current password is required")
    .exists()
    .isLength({ min: 5 }),
  body("newPassword", "New password must be at least 5 characters").isLength({
    min: 5,
  }),
];

module.exports = {
  createUserValidation,
  loginUserValidation,
  updateUserValidation,
  updatePasswordValidation
};
