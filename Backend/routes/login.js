const express = require('express');
const db = require('../db')
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET

//12/10/2024 add
// Promise wrapper for db.query
const queryAsync = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
};

//todo, create table if not exist
router.get('/user',(req,res) => {
  const sqlcommand = "SELECT * FROM user"
  db.query(sqlcommand,(err,data) => {
    if(err)     return res.json(err);
    return res.json(data)
  })
})
  
router.post('/register', async (req, res) =>
  {
    try{
      let {username, password, email} = req.body
      console.log(req.body)
      if (!username || !password) { //if no username in register input
        return res.status(400).json({ message: 'Username and password are required' });
      }
      // check that is this username alreadu register?
      const sqlcommand1 = 'SELECT * FROM user where User_Username = ?'
      const results = await queryAsync(sqlcommand1, [username]);
      if (results.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      //hashing password = more security
      const passwordhash = await bcrypt.hash(password,10)
      let userdata = {
        User_Username: username,
        User_Password: passwordhash,
        User_Email: email
      }
      console.log(userdata)
      const sqlcommand2 = 'INSERT into user SET ?'
      await db.query(sqlcommand2,[userdata])
      res.json({message: 'Inserted'})
    }
    catch (err)
    {
      console.log('err',err) 
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  })
  
router.post('/login', async (req, res) => {
    try{
      let {username, password} = req.body
      console.log(req.body)
      if (username && password) { //if in form has password, compare to database
        const sqlcommand1 = 'SELECT * FROM user where User_Username = ?'
        const results = await queryAsync(sqlcommand1, [username]);
        console.log(results)
        if (results.length > 0) { // Check if username exists in the database
          const hashcompare = await bcrypt.compare(password,results[0].User_Password)
          if(!hashcompare){
            return res.status(401).json({message: 'Password is wrong'})
          }
          else{ //check if its admin account??
            //generate jwt token
            const token = jsonwebtoken.sign({username: username, role: results[0].User_Role, user_id: results[0].User_ID}, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
            console.log(token)
            if(results[0].User_Role === 'Customer')
            {
              return res.status(200).json({message: 'Login as Customer', token})
            }
            if(results[0].User_Role === 'Admin')
            {
              return res.status(200).json({message: 'Login as Admin', token})
            }
          }
        } else {
          return res.status(401).json({ message: 'No user exist' });
        }
      }
      else
      {
        return res.status(401).json({ message: 'Username and password are required' });
      }
    }
    catch (err)
    {
      console.log('err', err) 
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

router.get('/getcurrentprofile/:userid', (req, res) => {
  const userid = req.params.userid
  try{
    const sqlcommand = 'SELECT * FROM user where User_ID = ?'
    db.query(sqlcommand,[userid], function(err,results){
      if(err) {res.send(err)}
      else {res.json(results)}
    })
  }
  catch(err)
  {
    console.log('err', err) 
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
})

module.exports = router;