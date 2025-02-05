const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/allsparepart',(req,res) => {
  const sqlcommand = "SELECT * FROM `sparepart` join `category` ON sparepart.Category_ID = category.Category_ID;"
  db.query(sqlcommand,(err,data) => {
    if(err)     return res.json(err);
    return res.json(data)
  })
})

router.put('/updatesparepart/:id', function (req, res) {
  const sparepartId = req.params.id;
  let productamount = req.body.productamount;
  let productprice = req.body.productprice;
  console.log(req.body)
  const sqlcommand = `UPDATE sparepart SET SparePart_Amount = ?, SparePart_Price = ?
                      WHERE SparePart_ID = ?`;
   db.query(sqlcommand, [productamount, productprice, sparepartId], function (err, results) {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
});

router.delete('/deletesparepart/:id', function (req, res) {
  const sparepartId = req.params.id;
  console.log(req.body)
  const sqlcommand = 'DELETE FROM sparepart WHERE SparePart_ID = ?';
  db.query(sqlcommand, [sparepartId], function (err, result) {
      if(err) {
        res.send(err)
      }
      else{
        res.json(result)
      }
  });
});

router.get("/sparepart", (req, res) => {
  const ModelId = req.query.modelId; // ดึงค่าจาก query parameter
  const query = "SELECT * FROM sparepart WHERE SparePart_Model_ID = ?"; // query ที่จะดึงข้อมูลจากฐานข้อมูล 
  db.query(query, [ModelId], (err, results) => { // ใช้ตัวแปร ModelId แทนค่าใน query
      if (err) {
          res.status(500).json({ message: "Error fetching data", error: err });
      } else {
          res.json(results); // ส่งผลลัพธ์กลับไปยัง frontend
      }
  });
});

router.get("/sparepartcategory", (req, res) => {
  const ModelId = req.query.modelId; // ดึงค่าจาก query parameter
  const Category = req.query.category
  console.log(req.query)
  const query = `SELECT * FROM sparepart WHERE SparePart_Model_ID = ? and Category_ID = ?` // query ที่จะดึงข้อมูลจากฐานข้อมูล 
  db.query(query, [ModelId, Category], (err, results) => { // ใช้ตัวแปร ModelId แทนค่าใน query
      if (err) {
          res.status(500).json({ message: "Error fetching data", error: err });
      } else {
          res.json(results); // ส่งผลลัพธ์กลับไปยัง frontend
      }
  });
});

router.post('/searchquery',function (req,res) {
let search_query = req.body.search_query
const sqlcommand = "SELECT * FROM `sparepart` where `SparePart_Name` LIKE CONCAT('%',?,'%') OR `SparePart_ProductID` LIKE CONCAT('%',?,'%')"
db.query(sqlcommand,[search_query,search_query],function(err,results)
{
if (err){
  throw err
}
else{
  res.json(results)
}
})
})

module.exports = router;