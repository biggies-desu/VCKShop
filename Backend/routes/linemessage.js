const express = require('express');
const db = require('../db')
const cron = require('node-cron');
const request = require('request')
const axios = require('axios')
const router = express.Router();

require('dotenv').config();

const LINE_USERID = process.env.LINE_USERID
const LINE_ACCESSTOKEN = process.env.LINE_ACCESSTOKEN


router.post('/linemessage',(req,res) =>
    {
      //get message
      let message = req.body.message
      console.log(message)
      //set header
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESSTOKEN}`
      }
      //set body
      let body = JSON.stringify({
        "messages":[
            {
                "type":"text",
                "text":message
            }
        ]
    })
    request.post({
      url: 'https://api.line.me/v2/bot/message/broadcast',
      headers: headers,
      body: body
    }, (err, res, body) => {
      console.log(res)
  })
})

router.get('/getnotifyitem', (req,res) => {
  // if sparepartnotify is true
  // notifyamount = 0 (always notify) or amount is less than notifyamount
  const sqlcommand = `SELECT s.*, c.Category_Name from sparepart s join category c on s.Category_ID = c.Category_ID
                      where SparePart_Notify = 1
                      and (SparePart_NotifyAmount = 0 or SparePart_Amount < SparePart_NotifyAmount)`
  db.query(sqlcommand,(err,results) =>
{
  if(err)
  {
    res.send(err)
  }
  else {
    res.json(results)
  }
})
})
    //using cron to schedule call line api
    //[min] [hour] [day of month] [month] [day of week]
cron.schedule('0 */3 * * *', async () => { // notify every 3 hours
  try{
    const timestamp = new Date().toLocaleString('th-TH') //create timestamp
    const getnotifyitemapi = await axios.get('http://localhost:5000/getnotifyitem');
    const data = getnotifyitemapi.data
    
    //loop over data -> formatdata
    const formatdata = data.map(item => {
      return `- ${item.SparePart_Name} คงเหลือ ${item.SparePart_Amount} ชิ้น`
    }).join(`\n`)

    const message = `แจ้งเตือนอะไหล่คงเหลือ\nเวลา : ${timestamp}\n${formatdata}`
      request.post(
        {
          url: 'http://localhost:5000/linemessage',
          json: { message: message }, //sent message to api/linemessage
        },
        (err, response, body) => {
          if (err) {
            console.error('Error sending scheduled message:', err);
          } else {
            console.log('Scheduled message sent:', body);
          }
        }
      );
  }
  catch(err)
  {
    console.log(err)
  }
});

module.exports = router