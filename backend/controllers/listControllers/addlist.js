const express = require('express');
const List = require('../models/List');
const { body, validationResult } = require('express-validator');

const addlist = async (req, res) => {
   try {
       const { src, dest } = req.body;

       // If there are errors, return Bad request and the errors
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
       }

       // Find the list to be created and if found return error
        const existingList = await List.findOne({ userId: req.user.id });
       if (existingList) {
           return res.status(200).send('Resource already exists');
       }

       const list = new List({
           src, dest, userId: req.user.id
       })
       const savedNote = await list.save()

       res.json(savedNote)

   } catch (error) {
       console.error(error.message);
       res.status(500).send("Internal Server Error");
   }
}

export default addlist;