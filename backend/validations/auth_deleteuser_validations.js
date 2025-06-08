// Validation for deleting a user by ID
const { param } = require("express-validator");

const deleteUserValidation = [param("id", "Invalid user ID").isMongoId()];

module.exports = { deleteUserValidation };
