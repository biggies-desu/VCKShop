const fs = require("fs"); // เพิ่ม fs เพื่อ rename ไฟล์
const express = require('express');
const db = require('../db');
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "routes/model_images");
    },
    filename: (req, file, cb) => {
      const tempName = Date.now() + path.extname(file.originalname);
      cb(null, tempName);
    },
});

const upload = multer({ storage });

router.get('/test', (req,res) => {
  res.json({message: "ok"})
})

router.post("/insertbrandmodel", upload.single("Model_Image"), (req, res) => {
    let Brand_Name = req.body.Brand_Name;
    let Model_Name = req.body.Model_Name;
    let Model_Year = req.body.Model_Year;
    const tempImage = req.file ? req.file.filename : null;
    // check that brand is exist?
    const checkBrand = `SELECT Brand_ID FROM Brand WHERE Brand_Name = ?`;
    db.query(checkBrand, [Brand_Name], (err, result) => {
        if (err) return res.status(500).json(err);

        let brandId;
        if (result.length > 0) {
            brandId = result[0].Brand_ID;
            insertModel();
        //if no brand insert it first
        } else {
            const insertBrandSql = `INSERT INTO Brand (Brand_Name) VALUES (?)`;
            db.query(insertBrandSql, [Brand_Name], (err2, result2) => {
            if (err2) return res.status(500).json(err2);
            brandId = result2.insertId;
            insertModel();
            });
        }
        function insertModel() {
            const sql = `INSERT INTO Model (Brand_ID, Model_Name, Model_Year) VALUES (?, ?, ?)`;
            db.query(sql, [brandId, Model_Name, Model_Year], (err3, result3) => {
                if (err3) return res.status(500).json(err3);
        
                const modelId = result3.insertId;
                if (tempImage) {
                  const oldPath = path.join(__dirname, "model_images", tempImage);
                  const newFileName = `modelId_${modelId}${path.extname(tempImage)}`;
                  const newPath = path.join(__dirname, "model_images", newFileName);
      
                  fs.rename(oldPath, newPath, (renameErr) => {
                  if (renameErr) {
                      return res.status(500).json({ error: "Rename image failed", renameErr });
                  }
      
                  const updateSql = `UPDATE Model SET Model_Image = ? WHERE Model_ID = ?`;
                  db.query(updateSql, [newFileName, modelId], (err4) => {
                      if (err4) return res.status(500).json(err4);
                      return res.json({ success: true, message: "filed upload", modelId, image: newFileName });
                  });
                  });
                } else {
                    return res.json({ success: true, message: "data added", modelId });
                }
            });
        }
    });
});

router.post('/insertcategory', (req, res) => {
    let Category_Name = req.body.Category_Name;
  
    const sqlcommand = `INSERT INTO Category (Category_Name) VALUES (?)`;
    db.query(sqlcommand, [Category_Name], (err, result) => {
        if(err){
            res.send(err)
          }
          else{
            res.json(result)
          }
    });
});

router.post('/inserttechnician', (req, res) => {
    let Technician_Name = req.body.Technician_Name;
  
    const sqlcommand = `INSERT INTO Technician (Technician_Name) VALUES (?)`;
    db.query(sqlcommand, [Technician_Name], (err, result) => {
        if(err){
            res.send(err)
          }
          else{
            res.json(result)
          }
    });
});

router.post('/insertservice', (req, res) => {
    let Service_Name = req.body.Service_Name;
    let Service_Price  = req.body.Service_Price ;
  
    const sqlcommand = `INSERT INTO Service (Service_Name, Service_Price) VALUES (?, ?)`;
    db.query(sqlcommand, [Service_Name, Service_Price], (err, result) => {
        if(err){
            res.send(err)
          }
          else{
            res.json(result)
          }
    });
});

router.post('/insertstatus', (req, res) => {
    let Booking_Status_Name = req.body.Booking_Status_Name;
  
    const sqlcommand = `INSERT INTO Booking_Status (Booking_Status_Name) VALUES (?)`;
    db.query(sqlcommand, [Booking_Status_Name], (err, result) => {
        if(err){
            res.send(err)
          }
          else{
            res.json(result)
          }
    });
});
  
router.post('/insertsubcategory', (req, res) => {
    let Sub_Category_Name = req.body.Sub_Category_Name;
    let Category_ID = req.body.Category_ID;
  
    const sqlcommand = `INSERT INTO Sub_Category (Sub_Category_Name, Category_ID) VALUES (?, ?)`;
    db.query(sqlcommand, [Sub_Category_Name, Category_ID], (err, result) => {
        if(err){
            res.send(err)
          }
          else{
            res.json(result)
          }
    });
});

