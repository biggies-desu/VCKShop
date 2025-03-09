const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/getalltax', (req,res) => 
{
    //get all booking id then cal the tax
    //ต้องสภานะ = เสร็จสิ้น -> หักของในสต๊อก -> คำนวณภาษีคิด vat 
    const sqLcommand = `SELECT b.booking_id, b.booking_date, b.booking_time,
    round(sum(s.sparepart_price*bs.booking_sparepart_quantity),2) as totalprice,
    group_concat(s.sparepart_name SEPARATOR ', ') as sparepart_name
    from Sparepart s JOIN Booking_Sparepart bs JOIN Booking b 
    ON s.sparepart_ID = bs.sparepart_ID and b.booking_id = bs.booking_id Where b.booking_status = 'เสร็จสิ้นแล้ว'
    group by b.booking_id, b.booking_date order by b.booking_date desc, b.booking_time desc`
    db.query(sqLcommand,(err,results) => {
        if(err){
            return res.json(err)
        }
        return res.json(results)
    })
})

router.get('/getcurrentmonthtotalprice', (req,res) => {
    const sqlcommand = `select round(sum(s.sparepart_price*bs.booking_sparepart_quantity),2) as totalprice
    from Booking b join Booking_Sparepart bs on b.booking_id = bs.booking_id join Sparepart s on s.sparepart_id = bs.sparepart_id
    where b.booking_status = 'เสร็จสิ้นแล้ว' and date_format(b.booking_date, '%Y-%m') = date_format(curdate(), '%Y-%m')`
    db.query(sqlcommand,(err,results) => {
        if(err){
            return res.json(err)
        }
            return res.json(results)
    })
})

router.post('/getsearchtax', (req,res) => 
    {
        let {search_time, search_time2} = req.body
        search_time2 = search_time2 || search_time;
        console.log(search_time,search_time2)
        const sqLcommand = `select b.booking_id, b.booking_date, b.booking_time,
        round(sum(s.sparepart_price*bs.booking_sparepart_quantity),2) as totalprice,
        group_concat(s.sparepart_name separator ', ') as sparepart_name
        from Sparepart s join Booking_Sparepart bs join Booking b on s.sparepart_ID = bs.sparepart_ID and b.booking_id = bs.booking_id
        where b.booking_status = 'เสร็จสิ้นแล้ว' and date_format(b.booking_date, '%Y-%m-%d') between ? and ?
        group by b.booking_id, b.booking_date
        order by b.booking_date desc, b.booking_time desc`
        db.query(sqLcommand,[search_time,search_time2],(err,results) => {
            if(err){
                return res.json(err)
            }
                return res.json(results)
        })
    })

router.post('/getselecttotalprice', (req,res) => {
    const {search_time, search_time2} = req.body
    console.log(search_time,search_time2)
    const sqlcommand = `select round(sum(s.sparepart_price*bs.booking_sparepart_quantity),2) as totalprice
    from Booking b join Booking_Sparepart bs on b.booking_id = bs.booking_id join Sparepart s on s.sparepart_id = bs.sparepart_id
    where b.booking_status = 'เสร็จสิ้นแล้ว' and date_format(b.booking_date, '%Y-%m-%d') between ? and ?`
    db.query(sqlcommand,[search_time,search_time2],(err,results) => {
        if(err){
            return res.json(err)
        }
            return res.json(results)
    })
})

router.get('/default_vat', (req,res) => {
    const sqlcommand = 'select * from Default_Vat'
    db.query(sqlcommand,(err,results) => {
        if(err){
            return res.json(err)
        }
            return res.json(results)
    })
})

router.get('/gettaxdetail/:id', (req,res) => {
    const searchbookingid = req.params.id
    const sqlcommand = `
  SELECT bs.booking_sparepart_quantity, 
         ROUND(s.sparepart_price * bs.booking_sparepart_quantity) AS totalprice, 
         s.sparepart_productid, 
         s.sparepart_name 
  FROM Booking_Sparepart bs
  JOIN Sparepart s ON s.sparepart_id = bs.sparepart_id
  JOIN Booking b ON b.booking_id = bs.booking_id
  WHERE b.booking_status = 'เสร็จสิ้นแล้ว' AND b.booking_id = ?`;
    db.query(sqlcommand,[searchbookingid],(err,results) => {
        if(err){
            return res.json(err)
        }
            return res.json(results)
    })
})

module.exports = router;