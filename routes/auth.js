const express = require('express')
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
const saltLevel = 10;
const JWT_SECRET = 'shhhhh';

//Route-1: To register new user 
router.post('/createuser',[body('name').isLength({ min: 1 }),body('email').isEmail(),body('password').isLength({ min: 5 })], 
async(req,res)=>{
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ email: req.body.email }).exec();
    // console.log(user);
    if(user){
      return res.status(400).json({ errors: "Sorry a user with this email alreadey exists." })
    }

    bcrypt.genSalt(saltLevel, async function(err, salt) {
      bcrypt.hash(req.body.password, salt, async function(err, hash) {
          // Store hash in your password DB.
          if(!err){
            let newUser = await User.create({
              name: req.body.name,
              email: req.body.email,
              password: hash,
            })
            // .then(user => console.log(user))
            .catch(e => res.send(e));
            const data = {
              user : {
                id: newUser.id
              }
            } 
            const userToken = jwt.sign(data, JWT_SECRET);
            // console.log(userToken);
            res.send({userToken: userToken});
          }
      });
    });
    
    // res.send("Hello I am /api/auth endpoint.")
})

//Route-2: To login existing user 
router.post('/login',[body('name').isLength({ min: 1 }),body('email').isEmail(),body('password').isLength({ min: 5 })], 
async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email }).exec();
    // console.log(user);
    if(!user){
      return res.status(400).json({ errors: "Sorry no user with this email exists." })
    }else{
      bcrypt.compare(req.body.password, user.password, function(err, resp) {        
        if(!err){
          if(resp) {
            const data = {
              user : {
                id: user.id
              }
            } 
            const userToken = jwt.sign(data, JWT_SECRET);
            // console.log(userToken);
            res.send({userToken: userToken});
          }
            // res.send("Welcome " + user.name);
          }
          else res.send("Sorry your password is not correct.");
      });
      
    }
    
});

//Route-3: To fetch details of logged in user after login
router.post('/getuser', fetchuser, async(req,res)=>{
  try{
    newUserId = req.user.id;
    const user = await User.findById(newUserId).select("-password");
    res.send(user);
  }catch(err){
    console.log(err);
    res.status(500).send("Internal server error.")
  }
});

module.exports = router;