router.put('/updatetechnician/:id', (req, res) => {
    let Technician_ID = req.params.id;
    let Technician_Name = req.body.Technician_Name;

    const sqlcommand = `UPDATE Technician SET Technician_Name = ?
                        WHERE Technician_ID = ?`;
    db.query(sqlcommand, [Technician_Name, Technician_ID], (err, result) => {
        if(err){
            res.send(err)
          }
          else{
            res.json(result)
          }
    });
});

router.put('/updatecategory/:id', (req, res) => {
    let Category_ID = req.params.id;
    let Category_Name = req.body.Category_Name;

    const sqlcommand = `UPDATE Category SET Category_Name = ?
                        WHERE Category_ID = ?`;
    db.query(sqlcommand, [Category_Name, Category_ID], (err, result) => {
        if(err){
            res.send(err)
          }
          else{
            res.json(result)
          }
    });
});

router.put('/updatestatus/:id', (req, res) => {
    let Booking_Status_ID = req.params.id;
    let Booking_Status_Name = req.body.Booking_Status_Name;

    const sqlcommand = `UPDATE Booking_Status SET Booking_Status_Name = ?
                        WHERE Booking_Status_ID = ?`;
    db.query(sqlcommand, [Booking_Status_Name, Booking_Status_ID], (err, result) => {
        if(err){
            res.send(err)
          }
          else{
            res.json(result)
          }
    });
});

router.put('/updateservice/:id', (req, res) => {
  let Service_ID = req.params.id;
  let Service_Name = req.body.Service_Name;
  let Service_Price = req.body.Service_Price;

  const sqlcommand = `UPDATE Service SET Service_Name = ?, Service_Price = ?
                      WHERE Service_ID = ?`;
  db.query(sqlcommand, [Service_Name, Service_Price, Service_ID], (err, result) => {
      if(err){
          res.send(err)
        }
        else{
          res.json(result)
        }
  });
});

router.put('/updatesubcategory/:id', (req, res) => {
  let Sub_Category_ID = req.params.id;
  let Sub_Category_Name = req.body.Sub_Category_Name;
  let Category_ID = req.body.Category_ID;

  const sqlcommand = `UPDATE Sub_Category SET Sub_Category_Name = ?, Category_ID = ?
                      WHERE Sub_Category_ID = ?`;
  db.query(sqlcommand, [Sub_Category_Name, Category_ID, Sub_Category_ID], (err, result) => {
      if(err){
          res.send(err)
        }
        else{
          res.json(result)
        }
  });
});

router.put('/updatebrandmodel/:id', (req, res) => {
  let Model_ID = req.params.id;
  let Brand_ID = req.body.Brand_ID;
  let Model_Name = req.body.Model_Name;
  let Model_Year = req.body.Model_Year;

  const sqlcommand = `UPDATE Model SET Brand_ID = ?, Model_Name = ?, Model_Year = ?
                      WHERE Model_ID = ?`;
  db.query(sqlcommand, [Brand_ID, Model_Name, Model_Year, Model_ID], (err, result) => {
      if(err){
          res.send(err)
        }
        else{
          res.json(result)
        }
  });
});

router.delete('/deletecategory/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM Category WHERE Category_ID = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        console.log(result);
        if (result.affectedRows === 0) {
          // ถ้าไม่มีแถวใดถูกลบเลย (ID ไม่ตรง)
          return res.json({ message: "no category del" });
        } else {
          return res.json({ message: "sucess" });
        }
      }
    });
});

router.delete('/deletetechnician/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM Technician WHERE Technician_ID = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        console.log(result);
        if (result.affectedRows === 0) {
          // ถ้าไม่มีแถวใดถูกลบเลย (ID ไม่ตรง)
          return res.json({ message: "no technician del" });
        } else {
          return res.json({ message: "success" });
        }
      }
    });
});

router.delete('/deleteservice/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM Service WHERE Service_ID = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        console.log(result);
        if (result.affectedRows === 0) {
          return res.json({ message: "no service del" });
        } else {
          return res.json({ message: "sucuess" });
        }
      }
    });
});

router.delete('/deletestatus/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM Booking_Status WHERE Booking_Status_ID = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        console.log(result);
        if (result.affectedRows === 0) {
          return res.json({ message: "no status del" });
        } else {
          return res.json({ message: "success" });
        }
      }
    });
});

router.delete('/deletebrandmodel/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM Model WHERE Model_ID = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        console.log(result);
        if (result.affectedRows === 0) {
          return res.json({ message: "no model del" });
        } else {
          return res.json({ message: "success" });
        }
      }
    });
});

router.delete('/deletesubcategory/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM Sub_Category WHERE Sub_Category_ID = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        console.log(result);
        if (result.affectedRows === 0) {
          return res.json({ message: "no sub category del" });
        } else {
          return res.json({ message: "success" });
        }
      }
    });
});
  

module.exports = router;