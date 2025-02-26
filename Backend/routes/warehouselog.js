const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/warehouselog', (req,res) => {
    const sqlcommand = `SELECT wl.*, u.user_username from warehouse_log wl join user u on wl.user_id = u.user_id ORDER BY WL_ID DESC`
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
        sqlcommand = `SELECT wl.*, u.user_username from warehouse_log wl
    join user u on wl.user_id = u.user_id
    ORDER BY WL_ID DESC`;
    } else {
        sqlcommand = `SELECT wl.*, u.user_username from warehouse_log wl join user u on wl.user_id = u.user_id where DATE(wl_time) = ? ORDER BY WL_ID DESC`
    }
    db.query(sqlcommand, time, function (err, results) {
        if(err){
            res.send(err)}
        else{
            res.json(results)
        }
    })
})


module.exports = router;