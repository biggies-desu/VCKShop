const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/allsparepart',(req,res) => {
  const sqlcommand = `SELECT * FROM sparepart JOIN category ON sparepart.Category_ID = category.Category_ID ORDER BY sparepart_id DESC;`
  db.query(sqlcommand,(err,data) => {
    if(err)     return res.json(err);
    return res.json(data)
  })
})


router.put('/updatesparepart/:id', function (req, res) {
  const sparepartId = req.params.id;
  let productamount = req.body.productamount;
  let productprice = req.body.productprice;
  let productnotify = req.body.productnotify
  const getproductnamesql = `SELECT SparePart_Name FROM sparepart WHERE SparePart_ID = ?`
  //get productname first
  db.query(getproductnamesql, [sparepartId], function (err, result){
    if(err)
    {
      return res.send(err)
    }
    const productname = result[0].SparePart_Name
    //update
    const sqlcommand = `UPDATE sparepart SET SparePart_Amount = ?, SparePart_Price = ?, SparePart_Notify = ?
                        WHERE SparePart_ID = ?`;
    db.query(sqlcommand, [productamount, productprice, productnotify, sparepartId], function (err, results) {
      if (err) {
        return res.send(err);
      }
      const wltime = new Date().toLocaleString('th-TH')
      const wlaction = 'แก้ไขจำนวน/ราคาสินค้า'
      const wldescription = `แก้ไข : ${productname} เป็นจำนวน ${productamount}, ราคา ${productprice}`
      const puttologtablesql = `INSERT INTO warehouse_log (SparePart_ID, WL_Action, WL_Time, WL_Description)
                                VALUES (?,?,?,?)`
      db.query(puttologtablesql, [sparepartId, wlaction, wltime, wldescription], function (err,result2) {
        if(err) {
          return res.send(err)
        }
        return res.json({ success: true, message: 'Product edited and logged successfully' });
      })
  });
})
});

router.delete('/deletesparepart/:id', function (req, res) {
  const sparepartId = req.params.id;
  //get productname first
  const getproductnamesql = `SELECT SparePart_Name FROM sparepart WHERE SparePart_ID = ?`
  db.query(getproductnamesql, [sparepartId], function (err, result){
    if(err)
    {
      return res.send(err)
    }
    const productname = result[0].SparePart_Name
    //delete from sparepart db
    const sqlcommand = 'DELETE FROM sparepart WHERE SparePart_ID = ?';
    db.query(sqlcommand, [sparepartId], function (err, result2) {
      if(err)
      {
        return res.send(err)
      }
      //put log
      const wltime = new Date().toLocaleString('th-TH')
      const wlaction = 'ลบสินค้า'
      const wldescription = `ลบสินค้า : ${productname}`
      const puttologtablesql = `INSERT INTO warehouse_log (SparePart_ID, WL_Action, WL_Time, WL_Description)
                                VALUES (?,?,?,?)`
      db.query(puttologtablesql, [null,wlaction,wltime,wldescription], function (err, result3){
        if(err)
        {
          return res.send(err)
        }
        return res.json({ success: true, message: 'Product deleted and logged successfully' });
      })
    });
  })
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