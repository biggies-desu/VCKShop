const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/allsparepart',(req,res) => {
  const sqlcommand = `SELECT s.*, c.Category_Name, 
                      GROUP_CONCAT(DISTINCT CONCAT(b.Brand_Name, ' ', m.Model_Name, ' (', m.Model_Year, ')') ORDER BY m.Model_ID ASC SEPARATOR ' , ') AS Model_Details
                      FROM Sparepart s
                      JOIN Category c ON s.Category_ID = c.Category_ID
                      JOIN Model_Link ml ON s.SparePart_ID = ml.SparePart_ID
                      JOIN Model m ON ml.Model_ID = m.Model_ID
                      JOIN Brand b ON m.Brand_ID = b.Brand_ID
                      GROUP BY s.SparePart_ID
                      ORDER BY s.SparePart_ID DESC;`
  db.query(sqlcommand,(err,data) => {
    if(err)     return res.json(err);
    return res.json(data)
  })
})
router.put('/updatesparepart/:id',(req, res) => {
  const sparepartId = req.params.id;
  let productamount = req.body.productamount;
  let productprice = req.body.productprice;
  let productnotify = req.body.productnotify
  let productnotify_amount = req.body.productnotify_amount
  let user_id = req.body.user_id
  console.log(req.body)
  const getproductnamesql = `SELECT SparePart_Name,Category_ID FROM Sparepart WHERE SparePart_ID = ?`
  //get productname first
  db.query(getproductnamesql, [sparepartId], (err, result) => {
    if(err)
    {
      return res.send(err)
    }
    const productname = result[0].SparePart_Name
    const category_id = result[0].Category_ID
    //update
    const sqlcommand = `UPDATE Sparepart SET SparePart_Amount = ?, SparePart_Price = ?, SparePart_Notify = ?, SparePart_NotifyAmount = ?
                        WHERE SparePart_ID = ?`;
    db.query(sqlcommand, [productamount, productprice, productnotify, productnotify_amount, sparepartId], function (err, results) {
      if (err) {
        return res.send(err);
      }
      console.log(results)
      const wltime = new Date(new Date().getTime()+7*60*60*1000).toISOString().slice(0, 19).replace('T', ' '); //utc -> gmt+7 thingy
      const wlactionid = 2
      const wldescription = `"${productname}" เป็นจำนวน ${productamount} หน่วย, ราคา ${productprice} บาท`
      const puttologtablesql = `INSERT INTO Warehouse_Log (SparePart_ID, WL_Time, WL_Description, user_id, Category_ID, WL_Action_ID)
                                VALUES (?,?,?,?,?,?)`
      db.query(puttologtablesql, [sparepartId, wltime, wldescription, user_id, category_id, wlactionid], function (err,result2) {
        if(err) {
          return res.send(err)
        }
        return res.json(result2);
      })
  });
})
});

router.get("/sparepart", (req, res) => {
  const ModelId = req.query.modelId;
  const query = `SELECT s.*, sml.Model_ID FROM Sparepart s JOIN Model_Link sml ON s.SparePart_ID = sml.SparePart_ID WHERE sml.Model_ID = ?` // query ที่จะดึงข้อมูลจากฐานข้อมูล 
  db.query(query, [ModelId], (err, results) => {
      if (err) {
          res.json(err)
      } else {
          res.json(results);
      }
  });
});

router.get("/sparepartcategory", (req, res) => {
  const ModelId = req.query.modelId;
  const Category = req.query.category
  const keyword = req.query.keyword || '';
  console.log(req.query)
  const query = `SELECT s.* FROM Sparepart s JOIN Model_Link sml ON s.SparePart_ID = sml.SparePart_ID WHERE sml.Model_ID = ? AND s.Category_ID = ? AND s.SparePart_Name LIKE ?;` // query ที่จะดึงข้อมูลจากฐานข้อมูล 
  db.query(query, [ModelId, Category, `%${keyword}%`], (err, results) => {
      if (err) {
          res.status(500).json({ message: "Error fetching data", error: err });
      } else {
          res.json(results);
      }
  });
});

