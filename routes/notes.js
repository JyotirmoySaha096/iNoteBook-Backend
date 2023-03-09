const express = require('express')
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Note = require("../models/Notes");
const router = express.Router();

// Route-1: Get all the notes after login using the auth-token
router.get('/fetchallnotes',fetchuser, async(req,res)=>{
    const notes = await Note.find({user: req.user.id});
    res.json(notes);
})

// Route-2: Add a new note after login using the auth-token
router.post('/fetchallnotes',fetchuser,[body('title').isLength({ min: 1 }),body('description').isLength({ min: 6})], 
async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let notes = await Note.create({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag
      })
    res.json(notes);
})

module.exports = router;