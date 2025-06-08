// Validation rules for list.js routes
const { body } = require("express-validator");

const addListValidation = [
  body("src", "Enter a valid source"),
  body("dest", "Enter a valid destination"),
];

const updateListValidation = [
  body("src", "Enter a valid source"),
  body("dest", "Enter a valid destination"),
];

const getListValidation = [
  body("src", "Enter a valid source"),
  body("dest", "Enter a valid destination"),
];

module.exports = {
  addListValidation,
  updateListValidation,
  getListValidation,
};
