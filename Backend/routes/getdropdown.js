const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/getdropdowncategory',(req,res) => {
    const sqlcommand = "SELECT Category_Name FROM Category"
    db.query(sqlcommand,(err,data) => {
      if(err)     return res.json(err);
      return res.json(data)
    })
  })
  router.get('/getdropdownbrand',(req,res) => {
    const sqlcommand = "SELECT Brand_Name FROM Brand"
    db.query(sqlcommand,(err,data) => {
      if(err)     return res.json(err);
      return res.json(data)
    })
  })
  
router.post('/getdropdownmodel',function (req,res) {
  let brandname = req.body.brandname
  console.log(req.body)
  const sqlcommand = `SELECT DISTINCT Model.Model_Name, Brand.Brand_Name FROM Model
                    JOIN Brand ON Model.Brand_ID = Brand.Brand_ID
                    WHERE Brand.Brand_Name in (?)`;
  db.query(sqlcommand,[brandname],function(err,results)
  {
      if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(results)
      }
  })
})
  
router.post('/getdropdownyear',function (req,res) {
  let modelname = req.body.modelname
  console.log(req.body)
  const sqlcommand = `SELECT DISTINCT Model_ID, Model_Name, Model_Year 
                  FROM Model WHERE Model_Name IN (?);`
  db.query(sqlcommand,[modelname],function(err,results)
  {
      if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(results)
      }
  })
})
  
router.get('/getdropdownservice', function(req,res)
{ const sqlcommand = `SELECT * from Service`
  db.query(sqlcommand,(err,data) => {
    if(err)
    {
      return res.json(err)
    }
    else
    {
      res.json(data)
    }
  })
})

router.get('/getdropdownwlaction', function(req,res) {
  const sqlcommand = `SELECT * from Warehouse_Log_Action`
  db.query(sqlcommand,(err,data) => {
    if(err)
    {
      return res.json(err)
    }
    else
    {
      res.json(data)
    }
  })
})

module.exports = router;