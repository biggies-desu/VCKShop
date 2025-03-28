const express = require('express');
const db = require('../db')
const cron = require('node-cron');
const request = require('request')
const router = express.Router();

// ตรวจสอบจำนวนคิวที่จองไว้ในวันและเวลานั้น
router.post('/checkQueue', function (req, res) {
  let date = req.body.date;
  let time = req.body.time;

  const sqlcommand = `SELECT COUNT(*) AS queueCount FROM Booking WHERE Booking_Date = ? AND Booking_Time = ?`;
  db.query(sqlcommand, [date, time], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "err" });
    }
    const queueCount = results[0].queueCount;
    res.json({ queueCount, isFull: queueCount >= 3 });
  });
});

router.post('/addqueue', function (req,res) {
  let firstName = req.body.firstname
  let lastName = req.body.lastname
  let phoneNumber = req.body.phoneNumber
  let email = req.body.email
  let CarRegistration = req.body.CarRegistration
  let date = req.body.date
  let time = req.body.time
  let details = req.body.details
  let userID = req.body.userID
  let cart = req.body.cart
  let selectedServices = req.body.selectedServices
  let province = req.body.province
  let modelId = req.body.modelId
  console.log(req.body)

  const getUserSql = `SELECT User_Firstname, User_Lastname, User_Telephone, User_Email FROM User WHERE User_ID = ?`;
  db.query(getUserSql, [userID], (err, data) => {
  if (err) return res.json(err);
  const currentUser = data[0];
  const updatedFields = {};
    
  // check which fields are missing/null in DB, if avaliable fetch them
  if (!currentUser.User_Firstname && firstName) updatedFields.User_Firstname = firstName;
  if (!currentUser.User_Lastname && lastName) updatedFields.User_Lastname = lastName;
  if ((!currentUser.User_Telephone || currentUser.User_Telephone === '') && phoneNumber) updatedFields.User_Telephone = phoneNumber;
  if ((!currentUser.User_Email || currentUser.User_Email === '') && email) updatedFields.User_Email = email;
  //update them
  const updateKeys = Object.keys(updatedFields);
    if (updateKeys.length > 0) {
      const setClause = updateKeys.map(key => `${key} = ?`).join(', ');
      const values = updateKeys.map(key => updatedFields[key]);

      const updateSql = `UPDATE User SET ${setClause} WHERE User_ID = ?`;
      db.query(updateSql, [...values, userID], (err, updateResult) => {
        if (err)
          console.log(err);
      });
    }})

  //check car
  const checkCarSql = 'SELECT * FROM Car WHERE Car_RegisNum = ? AND User_ID = ?';
    db.query(checkCarSql, [CarRegistration, userID], (err, carRows) => {
      if (err) return res.status(500).json(err);

      if (carRows.length === 0) {
        const provinceInsert = `SELECT Province_ID FROM Province WHERE Province_Name = ?`;
        db.query(provinceInsert, [province], (err, provinceRows) => {
          if (err) return res.status(500).json(err);
          const provinceId = provinceRows.length > 0 ? provinceRows[0].Province_ID : null;

          const insertCarSql = `INSERT INTO Car (Car_RegisNum, Province_ID, User_ID, Model_ID) VALUES (?, ?, ?, ?)`;
          db.query(insertCarSql, [CarRegistration, provinceId, userID, modelId || null], (err, carResult) => {
            if (err) return res.status(500).json(err);
            const newCarId = carResult.insertId;
            insertBooking(newCarId); // insert new car ud
          });
        });
      } else {
        insertBooking(carRows[0].Car_ID); // just send
      }
    });


  //insert to booking table
  function insertBooking(carId) {
    const status = 1;
    const sqlcommand1 = `INSERT INTO Booking (Booking_Date, Booking_Time, Booking_Description, Booking_Status_ID, Car_ID)
      VALUES (?, ?, ?, ?, ?)`;
    db.query(sqlcommand1, [date, time, details, status, carId], (err, data1) => {
      if (err) return res.json(err);
      const insertId = data1.insertId;
  
      const cartMap = cart.map(item => [insertId, item.SparePart_ID, item.quantity]);
      if (cartMap.length > 0) {
        const sqlcommand2 = `INSERT INTO Booking_Sparepart (Booking_ID, SparePart_ID, Booking_SparePart_Quantity) VALUES ?`;
        db.query(sqlcommand2, [cartMap], (err) => {
          if (err) return res.json(err);
          insertServices(insertId);
        });
      } else {
        insertServices(insertId);
      }
  
      function insertServices(bookingId) {
        const servMap = selectedServices.map(item => [bookingId, item.Service_ID]);
        if (servMap.length > 0) {
          const sqlcommand3 = `INSERT INTO Booking_Service (Booking_ID, Service_ID) VALUES ?`;
          db.query(sqlcommand3, [servMap], (err, data3) => {
            if (err) return res.status(500).json(err);
            res.json({ success: true, bookingId });
          });
        } else {
          res.json({ success: true, bookingId });
        }
      }
    });
  }
});

