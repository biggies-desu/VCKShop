const express = require('express');
const db = require('../db')
const cron = require('node-cron');
const request = require('request')
const router = express.Router();

router.post('/addqueue', function (req,res) {
  let fullName = req.body.fullname

  let firstName = req.body.firstname
  let lastName = req.body.lastname
  let phoneNumber = req.body.phoneNumber
  let email = req.body.email

  let date = req.body.date
  let time = req.body.time
  let serviceType = req.body.serviceType
  let details = req.body.details
  let userID = req.body.userID || null //gonna check this again when login cookie/session are done
  console.log(req.body)
  //insert to booking table
  const sqlcommand1 = `INSERT INTO booking (Booking_Date,	Booking_Time,	Booking_FirstName, Booking_LastName, User_ID, Booking_Description, Service_ID)
                      VALUES (?,?,?,?,?,?,
                      (SELECT Service_ID FROM service WHERE Service_Name = ?)
                      )`
      db.query(sqlcommand1,[date,time,firstName,lastName,userID,details,serviceType],(err,data1) => {
        if(err)
        {
          return res.json(err)
        }
        //res.json(data1)
        //console.log(data1)
        //detail service type into queue
        const insertid = data1.insertId
        const sqlcommand2 = `INSERT INTO queue (Booking_ID, Queue_Status)
                            VALUES (?, 'ยังไม่เสร็จสิ้น')`
            db.query(sqlcommand2,[insertid],(err,data2) => {
              if(err)
              {
                return res.json(eer)
              }
              else
              {
                  res.json(data2)
              }
            })
      }) 
  //ยังไม่มี login เป็นหลักแหล่ง
})

router.get('/allqueue', function (req,res){
  const sqlcommand = `Select * from booking b
        INNER JOIN queue q WHERE b.Booking_ID = q.Booking_ID
        AND q.Queue_Status = 'ยังไม่เสร็จสิ้น'
        ORDER BY DATE(b.Booking_Date), b.Booking_Time DESC`
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
router.get('/queuehistory', function (req,res){
  const sqlcommand = `Select * from booking b
        INNER JOIN queue q WHERE b.Booking_ID = q.Booking_ID
        ORDER BY DATE(b.Booking_Date), b.Booking_Time DESC`
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
router.post('/deletequeue', function (req,res) {
  let deletequeueno = req.body.deletequeueno
  const sqlcommand = `UPDATE queue set Queue_Status = 'เสร็จสิ้นแล้ว' WHERE Queue_ID = ?`
  db.query(sqlcommand,[deletequeueno], function(err, results)
{
  if(err) {
    res.send(err)
  }
  else {
    res.json(results)
  }
  })
})
router.post('/searchqueuetime', function (req,res) {
  let time = req.body.search_time
  const sqlcommand = `SELECT * FROM booking b
                      INNER JOIN queue q ON b.Booking_ID = q.Booking_ID
                      WHERE q.Queue_Status = 'ยังไม่เสร็จสิ้น'
                      AND b.Booking_Date = ?
                      ORDER BY DATE(b.Booking_Date), b.Booking_Time DESC;`
  db.query(sqlcommand,[time],function(err,results){
  if(err){
    res.send(err)}
  else{
    res.json(results)
  }})
})

module.exports = router