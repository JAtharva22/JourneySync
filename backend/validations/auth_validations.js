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
  body("isVerified", "isVerified must be 'pending'").optional().custom((value) => {
    if (value !== "pending") {
      throw new Error("isVerified must be 'pending'");
    }
    return true;
  }),
];

const updatePasswordValidation = [
  body("currentPassword", "Current password is required")
    .exists()
    .isLength({ min: 5 }),
  body("newPassword", "New password must be at least 5 characters")
    .isLength({ min: 5 }),
  body("confirmNewPassword", "Confirm new password must match new password")
    .exists()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New password and confirm new password do not match");
      }
      return true;
    }),
  body("newPassword", "New password must be different from current password")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),
];

module.exports = {
  createUserValidation,
  loginUserValidation,
  updateUserValidation,
  updatePasswordValidation
};
