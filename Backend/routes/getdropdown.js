const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/getdropdowncategory',(req,res) => {
    const sqlcommand = "SELECT Category_Name FROM category"
    db.query(sqlcommand,(err,data) => {
      if(err)     return res.json(err);
      return res.json(data)
    })
  })
  router.get('/getdropdownbrand',(req,res) => {
    const sqlcommand = "SELECT SparePart_Brand_Name FROM sparepart_brand"
    db.query(sqlcommand,(err,data) => {
      if(err)     return res.json(err);
      return res.json(data)
    })
  })
  
  router.post('/getdropdownmodel',function (req,res) {
    let brandname = req.body.brandname
    console.log(req.body)
    const sqlcommand = `SELECT DISTINCT SparePart_Model_Name FROM sparepart_model
                        JOIN SparePart_Brand ON sparepart_model.SparePart_Brand_ID = SparePart_Brand.SparePart_Brand_ID
                        WHERE SparePart_Brand.SparePart_Brand_Name = ?`;
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
    const sqlcommand = `SELECT DISTINCT SparePart_Model_Year FROM sparepart_model 
                        WHERE SparePart_Model_Name = ?;`
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
  { const sqlcommand = `SELECT * from service`
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