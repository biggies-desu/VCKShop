const express = require('express');
const db = require('../db');
const router = express.Router();

// router.get('/user',(req,res) => {
//     const sqlcommand = "select * from user"
//     db.query(sqlcommand,(err,data) => {
//       if(err)     return res.json(err);
//       return res.json(data)
//     })
//   })

router.get('/user', (req,res) => {
  const sqlcommand = `select u.user_id, u.user_username, r.role_id from user u
  join role r on u.role_id = r.role_id`
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
router.get('/role', (req,res) => {
  const sqlcommand = `select * from role`
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

router.post('/searchuser', (req,res) => {
  const searchname = req.body.searchname
  const sqlcommand = `select u.user_id, u.user_username, r.role_id from user u
  join role r on u.role_id = r.role_id where u.user_username like concat('%', ?, '%')`
  db.query(sqlcommand,[searchname],(err,result) => {
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

router.post('/updaterole',(req,res) => {
    const userid = req.body.user_id
    const role_id = req.body.role_id
    const sqlcommand = `update user set role_id = ? where user_id = ?`
    db.query(sqlcommand,[role_id,userid],(err,result) => {
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
  const sqlcommand = 'delete from user where user_id = ?'
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