router.post('/searchquery',function (req,res) {
  let {search_query, category} = req.body
  let querydata = [];
  let condition = [];

  let sqlcommand = `SELECT s.*, c.Category_Name, 
                      GROUP_CONCAT(DISTINCT CONCAT(b.Brand_Name, ' ', m.Model_Name, ' (', m.Model_Year, ')') ORDER BY m.Model_ID ASC SEPARATOR ' , ') AS Model_Details
                      FROM Sparepart s
                      JOIN Category c ON s.Category_ID = c.Category_ID
                      JOIN Model_Link ml ON s.SparePart_ID = ml.SparePart_ID
                      JOIN Model m ON ml.Model_ID = m.Model_ID
                      JOIN Brand b ON m.Brand_ID = b.Brand_ID
                      `

  //if category have selected
  if(category !== "")
  {
        condition.push("c.Category_Name = ?")
        querydata.push(category)
  }
  //if searching
  if(search_query !== "")
  {
    condition.push("(s.SparePart_Name LIKE CONCAT('%', ?, '%') OR s.SparePart_ProductID LIKE CONCAT('%', ?, '%'))");
        querydata.push(search_query,search_query)
  }
  //if at least 1 condition
  if(condition.length > 0)
  {
      sqlcommand = sqlcommand+" WHERE "+condition.join(" and ")
  }
  //group order by
  sqlcommand = sqlcommand+" GROUP BY s.SparePart_ID ORDER BY s.SparePart_ID DESC;"
  console.log(sqlcommand,querydata)
  db.query(sqlcommand,querydata,(err,results) =>
  {
    if (err){
      return res.send(err)
    }
    else{
      res.json(results)
    }
  })
})


router.get('/categorytotal', function (req, res) {
  const modelId = req.query.modelId;
  let sparePartNames = req.query.sparePartNames; // Expecting comma-separated names

  if (!modelId || !sparePartNames) {
      return res.status(400).json({ message: "Missing required parameters" });
  }

  // Convert comma-separated string to an array
  sparePartNames = sparePartNames.split(",").map(name => name.trim());

  // Generate placeholders for each subcategory in the IN clause
  const placeholders = sparePartNames.map(() => '?').join(', ');

  const sqlcommand = `SELECT c.Category_ID, COALESCE(sc.Sub_Category_Name, 'Uncategorized') AS Sub_Category_Name, COUNT(s.SparePart_ID) AS TotalAmount  FROM Sparepart s JOIN Category c ON s.Category_ID = c.Category_ID 
                      LEFT JOIN Sub_Category sc ON sc.Category_ID = c.Category_ID AND s.SparePart_Name LIKE CONCAT('%', sc.Sub_Category_Name, '%')
                      JOIN Model_Link ml ON s.SparePart_ID = ml.SparePart_ID 
                      JOIN Model m ON ml.Model_ID = m.Model_ID 
                      WHERE ml.Model_ID = ? AND s.SparePart_Amount > 0 
                      GROUP BY c.Category_ID, sc.Sub_Category_Name 
                      ORDER BY c.Category_ID, sc.Sub_Category_Name`;

  // Execute query with dynamic placeholders
  db.query(sqlcommand, [modelId, ...sparePartNames], function (err, results) {
      if (err) {
          return res.status(500).json ({ message: "Database query error", error: err });
      } else {
          res.json(results);
      }
  });
});

router.get("/categories", (req, res) => {
  const query = `SELECT c.Category_ID, c.Category_Name, sc.Sub_Category_ID, sc.Sub_Category_Name
                FROM Category c
                LEFT JOIN Sub_Category sc ON c.Category_ID = sc.Category_ID`;
  
  db.query(query, [], (err, results) => {
      if (err) {
          return res.status(500).json({ message: "Error fetching categories", error: err });
      }
      const categoryData = {};
      results.forEach(row => {
          if (!categoryData[row.Category_ID]) {
              categoryData[row.Category_ID] = {
                  id: row.Category_ID,
                  name: row.Category_Name,
                  icon: "",
                  categoryId: row.Category_ID,
                  subcategories: []
              };
          }
          if (row.Sub_Category_Name) {
              categoryData[row.Category_ID].subcategories.push(row.Sub_Category_Name);
          }
      });
      const formattedCategories = Object.values(categoryData);
      formattedCategories.forEach(category => {
          if (category.name.includes("ยาง")) {
              category.icon = "https://cdn-icons-png.flaticon.com/128/14395/14395389.png";
          } else if (category.name.includes("จานเบรค")) {
              category.icon = "https://cdn-icons-png.flaticon.com/128/841/841118.png";
          } else if (category.name.includes("ล้อ")) {
              category.icon = "https://cdn-icons-png.flaticon.com/512/638/638410.png";
          } else if (category.name.includes("น้ำมันเครื่อง")) {
              category.icon = "https://cdn-icons-png.flaticon.com/128/798/798867.png";
          } else {
              category.icon = "https://cdn-icons-png.flaticon.com/128/3872/3872415.png"; // Default
          }
      });
      res.json(formattedCategories);
  });
});

router.get('/model-list', (req, res) => {
  const sql = `SELECT b.Brand_Name AS brand, m.Model_Name AS model, m.Model_Year AS year, m.Model_ID AS modelId 
               FROM Model m
               JOIN Brand b ON m.Brand_ID = b.Brand_ID;`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    return res.json(results);
  });
});

module.exports = router;