const express = require("express");
const router = express.Router();

const fetchuser = require("../middleware/fetchuser");

const addlist = require("../controllers/listControllers/addlist");
const updatelist = require("../controllers/listControllers/updatelist");
const deletelist = require("../controllers/listControllers/deletelist");
const getlist = require("../controllers/listControllers/getlist");
const listValidations = require("../validations/list_validations");

// ROUTE 1: Add a new List using: POST "/api/lists/addlist". Login required
router.post("/addlist", fetchuser, listValidations.addListValidation, addlist);

// ROUTE 2: Update an existing List using: PUT "/api/lists/updatelist". Login required
router.put(
  "/updatelist",
  fetchuser,
  listValidations.updateListValidation,
  updatelist
);

// ROUTE 3: Delete an existing Listitem using: DELETE "/api/lists/deletelist". Login required
router.delete("/deletelist", fetchuser, deletelist);

// ROUTE 4: Get an existing Listitem using: GET "/api/lists/getlist". Login required
router.post("/getlist", fetchuser, listValidations.getListValidation, getlist);

module.exports = router;
