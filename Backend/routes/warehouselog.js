const express = require('express');
const db = require('../db')
const router = express.Router();

//all log
router.get('/warehouselog', (req,res) => {
    const sqlcommand = `SELECT wl.*, u.user_username from warehouse_log wl join user u on wl.user_id = u.user_id order by wl_id desc`
    db.query(sqlcommand,(err,result) => 
    {
        if(err)
        {
            return res.send(err)
        }
        return res.json(result)
    })
})

//search one
router.post('/searchwarehousetime', (req, res) => { 
    let {search_time,search_time2,action,user_username} = req.body;
    console.log(req.body)
    let querydata = []
    let condition = []

    //based sql
    let sqlcommand = `SELECT wl.*, u.user_username from warehouse_log wl join user u on wl.user_id = u.user_id`

    //if have search time -> add date filter
    if(search_time && search_time.trim() !== "" && search_time2 && search_time2.trim() !== "")
    {
        condition.push("date(wl.wl_time) between ? and ?")
        querydata.push(search_time,search_time2)
    }
    //if have action select
    if(action && action.trim() !== "")
    {
        condition.push("wl_action = ?")
        querydata.push(action)
    }
    //if select user
    if(user_username && user_username.trim() !== "")
    {
        condition.push("u.user_username = ?")
        querydata.push(user_username)
    }
    //if have at least 1 condition (time,user,action searched), edit sql
    if(condition.length > 0)
    {
        sqlcommand = sqlcommand+" where "+condition.join(" and ")
    }
    //order
    sqlcommand = sqlcommand+" order by wl_id desc"

    console.log(sqlcommand,querydata)

    db.query(sqlcommand, querydata, (err, results) => {
        if(err){
            res.send(err)}
        else{
            res.json(results)
        }
    })
})

router.get('/getadminuser',(req,res) => {
    const sqlcommand = 'select distinct u.user_username from user u join warehouse_log wl on wl.user_id = u.user_id'
    db.query(sqlcommand, (err, result) => {
        if(err) {
            res.send(err)
        }
        else{
            res.json(result)
        }
    })
})


module.exports = router;