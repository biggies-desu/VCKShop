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

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error('Only images are allowed!'), false);
    }
  }
});

const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
router.post("/upload", upload.single('productimage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  setTimeout(() => {
    fs.chown(filePath, 33, 33, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Ownership changed to www-data.");
      }
    });
    fs.chmod(filePath, 0o644, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Permissions set to 644.");
      }
    });
  }, 500);
  res.json({ message: 'Upload successful', filename: req.file.filename });
});

router.post('/addproduct', upload.single('productimage'), (req, res) => {
  const {
      productname, productID, productcatagory, productamount, productprice, 
      productdescription, notify, notify_amount, productmodelid, user_id
  } = req.body;
  console.log(req.body);
  const notifyValue = (notify === "true" || notify === true) ? 1 : 0;
  const productimage = req.file ? req.file.filename : null;
  const sqlcommand = `INSERT INTO Sparepart (SparePart_Name, SparePart_ProductID, SparePart_Amount, SparePart_Price, SparePart_Description, SparePart_Image, SparePart_Notify, SparePart_NotifyAmount, Category_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, (SELECT Category_ID FROM Category WHERE Category_Name = ?))`;
  db.query(sqlcommand, [productname, productID, productamount, productprice, productdescription, productimage, notifyValue, notify_amount, productcatagory], (err, results) => {
      if (err) {
          return res.json(err);
      }
      const sparepartID = results.insertId;
      const modelid = productmodelid.split(',');
      const insertmap = modelid.map(modelid => [sparepartID, modelid]);
      const insertsql = `INSERT INTO Model_Link (sparepart_id, Model_id) VALUES ?`;
      db.query(insertsql, [insertmap], (err, result) => {
          if (err) {
            return res.json(err);
          }
          //put it do log
          const wltime = new Date(new Date().getTime()+7*60*60*1000).toISOString().slice(0, 19).replace('T', ' ');
          const wlactionid = 1;
          const wldescription = `"${productname}" จำนวน ${productamount} หน่วย`;
          const puttologtablesql = `INSERT INTO Warehouse_Log (SparePart_ID, WL_Action_ID, WL_Time, WL_Description, User_ID, Category_ID)
                                    VALUES (?, ?, ?, ?, ?, (SELECT Category_ID FROM Category WHERE Category_Name = ?))`;
              db.query(puttologtablesql, [sparepartID, wlactionid, wltime, wldescription, user_id, productcatagory], (err, results) => {
              if (err) {
                  return res.json(err);
              }
              res.json(results);
          });
      });
  });
});

router.delete('/deletesparepart/:id', function (req, res) {
    const sparepartId = req.params.id;
    const user_id = req.query.user_id;
    //get productname first
    const getproductnamesql = `SELECT SparePart_Name, SparePart_Image, Category_ID FROM Sparepart WHERE SparePart_ID = ?`;
    db.query(getproductnamesql, [sparepartId], function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        //get image filepath
        const productname = result[0].SparePart_Name;
        const filename = result[0].SparePart_Image;
        const productcatagory = result[0].Category_ID;
        const filePath = filename ? path.join(__dirname, 'uploads', filename) : null;
        //delete image from upload folder
        if (filename && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`Deleted image: ${filePath}`);
            } catch (err) {
                console.error(`Failed to delete image: ${filePath}`, err);
            }
        }
        //delete from sparepart db
        const sqlcommand = 'DELETE FROM Sparepart WHERE SparePart_ID = ?';
        console.log(productcatagory)
        db.query(sqlcommand, [sparepartId], function (err, result2) {
            if (err) {
                return res.status(500).json(err);
            }
            //put into warehouse_log
            const wltime = new Date(new Date().getTime()+7*60*60*1000).toISOString().slice(0, 19).replace('T', ' ');
            const wlactionid = 3;
            const wldescription = `"${productname}"`;
            const puttologtablesql = `INSERT INTO Warehouse_Log (SparePart_ID, WL_Action_ID, WL_Time, WL_Description, user_ID, Category_ID) VALUES (?,?,?,?,?,?)`;
            db.query(puttologtablesql, [null, wlactionid, wltime, wldescription, user_id, productcatagory], function (err, result3) {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.json(result3);
            });
        });
    });
});

module.exports = router;