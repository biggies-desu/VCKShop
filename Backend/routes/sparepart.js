const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/allsparepart',(req,res) => {
  const sqlcommand = `SELECT * FROM sparepart
                    join category ON sparepart.Category_ID = category.Category_ID
                    ORDER BY sparepart_id DESC;`
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
  let productnotify_amount = req.body.productnotify_amount
  let user_id = req.body.user_id
  const getproductnamesql = `SELECT SparePart_Name FROM sparepart WHERE SparePart_ID = ?`
  //get productname first
  db.query(getproductnamesql, [sparepartId], function (err, result){
    if(err)
    {
      return res.send(err)
    }
    const productname = result[0].SparePart_Name
    //update
    const sqlcommand = `UPDATE sparepart SET SparePart_Amount = ?, SparePart_Price = ?, SparePart_Notify = ?, SparePart_NotifyAmount = ?
                        WHERE SparePart_ID = ?`;
    db.query(sqlcommand, [productamount, productprice, productnotify, productnotify_amount, sparepartId], function (err, results) {
      if (err) {
        return res.send(err);
      }
      const wltime = new Date(new Date().getTime()+7*60*60*1000).toISOString().slice(0, 19).replace('T', ' '); //utc -> gmt+7 thingy
      const wlaction = 'แก้ไขจำนวน/ราคาสินค้า'
      const wldescription = `แก้ไข : "${productname}" เป็นจำนวน ${productamount} หน่วย, ราคา ${productprice} บาท`
      const puttologtablesql = `INSERT INTO warehouse_log (SparePart_ID, WL_Action, WL_Time, WL_Description, user_id)
                                VALUES (?,?,?,?,?)`
      db.query(puttologtablesql, [sparepartId, wlaction, wltime, wldescription, user_id], function (err,result2) {
        if(err) {
          return res.send(err)
        }
        return res.json({ success: true, message: 'Product edited and logged successfully' });
      })
  });
})
});

router.get("/sparepart", (req, res) => {
  const ModelId = req.query.modelId; // ดึงค่าจาก query parameter
  const query = `SELECT s.*, sml.sparepart_model_id FROM sparepart s join sparepart_model_link sml ON s.sparepart_id = sml.sparepart_id WHERE sml.sparepart_model_id = ?` // query ที่จะดึงข้อมูลจากฐานข้อมูล 
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
  const keyword = req.query.keyword || ''; // กำหนดค่า default เป็นค่าว่างถ้าไม่มีการส่งคำค้นหา
  console.log(req.query)
  const query = `SELECT s.* FROM sparepart s JOIN Sparepart_Model_link sml ON s.SparePart_ID = sml.SparePart_ID WHERE sml.SparePart_Model_ID = ? AND s.Category_ID = ? AND s.SparePart_Name LIKE ?;` // query ที่จะดึงข้อมูลจากฐานข้อมูล 
  db.query(query, [ModelId, Category, `%${keyword}%`], (err, results) => { // ใช้ตัวแปร ModelId แทนค่าใน query
      if (err) {
          res.status(500).json({ message: "Error fetching data", error: err });
      } else {
          res.json(results); // ส่งผลลัพธ์กลับไปยัง frontend
      }
  });
});

router.post('/searchquery',function (req,res) {
  let search_query = req.body.search_query
  const sqlcommand = `SELECT * FROM sparepart JOIN category ON sparepart.Category_ID = category.Category_ID 
                      JOIN Sparepart_Model_link sml ON sparepart.SparePart_ID = sml.SparePart_ID 
                      JOIN sparepart_model ON sml.SparePart_Model_ID = sparepart_model.SparePart_Model_ID 
                      JOIN sparepart_brand ON sparepart_model.SparePart_Brand_ID = sparepart_brand.SparePart_Brand_ID 
                      WHERE SparePart_Name LIKE CONCAT('%', ?, '%') OR SparePart_ProductID LIKE CONCAT('%', ?, '%')
                      GROUP BY sparepart.sparepart_id`
  db.query(sqlcommand,[search_query,search_query],function(err,results)
  {
    if (err){
      return res.send(err)
    }
    else{
      res.json(results)
    }
  })
})

module.exports = router;