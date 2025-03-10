const express = require('express');
const db = require('../db')
const cron = require('node-cron');
const request = require('request')
const axios = require('axios')
const router = express.Router();
const { HttpsProxyAgent } = require('https-proxy-agent');

require('dotenv').config();

const LINE_ACCESSTOKEN = process.env.LINE_ACCESSTOKEN
const proxyip = process.env.PROXY_IP
const proxyAgent = new HttpsProxyAgent(`${proxyip}`);

router.get('/getnotifyitem', (req,res) => {
  // if sparepartnotify is true
  // notifyamount = 0 (always notify) or amount is less than notifyamount
  const sqlcommand = `SELECT s.*, c.Category_Name from Sparepart s join Category c on s.Category_ID = c.Category_ID
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
//[min] [hour] [day of month] [month] [day of week]
cron.schedule('0 */8 * * *', async () => {
    try {
      const timestamp = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
      console.log(`Sending LINE notification at ${timestamp}`);
      const { data } = await axios.get('https://vckracing.shop/api/getnotifyitem');
      //fetch data
      const formatdata = data.map(item =>
        `- ${item.SparePart_Name} คงเหลือ ${item.SparePart_Amount} ชิ้น`
      ).join('\n');
      //generated full message
      const fullMessage = `แจ้งเตือนอะไหล่คงเหลือ\nเวลา : ${timestamp}\n${formatdata}`;
      const chars = Array.from(fullMessage); //char array
      const messageChunks = [];
      //more than 500 char then split to other chunk (since line can handle only 500 char/balloon)
      for (let i = 0; i < chars.length; i += 500) {
          messageChunks.push(chars.slice(i, i + 500).join(''));
      }
      //make it only 5 balloon per 1 line api call (accord to documentation)
      for (let i = 0; i < messageChunks.length; i += 5) {
        const batch = messageChunks.slice(i, i + 5).map(text => (
          {
            type: 'text',
            text: text
          }
        )
      );
      //sent to line api
      const response = await axios.post(
        'https://api.line.me/v2/bot/message/broadcast',
        { messages: batch },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LINE_ACCESSTOKEN}`
          },
          httpsAgent: proxyAgent,
          timeout: 10000
        }
      );
      console.log(response.data);
    }
  }
  catch (err) {
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
});

module.exports = router