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
    //using cron to schedule call line api
    //[min] [hour] [day of month] [month] [day of week]
cron.schedule('0 */3 * * *', () => { // notify every 3 hours
    const message = new Date().toLocaleString('th-TH')
      request.post(
        {
          url: 'http://localhost:5000/linemessage',
          json: { message: message }, //sent message to api/linemessage1
        },
        (err, response, body) => {
          if (err) {
            console.error('Error sending scheduled message:', err);
          } else {
            console.log('Scheduled message sent:', body);
          }
        }
      );
});

module.exports = router