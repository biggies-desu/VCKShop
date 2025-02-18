const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/warehouselog', (req,res) => {
    const sqlcommand = 'SELECT * from warehouse_log ORDER BY WL_ID DESC'
    db.query(sqlcommand,(err,result) => 
    {
        if(err)
        {
            return res.send(err)
        }
        return res.json(result)
    })
})

router.post('/searchwarehousetime', function (req, res) { 
    let time = req.body.search_time;
    let sqlcommand;
    let params = [];

    if (!time || time.trim() === "") {
        // ถ้าไม่มีค่าค้นหา ให้แสดงข้อมูลทั้งหมด
        sqlcommand = `SELECT * FROM warehouse_log ORDER BY WL_ID DESC`;
    } else {
        // แปลงจาก YYYY-MM-DD เป็น DD/MM/YYYY (ปี พ.ศ.)
        let dateParts = time.split("-"); // แยกปี เดือน วัน
        let formattedTime = `${parseInt(dateParts[2])}/${parseInt(dateParts[1])}/${parseInt(dateParts[0]) + 543}`; //แปลงให้เป็น DD/MM/YYYY ตาม WL_Time เป็นปี พศ.

        sqlcommand = `SELECT * FROM warehouse_log WHERE WL_Time LIKE ? ORDER BY WL_ID`;
        params = [`${formattedTime}%`];
    }

    db.query(sqlcommand, params, function (err, results) {
        if(err){
            res.send(err)}
        else{
            res.json(results)
        }
    })
})


module.exports = router;