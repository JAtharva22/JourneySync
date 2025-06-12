const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

var fetchuser = require("../middleware/fetchuser");
const createuser = require("../controllers/authControllers/createuser");
const loginuser = require("../controllers/authControllers/loginuser");
const getuserbyid = require("../controllers/authControllers/getuserbyid");
const updateuser = require("../controllers/authControllers/updateuser");
const updatePassword = require("../controllers/authControllers/updatepassword");
const deleteUser = require("../controllers/authControllers/deleteuser");
const authValidations = require("../validations/auth_validations");

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post("/createuser", authValidations.createUserValidation, createuser);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post("/login", authValidations.loginUserValidation, loginuser);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.get("/getuserbyid", fetchuser, getuserbyid);

// ROUTE 4: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.put("/updateuser", authValidations.updateUserValidation, fetchuser, updateuser);

// ROUTE 5: Allows a logged-in user to change their password: POST "/api/auth/update-password". Login required
router.post(
  "/updatepassword",
  fetchuser,
  authValidations.updatePasswordValidation,
  updatePassword
);

// ROUTE 6: Delete a user's profile using: DELETE "/api/users/:id"
router.delete("/deleteuser", fetchuser, deleteUser);

module.exports = router;
