const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const path = require('path');
const User = require(path.resolve(__dirname, '../../models/User'));

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


const createuser = async (req, res) => {

   let success = false;
   // If there are errors, return Bad request and the errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
   }
   try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
         return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
         name: req.body.name,
         password: secPass,
         email: req.body.email,
         age: req.body.age,
         gender: req.body.gender,
         phone: req.body.phone
      });
      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json(user)
      res.json({ success, authtoken })

   } catch (error) {
      console.error(error.message);
      res.status(500).json({ success, error: "Internal Server Error" });
   }
}

module.exports =  createuser;