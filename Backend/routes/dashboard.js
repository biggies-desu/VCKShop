const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/getdashboard_queuenum', function (req, res) {
    const sqlcommand = `SELECT 'All_Queue' AS label, COUNT(*) AS value FROM Booking
                        UNION ALL SELECT 'Today_Queue' AS label, COUNT(*) AS value FROM Booking WHERE Booking_Date = CURDATE()
                        UNION ALL SELECT 'Monthly_Queue' AS label, COUNT(*) AS value FROM Booking WHERE MONTH(Booking_Date) = MONTH(CURRENT_DATE()) AND YEAR(Booking_Date) = YEAR(CURRENT_DATE())
                        UNION ALL SELECT 'Finished_Queue' AS label, COUNT(*) AS value FROM Booking WHERE Booking_Status = 'เสร็จสิ้นแล้ว'
                        UNION ALL SELECT 'Inprogress_Queue' AS label, COUNT(*) AS value FROM Booking WHERE Booking_Status = 'กำลังดำเนินการ'
                        UNION ALL SELECT 'Unfinished_Queue' AS label, COUNT(*) AS value FROM Booking WHERE Booking_Status = 'รอดำเนินการ';`
    db.query(sqlcommand,function(err,results){
    if(err) {res.send(err)}
    else {res.json(results)}
    })
  })
  
  router.get('/getdashboard_itemnum', function (req, res) {
    const sqlcommand = `SELECT 'ทุกรายการ' as label, COUNT(*) as value FROM Sparepart`
    db.query(sqlcommand,function(err,results){
    if(err) {res.send(err)}
    else {res.json(results)}
    })
  })
  router.get('/getdashboard_itemtypenum', function (req,res){
    const sqlcommand = `SELECT Category_Name as label, COUNT(*) as value FROM Sparepart s
    JOIN Category c ON s.Category_ID = c.Category_ID
    GROUP BY c.Category_Name`
    db.query(sqlcommand,function(err,results){
      if(err) {res.send(err)}
      else {res.json(results)}
      })
  })
  router.get('/getdashboard_queuestatusnum', function (req, res) {
    const sqlcommand = `SELECT 'รอดำเนินการ' AS label, COUNT(*) AS value FROM Booking WHERE Booking_Status = 'รอดำเนินการ'
                        UNION ALL SELECT 'กำลังดำเนินการ' AS label, COUNT(*) AS value FROM Booking WHERE Booking_Status = 'กำลังดำเนินการ'
                        UNION ALL SELECT 'เสร็จสิ้นแล้ว' AS label, COUNT(*) AS value FROM Booking WHERE Booking_Status = 'เสร็จสิ้นแล้ว';`
    db.query(sqlcommand,function(err,results){
    if(err) {res.send(err)}
    else {res.json(results)}
    })
  })
  router.get('/getdashboard_notifynum', function (req,res) {
    const sqlcommand = `SELECT 'จำนวนอะไหล่ที่แจ้งเตือน' as label, COUNT(*) AS value FROM Sparepart WHERE SparePart_Notify = 1 
                    AND (SparePart_NotifyAmount = 0 OR SparePart_NotifyAmount > SparePart_Amount);`
      db.query(sqlcommand,function(err,results){
        if(err){
          res.send(err)
        }
        else{
          res.json(results)
        }
      })
  })

module.exports = router;