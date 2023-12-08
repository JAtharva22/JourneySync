const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const User = require('../models/User');


const updateuser = async (req, res) => {
   try {
      // Get the updated fields from the request body
      const { name, age } = req.body;

      // Create a new user object with the updated fields
      const updatedUser = {};
      if (name) updatedUser.name = name;
      if (age) updatedUser.age = age;

      // Update the user information in the database
      const user = await User.findOneAndUpdate(
         { _id: req.user.id }, // Assuming you have user's ID in req.user.id
         { $set: updatedUser },
         { new: true } // To return the updated user
      );

      if (!user) {
         return res.status(404).json({ success: false, error: "User not found" });
      }

      res.json({ success: true, user });
   } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
   }
}

export default updateuser