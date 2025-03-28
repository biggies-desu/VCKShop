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

router.post('/register', async (req, res) =>
  {
    try{
      let {username, password} = req.body
      console.log(req.body)
      if (!username || !password) { //if no username in register input
        return res.status(400).json({ message: 'Username and password are required' });
      }
      // check that is this username alreadu register?
      const sqlcommand1 = 'SELECT * FROM User where User_Username = ?'
      const results = await queryAsync(sqlcommand1, [username]);
      if (results.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      //hashing password = more security
      const passwordhash = await bcrypt.hash(password,10)
      let userdata = {
        User_Username: username,
        User_Password: passwordhash,
      }
      console.log(userdata)
      const sqlcommand2 = 'INSERT into User SET ?'
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
        const sqlcommand1 = 'SELECT * FROM User where User_Username = ?'
        const results = await queryAsync(sqlcommand1, [username]);
        console.log(results)
        if (results.length > 0) { // Check if username exists in the database
          const hashcompare = await bcrypt.compare(password,results[0].User_Password)
          if(!hashcompare){
            return res.status(401).json({message: 'Password is wrong'})
          }
          else{ //check if its admin account??
            //generate jwt token
            const token = jsonwebtoken.sign({username: username, role: results[0].Role_ID, user_id: results[0].User_ID, user_password: results[0].User_Password}, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
            console.log(token)
            if(results[0].Role_ID === 1)
              {
                return res.status(200).json({message: 'Login as Admin', token})
              }
            if(results[0].Role_ID === 2)
            {
              return res.status(200).json({message: 'Login as Customer', token})
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
    const sqlcommand = 'SELECT * FROM User where User_ID = ?'
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

router.put('/updateprofile/:userid',(req,res) =>
{
  const userid = req.params.userid
  
  const firstname = req.body.firstname === "" ? null : req.body.firstname;
  const lastname = req.body.lastname === "" ? null : req.body.lastname;
  const email = req.body.email === "" ? null : req.body.email;
  const telephone = req.body.telephone === "" ? null : req.body.telephone;
  
  console.log(req.body)
  
  try{
    const sqlcommand = 'UPDATE User SET User_Firstname = ?, User_Lastname = ?, User_Email = ?, User_Telephone = ? WHERE User_ID = ?'
    db.query(sqlcommand,[firstname,lastname,email,telephone,userid], function(err, results)
    {
      if (err){
        res.send(err)
      }
      else{
        res.json(results)
      }
    })
  }
  catch(err)
  {
    console.log('err',err)
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
})


router.post('/changepassword/:id', async (req, res) => {
  const { newpassword, confirmnewpassword, oldhashpassword, role } = req.body;
  const userid = req.params.id;

  console.log(req.body)

  try {
    const sqlcommand1 = 'SELECT * FROM User WHERE User_ID = ?';
    const results = await queryAsync(sqlcommand1, [userid]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Something went wrong' });
    }
    if (newpassword !== confirmnewpassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if(role === 1)
      {
        const newpasswordhash = await bcrypt.hash(newpassword,10)
        console.log(newpasswordhash)
        const sqlcommand2 = 'UPDATE User SET User_Password = ? WHERE User_ID = ?';
        const results2 = await queryAsync(sqlcommand2, [newpasswordhash, userid]);
        res.status(200).json({ message: 'Password updated successfully' });
      }
    if(role === 2)
    {
      if (oldhashpassword !== results[0].User_Password) { //when you logged in there is old password token, use it compare to database if it match then allow to change password
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const newpasswordhash = await bcrypt.hash(newpassword,10)
      console.log(newpasswordhash)
      const sqlcommand2 = 'UPDATE User SET User_Password = ? WHERE User_ID = ?';
      const results2 = await queryAsync(sqlcommand2, [newpasswordhash, userid]);
      res.status(200).json({ message: 'Password updated successfully' });
    }
  } catch (err) {
    console.log('err', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;