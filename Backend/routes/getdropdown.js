const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/getdropdowncategory',(req,res) => {
    const sqlcommand = "SELECT * FROM Category"
    db.query(sqlcommand,(err,data) => {
      if(err)     return res.json(err);
      return res.json(data)
    })
  })
  router.get('/getdropdownbrand',(req,res) => {
    const sqlcommand = "SELECT * FROM Brand"
    db.query(sqlcommand,(err,data) => {
      if(err)     return res.json(err);
      return res.json(data)
    })
  })
  
router.post('/getdropdownmodel', (req, res) => {
  const brandname = req.body.brandname;
  const sqlcommand = `SELECT DISTINCT mn.Model_Name, b.Brand_Name 
                      FROM Model m
                      JOIN Brand b ON m.Brand_ID = b.Brand_ID
                      JOIN Model_Name mn ON m.Model_Name_ID = mn.Model_Name_ID
                      WHERE b.Brand_Name IN (?);`;
  db.query(sqlcommand, [brandname], (err, results) => {
    if (err) return res.json(err);
    res.json(results);
  });
});
  
router.post('/getdropdownyear', (req, res) => {
  const modelNameId = req.body.modelNameId;
  const sqlcommand = `SELECT DISTINCT m.Model_ID, mn.Model_Name, m.Model_Year 
                      FROM Model m
                      JOIN Model_Name mn ON m.Model_Name_ID = mn.Model_Name_ID
                      WHERE m.Model_Name_ID = ?;`;
  db.query(sqlcommand, [modelNameId], (err, results) => {
    if (err) return res.json(err);
    res.json(results);
  });
});
  
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

router.get('/getdropdownquetestatus', function(req,res) {
  const sqlcommand = `SELECT * from Booking_Status`
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

router.get('/getdropdowntechnician', (req,res) => {
  const sqlcommand = `select * from Technician`
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

router.get('/getdropdownsubcategory', (req,res) => {
  const sqlcommand = `select * from Sub_Category
                      JOIN Category ON Sub_Category.Category_ID = Category.Category_ID`
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

router.get('/getdropdownprovince', (req,res) => {
  const sqlcommand = `SELECT * from Province`
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

router.get('/getdropdownmodel', (req,res) => {
  const sqlcommand = `SELECT m.*, b.Brand_Name, mn.Model_Name 
                      FROM Model m 
                      JOIN Brand b ON b.Brand_ID = m.Brand_ID
                      JOIN Model_Name mn ON mn.Model_Name_ID = m.Model_Name_ID`
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