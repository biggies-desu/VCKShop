const express = require('express');
const db = require('../db')
const router = express.Router();

router.get('/passchangelog', (req,res) => {
    const sql = `SELECT cpl.*, u.User_Username, u.User_Firstname from ChangePass_Log cpl join User u on cpl.User_ID = u.User_ID
                Order by cpl.CPL_Time DESC`
    db.query(sql,(err,result) => 
    {
        if(err)
        {
            return res.send(err)
        }
        return res.json(result)
    })
})

router.post('/searchpasschangelog', (req,res) => {
    let {search_time, search_time2, searchname} = req.body
    let querydata = []
    let condition = []
    console.log(req.body)

    let sqlcommand = `SELECT cpl.*, u.User_Username, u.User_Firstname from ChangePass_Log cpl join User u on cpl.User_ID = u.User_ID`

    //if have search time -> add date filter
    if(search_time && search_time.trim() !== "" && search_time2 && search_time2.trim() !== "")
    {
        condition.push("date(cpl.CPL_Time) between ? and ?")
        querydata.push(search_time,search_time2)
    }
    if(searchname && searchname.trim() !== "")
    {
        condition.push(`(u.User_Username LIKE CONCAT('%', ?, '%') 
                        OR u.User_Firstname LIKE CONCAT('%', ?, '%'))`)
        querydata.push(searchname, searchname)
    }

    if(condition.length > 0)
    {
        sqlcommand = sqlcommand+" where "+condition.join(" and ")
    }

                
    sqlcommand = sqlcommand+" Order by cpl.CPL_Time DESC"

    db.query(sqlcommand, querydata, (err, results) => {
        if(err){
            res.send(err)}
        else{
            res.json(results)
        }
    })
})

module.exports = router