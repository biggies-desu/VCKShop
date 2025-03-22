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

router.post("/insertbrandmodel", upload.single("Model_Image"), (req, res) => {
  let Brand_Name = req.body.Brand_Name;
  let Model_Name = req.body.Model_Name;
  let Model_Year = req.body.Model_Year;
  const tempImage = req.file ? req.file.filename : null;

  // Check if Brand exists
  const checkBrand = `SELECT Brand_ID FROM Brand WHERE Brand_Name = ?`;
  db.query(checkBrand, [Brand_Name], (err, brandResult) => {
      if (err) return res.status(500).json(err);

      let brandId;
      if (brandResult.length > 0) {
          brandId = brandResult[0].Brand_ID;
          checkModelName();
      } else {
          const insertBrandSql = `INSERT INTO Brand (Brand_Name) VALUES (?)`;
          db.query(insertBrandSql, [Brand_Name], (err2, brandInsertResult) => {
              if (err2) return res.status(500).json(err2);
              brandId = brandInsertResult.insertId;
              checkModelName();
          });
      }
  });

  // Check if Model_Name exists in Model_Name table
  function checkModelName() {
      const checkModelSql = `SELECT Model_Name_ID FROM Model_Name WHERE Model_Name = ?`;
      db.query(checkModelSql, [Model_Name], (err, modelResult) => {
          if (err) return res.status(500).json(err);

          let modelNameId;
          if (modelResult.length > 0) {
              modelNameId = modelResult[0].ModelName_ID;
              insertModel(modelNameId);
          } else {
              const insertModelNameSql = `INSERT INTO Model_Name (Model_Name) VALUES (?)`;
              db.query(insertModelNameSql, [Model_Name], (err2, modelNameInsertResult) => {
                  if (err2) return res.status(500).json(err2);
                  modelNameId = modelNameInsertResult.insertId;
                  insertModel(modelNameId);
              });
          }
      });
  }

  // Insert into Model using ModelName_ID
  function insertModel(modelNameId) {
      const insertModelSql = `INSERT INTO Model (Brand_ID, Model_Name_ID, Model_Year) VALUES (?, ?, ?)`;
      db.query(insertModelSql, [brandId, modelNameId, Model_Year], (err, modelInsertResult) => {
          if (err) return res.status(500).json(err);

          const modelId = modelInsertResult.insertId;
          if (tempImage) {
              const oldPath = path.join(__dirname, "model_images", tempImage);
              const newFileName = `modelId_${modelId}${path.extname(tempImage)}`;
              const newPath = path.join(__dirname, "model_images", newFileName);

              fs.rename(oldPath, newPath, (renameErr) => {
                  if (renameErr) return res.status(500).json({ error: "Rename image failed", renameErr });

                  const updateSql = `UPDATE Model SET Model_Image = ? WHERE Model_ID = ?`;
                  db.query(updateSql, [newFileName, modelId], (err4) => {
                      if (err4) return res.status(500).json(err4);
                      return res.json({ success: true, message: "Inserted with image", modelId, image: newFileName });
                  });
              });
          } else {
              return res.json({ success: true, message: "Inserted successfully", modelId });
          }
      });
  }
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

  const getBrandId = `SELECT Brand_ID FROM Model WHERE Model_ID = ?`;
  db.query(getBrandId, [Model_ID], (err, brandResult) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (brandResult.length === 0) {
        return res.json({ message: "ไม่พบ Model ที่ต้องการลบ" });
    }

      const brandId = brandResult[0].Brand_ID;
      const updateModel = `UPDATE Model SET Brand_ID = ?, Model_Name_ID = ?, Model_Year = ? WHERE Model_ID = ?`;
      db.query(updateModel, [Brand_ID, Model_Name, Model_Year, Model_ID], (err, updateResult) => {
          if (err) {
            return res.status(500).json(err);
          }
          if (updateResult.affectedRows === 0) {
              return res.json({ message: "ไม่พบ Model ที่ต้องการอัพเดต" });
          }

          const checkBrand = `SELECT COUNT(*) AS modelCount FROM Model WHERE Brand_ID = ?`;
          db.query(checkBrand, [brandId], (err, checkResult) => {
              if (err) {
                return res.status(500).json(err);
              }

              const modelCount = checkResult[0].modelCount;
              if (modelCount === 0) {
                  const deleteBrand = `DELETE FROM Brand WHERE Brand_ID = ?`;
                  db.query(deleteBrand, [brandId], (err, deleteBrandResult) => {
                      if (err) return res.status(500).json(err);

                      console.log("ผลลัพธ์จากการลบ", deleteBrandResult);
                      return res.json({ message: "อัพเดต Model และลบ Brand ที่ไม่มี Model สำเร็จ" });
                  });
              } else {
                  return res.json({ message: "อัพเดต Model สำเร็จ แต่ Brand ยังมี Model อื่นอยู่" });
              }
          });
      });
  });
});


