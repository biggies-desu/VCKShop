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
  console.log(req.body)

  //insert to booking table
  const sqlcommand1 = `INSERT INTO Booking (Booking_Date,	Booking_Time,	Booking_FirstName, Booking_LastName, User_ID, Booking_Description, Booking_CarRegistration, Booking_Status)
                      VALUES (?,?,?,?,?,?,?,'รอดำเนินการ')`
    db.query(sqlcommand1,[date,time,firstName,lastName,userID,details,CarRegistration],(err,data1) => {
      if(err)
      {
        return res.json(err)
      }
      const insertid = data1.insertId
      const sqlcommand2 = `INSERT into Booking_Sparepart (Booking_ID, SparePart_ID, Booking_SparePart_Quantity) VALUES ?`
      const cartmap = cart.map(item => [insertid, item.SparePart_ID, item.quantity])
      db.query(sqlcommand2,[cartmap],(err,data2) => {
        if(err)
        {
          return res.json(err)
        }
        const sqlcommand3 = `insert into Booking_Service (booking_id, Service_ID) values ?`
        const servmap = selectedServices.map(item => [insertid, item.Service_ID])
        console.log(servmap)
        db.query(sqlcommand3,[servmap],(err,data3) => {
          if(err){
            return res.json(err)
          }
          else
          {
            res.json(data3)
          }
        })
    })
  }
) 
})

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


router.get('/allqueue', function (req,res){
  const sqlcommand = `SELECT * FROM Booking WHERE Booking_Status != 'เสร็จสิ้นแล้ว' ORDER BY DATE(Booking_Date) ASC`
  db.query(sqlcommand,function(err,results)
  {
  if(err)
  {
    res.send(err)
  }
  else
  {
    res.json(results)
  }
})
})

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
  const sqlcommand = `SELECT b.*, GROUP_CONCAT(t.Technician_Name SEPARATOR ', ') AS Technician_Names FROM Booking b
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

router.post('/queuehistorytime', function (req,res){
  let time1 = req.body.search_time;
  let time2 = req.body.search_time2;
  let sqlcommand;

  if (!time1 || time1.trim() === "" || !time2 || time2.trim() === "") {
    sqlcommand = `SELECT * FROM Booking ORDER BY DATE(Booking_Date) desc, Booking_time asc`
  } else {
    sqlcommand = `SELECT * FROM Booking where booking_date between ? and ? ORDER BY DATE(Booking_Date) desc, Booking_time asc`
  }

  db.query(sqlcommand, [time1,time2], function (err, results) {
    if(err){
      res.send(err)}
    else{
      res.json(results)
    }})
})

router.post('/searchqueuehistory', (req, res) => {
  let { search_time, search_time2, search_carregistration, search_status } = req.body;
  let querydata = [];
  let condition = [];

  let sql = `SELECT b.*, GROUP_CONCAT(t.Technician_Name SEPARATOR ', ') AS Technician_Names FROM Booking b
             LEFT JOIN Booking_Technician bt ON b.Booking_ID = bt.Booking_ID
             LEFT JOIN Technician t ON bt.Technician_ID = t.Technician_ID`;

  if (search_time && search_time2) {
    condition.push("b.Booking_Date BETWEEN ? AND ?");
    querydata.push(search_time, search_time2);
  }

  if (search_carregistration && search_carregistration.trim() !== "") {
    condition.push("b.Booking_CarRegistration LIKE CONCAT('%', ?, '%')");
    querydata.push(search_carregistration);
  }

  if (search_status && search_status.trim() !== "") {
    condition.push("Booking_Status = ?");
    querydata.push(search_status);
  }

  if (condition.length > 0) {
    sql += " WHERE " + condition.join(" AND ");
  }

  sql += " GROUP BY b.Booking_ID ORDER BY DATE(b.Booking_Date) DESC, b.Booking_Time ASC";

  db.query(sql, querydata, (err, results) => {
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

  const sql = `UPDATE Booking SET Booking_status = ? WHERE Booking_id = ?`;
  db.query(sql, [status, booking_id], function (err, result) {
    if (err) {
      return res.status(500).json({ error: err });
    }

    // ลดอะไหล่ถ้าเสร็จสิ้นแล้ว
    if (status === 'เสร็จสิ้นแล้ว') {
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
  let { search_time, search_time2, search_carregistration, search_status } = req.body;
  let querydata = [];
  let condition = [];

  // base SQL
  let sqlcommand = `SELECT * FROM Booking WHERE (Booking_Status = 'รอดำเนินการ' OR Booking_Status = 'กำลังดำเนินการ')`;

  // เงื่อนไขค้นหาช่วงวันที่
  if (search_time && search_time.trim() !== "" && search_time2 && search_time2.trim() !== "") {
    condition.push("Booking_Date BETWEEN ? AND ?");
    querydata.push(search_time, search_time2);
  }

  // เงื่อนไขค้นหาทะเบียนรถ
  if (search_carregistration && search_carregistration.trim() !== "") {
    condition.push("Booking_CarRegistration LIKE CONCAT('%', ?, '%')");
    querydata.push(search_carregistration);
  }

  if (search_status && search_status.trim() !== "") {
    condition.push("Booking_Status = ?");
    querydata.push(search_status);
  }

  // รวมเงื่อนไขทั้งหมด
  if (condition.length > 0) {
    sqlcommand += " AND " + condition.join(" AND ");
  }

  sqlcommand += " ORDER BY DATE(Booking_Date) ASC";

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


module.exports = router