router.delete('/deletequeue/:id', (req, res) => {
  let deletequeueno = req.params.id;
  const sql = 'DELETE FROM Booking WHERE Booking_id = ?';
  db.query(sql, [deletequeueno], (err, results) => {
    if(err)
      {
        res.send(err)
      }
      else
      {
        res.json(results)
      }
  });
});


router.get('/allqueue', function (req, res) {
  const sqlcommand = `
    SELECT b.*, m.*, mn.Model_Name, c.Car_RegisNum, c.Model_ID, p.Province_Name ,u.User_Firstname,u.User_Lastname, bs.Booking_Status_Name,
    GROUP_CONCAT(t.Technician_Name SEPARATOR ', ') AS Technician_Names
    FROM Booking b JOIN Car c ON b.Car_ID = c.Car_ID JOIN User u ON c.User_ID = u.User_ID           
    JOIN Booking_Status bs ON b.Booking_Status_ID = bs.Booking_Status_ID
    JOIN Province p on c.Province_ID = p.Province_ID
    JOIN Model m on m.Model_ID = c.Model_ID
    JOIN Model_Name mn on m.Model_Name_ID = mn.Model_Name_ID
    LEFT JOIN Booking_Technician bt ON b.Booking_ID = bt.Booking_ID 
    LEFT JOIN Technician t ON bt.Technician_ID = t.Technician_ID    
    WHERE b.Booking_Status_ID != 3
    GROUP BY b.Booking_ID
    ORDER BY DATE(b.Booking_Date) DESC, b.Booking_Time ASC;
  `;

  db.query(sqlcommand, function (err, results) {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
});

router.put('/updatequeue/:id', function (req, res) {
  const bookingId  = req.params.id;
  let bookingdate = req.body.bookingdate;
  let bookingtime = req.body.bookingtime;
  const getproductnamesql = `SELECT * FROM Booking WHERE Booking_ID = ?`;
  db.query(getproductnamesql, [bookingId], function (err, result){
    if(err)
    {
      return res.send(err)
    }
    //update
    const sqlcommand = `UPDATE Booking SET Booking_Date = ?, Booking_Time = ? WHERE Booking_ID = ?`;
    db.query(sqlcommand, [bookingdate, bookingtime, bookingId], function (err, results) {
      if(err){
        res.send(err)
      }
      else{
        res.json(results)
      }
    })
  })
})

router.get('/queuehistory', function (req, res) {
  const sqlcommand = `SELECT b.*, m.*, mn.Model_Name, c.Car_RegisNum, c.Model_ID, p.Province_Name ,u.User_Firstname,u.User_Lastname, bs.Booking_Status_Name,
    GROUP_CONCAT(t.Technician_Name SEPARATOR ', ') AS Technician_Names
    FROM Booking b JOIN Car c ON b.Car_ID = c.Car_ID JOIN User u ON c.User_ID = u.User_ID           
    JOIN Booking_Status bs ON b.Booking_Status_ID = bs.Booking_Status_ID
    JOIN Province p on c.Province_ID = p.Province_ID
    JOIN Model m on m.Model_ID = c.Model_ID
    JOIN Model_Name mn on m.Model_Name_ID = mn.Model_Name_ID
    LEFT JOIN Booking_Technician bt ON b.Booking_ID = bt.Booking_ID 
    LEFT JOIN Technician t ON bt.Technician_ID = t.Technician_ID
    GROUP BY b.Booking_ID
    ORDER BY DATE(b.Booking_Date) DESC, b.Booking_Time ASC`;

  db.query(sqlcommand, function (err, results) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});


router.post('/searchqueuehistory', (req, res) => {
  let { search_time, search_time2, search_carregistration, search_status } = req.body;
  let querydata = [];
  let condition = [];
  console.log(req.body)

  let sqlcommand = `SELECT b.*, m.*, mn.Model_Name, c.Car_RegisNum, c.Model_ID, p.Province_Name ,u.User_Firstname,u.User_Lastname, bs.Booking_Status_Name,
    GROUP_CONCAT(t.Technician_Name SEPARATOR ', ') AS Technician_Names
    FROM Booking b JOIN Car c ON b.Car_ID = c.Car_ID JOIN User u ON c.User_ID = u.User_ID           
    JOIN Booking_Status bs ON b.Booking_Status_ID = bs.Booking_Status_ID
    JOIN Province p on c.Province_ID = p.Province_ID
    JOIN Model m on m.Model_ID = c.Model_ID
    JOIN Model_Name mn on m.Model_Name_ID = mn.Model_Name_ID
    LEFT JOIN Booking_Technician bt ON b.Booking_ID = bt.Booking_ID 
    LEFT JOIN Technician t ON bt.Technician_ID = t.Technician_ID`;
  if (search_time && search_time2) {
    condition.push("b.Booking_Date BETWEEN ? AND ?");
    querydata.push(search_time, search_time2);
  }

  if (search_carregistration && search_carregistration.trim() !== "") {
    condition.push("c.Car_RegisNum LIKE CONCAT('%', ?, '%')");
    querydata.push(search_carregistration);
  }

  if (search_status && search_status.trim() !== "") {
    condition.push("b.Booking_Status_ID = ?");
    querydata.push(search_status);
  }

  if (condition.length > 0) {
    sqlcommand += " WHERE " + condition.join(" AND ");
  }

  sqlcommand += " GROUP BY b.Booking_ID ORDER BY b.Booking_Date DESC, b.Booking_Time ASC";

  db.query(sqlcommand, querydata, (err, results) => {
    if (err) {
      console.log("searchqueuehistory error:", err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});


router.post('/updatequeue_status', function (req, res) {
  const booking_id = req.body.booking_id;
  const status = req.body.status;
  console.log(req.body)

  const sql = `UPDATE Booking SET Booking_status_ID = ? WHERE Booking_id = ?`;
  db.query(sql, [status, booking_id], function (err, result) {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (status === 3) {
      const sparepartSql = `UPDATE Sparepart s 
                            JOIN Booking_Sparepart bs ON s.Sparepart_ID = bs.SparePart_ID
                            SET s.Sparepart_Amount = s.Sparepart_Amount - bs.Booking_SparePart_Quantity
                            WHERE bs.Booking_ID = ?`;

      db.query(sparepartSql, [booking_id], (err2, result2) => {
        if (err2) return res.status(500).json({ error: err2 });
        return res.json({ message: 'อัปเดตสถานะ + ลดอะไหล่เรียบร้อย' });
      });
    } else {
      return res.json({ message: 'อัปเดตสถานะเรียบร้อย' });
    }
  });
});


router.get('/technician', (req,res) => {
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

router.post('/searchqueue', (req, res) => {
  console.log(req.body)
  let { search_time, search_time2, search_carregistration, search_status } = req.body;
  let querydata = [];
  let condition = [];

  // base SQL
  let sqlcommand = `SELECT b.*, m.*, mn.Model_Name, c.Car_RegisNum, c.Model_ID, p.Province_Name ,u.User_Firstname,u.User_Lastname, bs.Booking_Status_Name,
    GROUP_CONCAT(t.Technician_Name SEPARATOR ', ') AS Technician_Names
    FROM Booking b JOIN Car c ON b.Car_ID = c.Car_ID JOIN User u ON c.User_ID = u.User_ID           
    JOIN Booking_Status bs ON b.Booking_Status_ID = bs.Booking_Status_ID
    JOIN Province p on c.Province_ID = p.Province_ID
    JOIN Model m on m.Model_ID = c.Model_ID
    JOIN Model_Name mn on m.Model_Name_ID = mn.Model_Name_ID
    LEFT JOIN Booking_Technician bt ON b.Booking_ID = bt.Booking_ID 
    LEFT JOIN Technician t ON bt.Technician_ID = t.Technician_ID`;

  // Add WHERE clause base
  condition.push("b.Booking_Status_ID != 3"); // always exclude status 3

  // filter by date range
  if (search_time && search_time.trim() !== "" && search_time2 && search_time2.trim() !== "") {
    condition.push("b.Booking_Date BETWEEN ? AND ?");
    querydata.push(search_time, search_time2);
  }

  // filter by car registration
  if (search_carregistration && search_carregistration.trim() !== "") {
    condition.push("c.Car_RegisNum LIKE CONCAT('%', ?, '%')");
    querydata.push(search_carregistration);
  }

  // filter by status
  if (search_status && search_status.trim() !== "") {
    condition.push("b.Booking_Status_ID = ?");
    querydata.push(search_status);
  }

  // append WHERE conditions
  if (condition.length > 0) {
    sqlcommand += " WHERE " + condition.join(" AND ");
  }

  sqlcommand += " GROUP BY b.Booking_ID ORDER BY DATE(b.Booking_Date) DESC";

  console.log(sqlcommand, querydata);

  db.query(sqlcommand, querydata, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
});


router.post('/assign_technicians', (req, res) => {
  const { booking_id, technician_ids } = req.body;

  if (!Array.isArray(technician_ids)) {
    return res.status(400).json();
  }

  const deleteSql = `DELETE FROM Booking_Technician WHERE Booking_ID = ?`;
  db.query(deleteSql, [booking_id], (err1) => {
    if (err1) return res.status(500).json({ error: err1 });

    if (technician_ids.length === 0) {
      return res.json();
    }

    const values = technician_ids.map(tid => [booking_id, tid]);
    const insertSql = `INSERT INTO Booking_Technician (Booking_ID, Technician_ID) VALUES ?`;

    db.query(insertSql, [values], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json(result );
    });
  });
});


router.get('/booking_technicians/:booking_id', (req, res) => {
  const booking_id = req.params.booking_id;
  const sql = `SELECT t.Technician_ID, t.Technician_Name FROM Booking_Technician bt
               JOIN Technician t ON bt.Technician_ID = t.Technician_ID
               WHERE bt.Booking_ID = ?`;
  db.query(sql, [booking_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

router.get('/getcarregisbyuser/:userid/:modelid?', (req, res) => {
  const { userid, modelid } = req.params;
  let sql = `
    SELECT c.Car_ID, c.Car_RegisNum, c.Model_ID, c.Province_ID, p.Province_Name
    FROM Car c
    LEFT JOIN Province p ON c.Province_ID = p.Province_ID
    WHERE c.User_ID = ?
  `;
  const params = [userid];
  if (modelid && modelid !== 'null') {
    sql += ' AND c.Model_ID = ?';
    params.push(modelid);
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router