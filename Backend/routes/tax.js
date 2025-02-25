const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/getalltax', (req,res) => 
{
    //get all booking id then cal the tax
    //ต้องสภานะ = เสร็จสิ้น -> หักของในสต๊อก -> คำนวณภาษีคิด vat 
    const sqLcommand = `SELECT b.booking_id, b.booking_date, b.booking_time,
    round(sum(s.sparepart_price*bs.booking_sparepart_quantity)*0.07, 2) as totaltax,
    group_concat(s.sparepart_name SEPARATOR ', ') as sparepart_name
    from sparepart s JOIN booking_sparepart bs JOIN booking b 
    ON s.sparepart_ID = bs.sparepart_ID and b.booking_id = bs.booking_id Where b.booking_status = 'เสร็จสิ้นแล้ว'
    group by b.booking_id, b.booking_date order by b.booking_date asc, b.booking_time asc`
    db.query(sqLcommand,(err,results) => {
        if(err){
            return res.json(err)
        }
        return res.json(results)
    })
})
router.post('/getmonthtax', (req,res) => 
{
    const {search_time} = req.body
    console.log(search_time)
    const sqLcommand = `select b.booking_id, b.booking_date, b.booking_time,
    round(sum(s.sparepart_price*bs.booking_sparepart_quantity)*0.07, 2) as totaltax,
    group_concat(s.sparepart_name separator ', ') as sparepart_name
    from sparepart s join booking_sparepart bs join booking b on s.sparepart_ID = bs.sparepart_ID and b.booking_id = bs.booking_id
    where b.booking_status = 'เสร็จสิ้นแล้ว' and date_format(b.booking_date, '%Y-%m') = ?
    group by b.booking_id, b.booking_date
    order by b.booking_date asc, b.booking_time asc`
    db.query(sqLcommand,[search_time],(err,results) => {
        if(err){
            return res.json(err)
        }
            return res.json(results)
    })
})
router.get('/getcurrentmonthtotaltax', (req,res) => {
    const sqlcommand = `select round(sum(s.sparepart_price*bs.booking_sparepart_quantity)*0.07, 2) as totaltax
    from booking b join booking_sparepart bs on b.booking_id = bs.booking_id join sparepart s on s.sparepart_id = bs.sparepart_id
    where b.booking_status = 'เสร็จสิ้นแล้ว' and date_format(b.booking_date, '%Y-%m') = date_format(curdate(), '%Y-%m')`
    db.query(sqlcommand,(err,results) => {
        if(err){
            return res.json(err)
        }
            return res.json(results)
    })
})
router.post('/getselectmonthtotaltax', (req,res) => {
    const {search_time} = req.body
    console.log(search_time)
    const sqlcommand = `select round(sum(s.sparepart_price*bs.booking_sparepart_quantity)*0.07, 2) as totaltax
    from booking b join booking_sparepart bs on b.booking_id = bs.booking_id join sparepart s on s.sparepart_id = bs.sparepart_id
    where b.booking_status = 'เสร็จสิ้นแล้ว' and date_format(b.booking_date, '%Y-%m') = ?`
    db.query(sqlcommand,[search_time],(err,results) => {
        if(err){
            return res.json(err)
        }
            return res.json(results)
    })
})

router.get('/gettaxdetail/:id', (req,res) => {
    const searchbookingid = req.params.id
    const sqlcommand = `select bs.booking_sparepart_quantity, round((s.sparepart_price*bs.booking_sparepart_quantity)*0.07, 2) as taxprice, s.sparepart_productid, s.sparepart_name from sparepart
    join booking b join booking_sparepart bs on b.booking_id = bs.booking_id join sparepart s on s.sparepart_id = bs.sparepart_id
    where b.booking_status = 'เสร็จสิ้นแล้ว' and b.booking_id = ? group by bs.booking_id, bs.sparepart_id`
    db.query(sqlcommand,[searchbookingid],(err,results) => {
        if(err){
            return res.json(err)
        }
            return res.json(results)
    })
})

module.exports = router;