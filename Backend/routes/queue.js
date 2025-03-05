const express = require('express');
const db = require('../db')
const cron = require('node-cron');
const request = require('request')
const router = express.Router();

// ตรวจสอบจำนวนคิวที่จองไว้ในวันและเวลานั้น
router.post('/checkQueue', function (req, res) {
  let date = req.body.date;
  let time = req.body.time;

  const sqlcommand = `SELECT COUNT(*) AS queueCount FROM booking WHERE Booking_Date = ? AND Booking_Time = ?`;
  db.query(sqlcommand, [date, time], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดภายในระบบ" });
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
  const sqlcommand1 = `INSERT INTO booking (Booking_Date,	Booking_Time,	Booking_FirstName, Booking_LastName, User_ID, Booking_Description, Booking_CarRegistration, Booking_Status)
                      VALUES (?,?,?,?,?,?,?,'ยังไม่เสร็จสิ้น')`
    db.query(sqlcommand1,[date,time,firstName,lastName,userID,details,CarRegistration],(err,data1) => {
      if(err)
      {
        return res.json(err)
      }
      const insertid = data1.insertId
      const sqlcommand2 = `INSERT into booking_sparepart (Booking_ID, SparePart_ID, Booking_SparePart_Quantity) VALUES ?`
      const cartmap = cart.map(item => [insertid, item.SparePart_ID, item.quantity])
      db.query(sqlcommand2,[cartmap],(err,data2) => {
        if(err)
        {
          return res.json(err)
        }
        const sqlcommand3 = `insert into booking_service (booking_id, Service_ID) values ?`
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
  const sql = 'DELETE FROM booking WHERE booking_id = ?';
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
  const sqlcommand = `SELECT * FROM booking WHERE booking_status = 'ยังไม่เสร็จสิ้น' ORDER BY DATE(Booking_Date) ASC`
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
  const getproductnamesql = `SELECT * FROM booking WHERE Booking_ID = ?`;
  db.query(getproductnamesql, [bookingId], function (err, result){
    if(err)
    {
      return res.send(err)
    }
    //update
    const sqlcommand = `UPDATE booking SET Booking_Date = ?, Booking_Time = ? WHERE Booking_ID = ?`;
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

router.get('/queuehistory', function (req,res){
  const sqlcommand = `SELECT * FROM booking ORDER BY DATE(Booking_Date), Booking_Time DESC`
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

router.post('/finishqueue', function (req,res) {
  let finishqueueno = req.body.finishqueueno //booking_id
  //set to finished
  const sqlcommand = `UPDATE Booking set Booking_status = 'เสร็จสิ้นแล้ว' WHERE Booking_id = ?`
  db.query(sqlcommand,[finishqueueno], function(err, results)
{
  if(err) {
    res.send(err)
  }
  //reduce sparepart when click finish
  const sqlcommand2 = `UPDATE Sparepart s JOIN Booking_Sparepart bs on s.Sparepart_ID = bs.Sparepart_ID
                      set s.Sparepart_Amount = s.Sparepart_Amount - bs.Booking_SparePart_Quantity
                      where bs.Booking_ID = ?`
  db.query(sqlcommand2,[finishqueueno], (err,results) => {
    if(err){
      res.send(err)
    }
    else
    {
      res.json(results)
    }
  })
  })
})

router.post('/searchqueuetime', function (req, res) {
  let time1 = req.body.search_time;
  let time2 = req.body.search_time2;
  let sqlcommand;

  if (!time1 || time1.trim() === "" || !time2 || time2.trim() === "") {
    sqlcommand = `select * from booking
                  where Booking_Status = 'ยังไม่เสร็จสิ้น'
                  order by date(Booking_Date);`
  } else {
    sqlcommand = `select * from booking
                  where Booking_Status = 'ยังไม่เสร็จสิ้น'
                  and Booking_Date between ? and ?
                  order by date(Booking_Date);`
  }

  db.query(sqlcommand, [time1,time2], function (err, results) {
    if(err){
      res.send(err)}
    else{
      res.json(results)
    }})
  })

module.exports = router