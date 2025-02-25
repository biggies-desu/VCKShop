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
      productdescription,
      notify,
      notify_amount,
      productmodelid
    } = req.body;
    console.log(req.body)
    const productimage = req.file ? req.file.filename : null;
    const sqlcommand = `INSERT INTO sparepart (SparePart_Name, SparePart_ProductID, SparePart_Amount, SparePart_Price, SparePart_Description, SparePart_Image, SparePart_Notify, SparePart_NotifyAmount, Category_ID)
      VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          (SELECT Category_ID FROM category WHERE Category_Name = ?)
      )`;
    db.query(sqlcommand, [
      productname, productID, productamount, productprice, productdescription, productimage, notify, notify_amount,
       productcatagory
    ], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
    const sparepartID = results.insertId;

    const modelid = productmodelid.split(',');
    const insertmap = modelid.map(modelid => [sparepartID, modelid
    ]);
    const insertsql = `INSERT INTO sparepart_model_link (sparepart_id, sparepart_model_id) VALUES ?`;
    db.query(insertsql, [insertmap], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json();
      }
    });


    //put it do log
    
    const wltime = new Date().toLocaleString('th-TH')
    const wlaction = 'เพิ่มสินค้า'
    const wldescription = `เพิ่มสินค้า : "${productname}" จำนวน ${productamount} หน่วย`
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

router.delete('/deletesparepart/:id', function (req, res) {
  const sparepartId = req.params.id;
  //get productname first
  const getproductnamesql = `SELECT SparePart_Name,SparePart_Image FROM sparepart WHERE SparePart_ID = ?`
  db.query(getproductnamesql, [sparepartId], function (err, result){
    if(err)
    {
      return res.send(err)
    }
    const productname = result[0].SparePart_Name
    //get image filepath
    const filename = result[0].SparePart_Image;
    const filePath = filename ? path.join(__dirname, 'uploads', filename) : null; //if have image get filepath of img
    //delete image from upload folder
    if(filename && fs.existsSync(filePath))
    {
      fs.unlinkSync(filePath)
    }
    //delete from sparepart db
    const sqlcommand = 'DELETE FROM sparepart WHERE SparePart_ID = ?';
    db.query(sqlcommand, [sparepartId], function (err, result2) {
      if(err)
      {
        return res.send(err)
      }
      console.log(result2)
      //put log
      const wltime = new Date().toLocaleString('th-TH')
      const wlaction = 'ลบสินค้า'
      const wldescription = `ลบสินค้า : "${productname}"`
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

module.exports = router;