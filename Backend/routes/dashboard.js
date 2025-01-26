const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/getdashboard_queuenum', function (req, res) {
    const sqlcommand = `SELECT 'All_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b
    WHERE b.Booking_ID = q.Booking_ID
    UNION ALL
    SELECT 'Today_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
    WHERE b.Booking_Date = CURDATE()
    UNION ALL
    SELECT 'Monthly_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
    WHERE MONTH(b.Booking_Date) = MONTH(CURRENT_DATE()) And YEAR(b.Booking_Date) = YEAR(CURRENT_DATE()) 
    UNION ALL
    SELECT 'Finished_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
    WHERE q.Queue_Status = 'เสร็จสิ้นแล้ว'
    UNION ALL
    SELECT 'Unfinished_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
    WHERE q.Queue_Status = 'ยังไม่เสร็จสิ้น'`
    db.query(sqlcommand,function(err,results){
    if(err) {res.send(err)}
    else {res.json(results)}
    })
  })
  
  router.get('/getdashboard_itemnum', function (req, res) {
    const sqlcommand = `SELECT 'ทุกรายการ' as label, COUNT(*) as value FROM sparepart`
    db.query(sqlcommand,function(err,results){
    if(err) {res.send(err)}
    else {res.json(results)}
    })
  })
  router.get('/getdashboard_itemtypenum', function (req,res){
    const sqlcommand = `SELECT Category_Name as label, COUNT(*) as value FROM sparepart s
    JOIN category c ON s.Category_ID = c.Category_ID
    GROUP BY c.Category_Name`
    db.query(sqlcommand,function(err,results){
      if(err) {res.send(err)}
      else {res.json(results)}
      })
  })
  router.get('/getdashboard_queuestatusnum', function (req, res) {
    const sqlcommand = `SELECT 'เสร็จสิ้นแล้ว' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
    WHERE q.Queue_Status = 'เสร็จสิ้นแล้ว'
    UNION ALL
    SELECT 'ยังไม่เสร็จสิ้น' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
    WHERE q.Queue_Status = 'ยังไม่เสร็จสิ้น'`
    db.query(sqlcommand,function(err,results){
    if(err) {res.send(err)}
    else {res.json(results)}
    })
  })

module.exports = router;