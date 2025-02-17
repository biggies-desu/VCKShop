const multer  = require('multer')
const path = require('path');
const express = require('express');
const db = require('../db')
const router = express.Router();

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log("Serving static files from:", path.join(__dirname, 'uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    console.log('Saving to:', uploadPath); // Debug path
    cb(null, uploadPath);
},
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename)
  }
})

const upload = multer({ storage: storage });

const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

router.post("/upload", upload.single('productimage'), (req, res) => {
  res.json({message : 'Hello Ok'})
  })

router.post('/addproduct', upload.single('productimage'), (req, res) => {
    const {
      productname,
      productID,
      productcatagory,
      productamount,
      productprice,
      productmodel,
      productyear,
      productdescription,
      notify,
      notify_amount
    } = req.body;
    const productimage = req.file ? req.file.filename : null;
    const sqlcommand = `INSERT INTO sparepart (SparePart_Name, SparePart_ProductID, SparePart_Amount, SparePart_Price, SparePart_Description, SparePart_Image, SparePart_Notify, SparePart_NotifyAmount, SparePart_Model_ID, Category_ID)
      VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          (SELECT SparePart_Model_ID FROM sparepart_model WHERE SparePart_Model_Name = ? AND SparePart_Model_Year = ?),
          (SELECT Category_ID FROM category WHERE Category_Name = ?)
      )`;
    db.query(sqlcommand, [
      productname, productID, productamount, productprice, productdescription, productimage, notify, notify_amount,
       productmodel, productyear,
       productcatagory
    ], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
    //put it do log
    const sparepartID = results.insertId;
    const wltime = new Date().toLocaleString('th-TH')
    const wlaction = 'เพิ่มสินค้า'
    const wldescription = `เพิ่มสินค้า : ${productname} จำนวน ${productamount} ชิ้น`
    const puttologtablesql = `INSERT INTO warehouse_log (SparePart_ID, WL_Action, WL_Time, WL_Description)
                              VALUES (?,?,?,?)`

    db.query(puttologtablesql, [sparepartID,wlaction,wltime,wldescription], (err,results) =>
    {
      if(err)
      {
        console.error(err)
        return res.status(500).json({ error: 'Database error' });
      }
    })
    res.json({ success: true, results });
  });
});

module.exports = router;