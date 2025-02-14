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

module.exports = router;