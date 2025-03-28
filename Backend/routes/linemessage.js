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

function generateFlexCarousel(data, timestamp) {
  const bubbles = [];
  const chunkSize = 10; //each bubble = 10 items
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    //body of flex message (map to res data)
    const contentBoxes = chunk.map(item => ({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: `${item.SparePart_Name}`,
          size: "sm",
          flex: 2,
          wrap: true,
          maxLines: 3
        },
        {
          type: "text",
          text: `${item.SparePart_Amount} ชิ้น`,
          size: "sm",
          flex: 1,
          align: "end",
          gravity: "top",
          color: "#FF4444"
        }
      ]
    }));
    const bubble = {
      type: "bubble",
      size: "giga",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "image",
            url: "https://vckracing.shop/images/LogoNavbar.png",
            size: "full",
            aspectRatio: "5:1",
            aspectMode: "cover"
          }
        ]
      },
      hero: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "🔧 แจ้งเตือนอะไหล่คงเหลือ 🚗",
            weight: "bold",
            size: "xl",
            align: "center",
            style: "italic"
          },
          {
            type: "text",
            text: `เวลา : ${timestamp}`,
            align: "center",
            size: "md",
            color: "#cdcdcd"
          },
          {
            type: "separator",
            margin: "md",
            color: "#666666"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            contents: [
              { type: "text", text: "ชื่ออะไหล่", weight: "bold", flex: 2 },
              { type: "text", text: "คงเหลือ", weight: "bold", flex: 1, align: "end" }
            ]
          },
          ...contentBoxes
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `หน้าที่ ${Math.floor(i / chunkSize) + 1}`,
            align: "end",
            color: "#cdcdcd",
            size: "sm",
            style: "italic"
          }
        ]
      }
    };
    bubbles.push(bubble);
  }
  return {
    type: "carousel",
    contents: bubbles
  };
}
async function sendtoline() {
  try {
    const timestamp = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    const { data } = await axios.get('https://vckracing.shop/api/getnotifyitem');
    const flexCarousel = generateFlexCarousel(data, timestamp);
    // split into 10 bubbles per carousel 
    const bubbleChunks = [];
    const bubbles = flexCarousel.contents;
    const maxpercarousel = 10;
    for (let i = 0; i < bubbles.length; i += maxpercarousel) {
      const chunk = bubbles.slice(i, i + maxpercarousel);
      bubbleChunks.push({
        type: 'carousel',
        contents: chunk
      });
    }
    //send 5 carousel per api call
    for (let i = 0; i < bubbleChunks.length; i += 5) {
      const messageBatch = bubbleChunks.slice(i, i + 5).map(carousel => ({
        type: 'flex',
        altText: 'แจ้งเตือนอะไหล่คงเหลือ',
        contents: carousel
      }));
      const response = await axios.post(
        'https://api.line.me/v2/bot/message/broadcast',
        {
          messages: messageBatch
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LINE_ACCESSTOKEN}`
          },
          httpsAgent: proxyAgent, //for some reason Line API just blocking Hostinger IP (unable to call API) so I rent proxy and use it
          timeout: 10000
        }
      );
      console.log(response.data);
    }
  } catch (err) {
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

//[min] [hour] [day of month] [month] [day of week] - UTC on server so this should be sent at 8am,8pm in GMT+7

let cronTask = []

//load cronjob from db
function loadAllCrons() {
  // stop all task
  cronTask.forEach(task => task.stop());
  cronTask = [];

  db.query('SELECT * FROM Cron', (err, result) => {
    if (err) return console.error('Error loading cron list', err);
    result.forEach(row => {
      if (cron.validate(row.Cron_expression)) {
        const task = cron.schedule(row.Cron_expression, () => {
          console.log(`Running cron at ${row.Cron_expression}`);
          sendtoline();
        });
        cronTask.push(task);
      }
    });
  });
}
//run
loadAllCrons();

router.get('/get-cronlist', (req, res) => {
  db.query('SELECT * FROM Cron ORDER BY Cron_ID', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ cronList: result });
  });
});

router.post('/add-cron', (req, res) => {
  const { cron_expression } = req.body;
  if (!cron.validate(cron_expression)) {
    return res.status(400).json({ error: 'Invalid cron expression' });
  }

  db.query('INSERT INTO Cron (Cron_expression) VALUES (?)', [cron_expression], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    loadAllCrons(); // reload cron ใหม่
    res.json({ success: true, id: result.insertId });
  });
});

router.put('/update-cron/:id', (req, res) => {
  const { cron_expression } = req.body;
  const id = req.params.id;

  if (!cron.validate(cron_expression)) {
    return res.status(400).json({ error: 'Invalid cron expression' });
  }

  db.query(`UPDATE Cron SET Cron_expression = ? WHERE Cron_ID = ?`, [cron_expression, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    loadAllCrons(); // reload new schedule
    res.json({ success: true, message: 'Cron updated' });
  });
});

router.delete('/delete-cron/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Cron WHERE Cron_ID = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    loadAllCrons(); // reload new schedule
    res.json({ success: true });
  });
});


//for debug purpose
router.get('/sendnotifytest', async (req, res) => {
  try {
    await sendtoline();
    res.json(res);
  } catch (err) {
    res.json(err);
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events;
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userText = event.message.text.trim();
        if (userText === "แจ้งเตือนอะไหล่คงเหลือ") {
          await sendtoline();
        }
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in /webhook:", err);
    res.sendStatus(200); //still need to return 200
  }
});


module.exports = router