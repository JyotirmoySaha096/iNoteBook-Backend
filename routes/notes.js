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
router.post('/addnewnote',fetchuser,[body('title').isLength({ min: 3 }),body('description').isLength({ min: 4})], 
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

// Route-3: Update an existing note after login using the auth-token
router.put('/updatenote/:id',fetchuser, async(req,res)=>{
     const {title, description, tag} = req.body;

    const note = await Note.findById(req.params.id);
    if(!note) return res.status(404).send("Not found.");

    let newNote = {};
    if(title) newNote = {...newNote, title: title};
    if(description) newNote = {...newNote, description: description};
    if(tag) newNote = {...newNote, tag: tag};
    if(req.user.id !== note.user.toString()) return res.status(401).send("Action not allowed.");
    await Note.findByIdAndUpdate(req.params.id,newNote)
    res.status(200).send("Successfully updated the note.");
})

// Route-4: Delete an existing note after login using the auth-token
router.delete('/deletenote/:id',fetchuser, async(req,res)=>{

 const note = await Note.findById(req.params.id);
 if(!note) return res.status(404).send("Not found.");

 if(req.user.id !== note.user.toString()) return res.status(401).send("Action not allowed.");
 await Note.findByIdAndDelete(req.params.id)
 res.status(200).send("Successfully deleted the note.");
})

module.exports = router;