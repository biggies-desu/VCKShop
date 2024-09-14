const express = require('express')
const mysql = require('mysql')
const axios = require('axios')
const cors = require('cors')
const FormData = require('form-data');

//require dotenv
require('dotenv').config();
const linetoken = process.env.LINE_API_NOTIFICATION

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vck-racingshop'
  })

const app = express();
app.use(express.json())
app.use(cors())

//hello world
app.get('/',(req, res) => {
  res.send("Hello world")
})


//test line api

let data = new FormData();
data.append('message', 'ทดสอบๆการส่ง API Line');

//test
app.get('/notifylinetest',(req,res) =>
{
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://notify-api.line.me/api/notify',
        timeout: 10000,
        headers: { 
          'Authorization': 'Bearer '+linetoken, 
          ...data.getHeaders()
        },
        data : data
      };
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
      res.end()
      
    }
)

app.get('/api/user',(req,res) => {
      const sqlcommand = "SELECT * FROM users"
      db.query(sqlcommand,(err,data) => {
        if(err)     return res.json(err);
        return res.json(data)
      })
    })


app.listen(5000, () => 
    console.log("Server is running....")
)