router.delete('/deletecategory/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM Category WHERE Category_ID = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        console.log("ผลลัพธ์จากการลบ", result);
        if (result.affectedRows === 0) {
          // ถ้าไม่มีแถวใดถูกลบเลย (ID ไม่ตรง)
          return res.json({ message: "ไม่พบ Category ที่ต้องการลบ" });
        } else {
          return res.json({ message: "ลบประเภทอะไหล่สำเร็จ" });
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
        console.log("ผลลัพธ์จากการลบ", result);
        if (result.affectedRows === 0) {
          // ถ้าไม่มีแถวใดถูกลบเลย (ID ไม่ตรง)
          return res.json({ message: "ไม่พบ Technician ที่ต้องการลบ" });
        } else {
          return res.json({ message: "ลบชื่อช่างสำเร็จ" });
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
        console.log("ผลลัพธ์จากการลบ", result);
        if (result.affectedRows === 0) {
          // ถ้าไม่มีแถวใดถูกลบเลย (ID ไม่ตรง)
          return res.json({ message: "ไม่พบ Service ที่ต้องการลบ" });
        } else {
          return res.json({ message: "ลบชื่อประเภทการบริการสำเร็จ" });
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
        console.log("ผลลัพธ์จากการลบ", result);
        if (result.affectedRows === 0) {
          // ถ้าไม่มีแถวใดถูกลบเลย (ID ไม่ตรง)
          return res.json({ message: "ไม่พบ Status ที่ต้องการลบ" });
        } else {
          return res.json({ message: "ลบชื่อสถานะสำเร็จ" });
        }
      }
    });
});

router.delete('/deletebrandmodel/:id', (req, res) => {
  const modelId = req.params.id;

  const getBrandId = `SELECT Brand_ID FROM Model WHERE Model_ID = ?`;
  
  db.query(getBrandId, [modelId], (err, brandResult) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (brandResult.length === 0) {
          return res.json({ message: "ไม่พบ Model ที่ต้องการลบ" });
      }

      const brandId = brandResult[0].Brand_ID;

      const deleteModel = `DELETE FROM Model WHERE Model_ID = ?`;
      db.query(deleteModel, [modelId], (err, deleteResult) => {
          if (err) {
            return res.status(500).json(err);
          }
          if (deleteResult.affectedRows === 0) {
              return res.json({ message: "ไม่พบ Model ที่ต้องการลบ" });
          }

          const checkBrand = `SELECT COUNT(*) AS modelCount FROM Model WHERE Brand_ID = ?`;
          db.query(checkBrand, [brandId], (err, checkResult) => {
              if (err) {
                return res.status(500).json(err);
              }
              const modelCount = checkResult[0].modelCount;
              if (modelCount === 0) {
                  const deleteBrand = `DELETE FROM Brand WHERE Brand_ID = ?`;
                  db.query(deleteBrand, [brandId], (err, deleteBrandResult) => {
                      if (err) return res.status(500).json(err);
  
                      console.log("ผลลัพธ์จากการลบ", deleteBrandResult);
                      return res.json({ message: "ลบ Model และลบ Brand ที่ไม่มี Model สำเร็จ" });
                  });
              } else {
                  return res.json({ message: "ลบ Model สำเร็จ แต่ Brand ยังมี Model อื่นอยู่" });
              }
          });
      });
  });
});

router.delete('/deletesubcategory/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM Sub_Category WHERE Sub_Category_ID = ?`;
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        console.log("ผลลัพธ์จากการลบ", result);
        if (result.affectedRows === 0) {
          // ถ้าไม่มีแถวใดถูกลบเลย (ID ไม่ตรง)
          return res.json({ message: "ไม่พบ Sub_Category ที่ต้องการลบ" });
        } else {
          return res.json({ message: "ลบชื่อรุ่นประเภทสำเร็จ" });
        }
      }
    });
});
  
module.exports = router;