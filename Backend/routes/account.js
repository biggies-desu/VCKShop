const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/user', (req, res) => {
  const sql = ` SELECT u.*, r.Role_ID FROM User u
                JOIN Role r on u.Role_ID = r.Role_ID
                ORDER BY u.User_ID DESC`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.get('/role', (req,res) => {
  const sqlcommand = `select * from Role`
  db.query(sqlcommand, (err,result) => {
    if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(result)
      }
  })
})

router.post('/searchuser', (req, res) => {
  const { searchname, role } = req.body;
  let condition = [];
  let querydata = [];

  let sqlcommand = `SELECT u.*, r.Role_Name FROM User u 
                    JOIN Role r ON u.Role_ID = r.Role_ID`;

  if (searchname && searchname !== "") {
    condition.push("u.User_Username LIKE CONCAT('%', ?, '%')");
    querydata.push(searchname);
  }

  if (role && role !== "") {
    condition.push("r.Role_Name = ?");
    querydata.push(role);
  }

  if (condition.length > 0) {
    sqlcommand += " WHERE " + condition.join(" AND ");
  }

  sqlcommand += " ORDER BY u.User_ID DESC";

  db.query(sqlcommand, querydata, (err, result) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(result);
    }
  });
});


router.post('/updaterole',(req,res) => {
    const userid = req.body.User_ID
    const Role_ID = req.body.Role_ID
    const sqlcommand = `update User set Role_ID = ? where User_ID = ?`
    db.query(sqlcommand,[Role_ID,userid],(err,result) => {
      if (err)
        {
          return res.json(err)
        }
        else
        {
          res.json(result)
        }
    })
})

router.delete('/deleteaccount/:id', (req,res) => {
  const deleteid = req.params.id;
  const sqlcommand = 'delete from User where User_ID = ?'
  db.query(sqlcommand,[deleteid],(err,result) => {
    if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(result)
      }
  })
})

module.exports = router;