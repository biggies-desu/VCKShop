const express = require('express')
const mysql = require('mysql')
const axios = require('axios')
const cors = require('cors')
const FormData = require('form-data');
const multer  = require('multer')

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

app.get('/api/allsparepart',(req,res) => {
      const sqlcommand = "SELECT * FROM sparepart"
      db.query(sqlcommand,(err,data) => {
        if(err)     return res.json(err);
        return res.json(data)
      })
    })
  
app.post('/api/searchquery',function (req,res) {
    let search_query = req.body.search_query
    const sqlcommand = "SELECT * FROM `sparepart` where `SparePart_Name` LIKE CONCAT('%',?,'%') OR `SparePart_ProductID` LIKE CONCAT('%',?,'%')"
    db.query(sqlcommand,[search_query,search_query],function(err,results)
  {
    if (err)
    {
      throw err
    }
    else
    {
      res.json(results)
    }
  })
})

app.post('/api/addproduct', function (req,res) {
  let productname = req.body.productname
  let productID = req.body.productID
  let productcatagory = req.body.productcatagory
  let productamount = req.body.productamount
  let productprice = req.body.productprice
  let productbrand = req.body.productbrand
  let productmodel = req.body.productmodel
  let productyear = req.body.productyear
  let productdescription = req.body.productdescription
  let productimage = req.body.productimage

  console.log(req.body)
  
  const sqlcommand = "INSERT INTO `sparepart` (SparePart_ProductID, SparePart_Name, SparePart_Amount, SparePart_Price, SparePart_Brand, SparePart_Model, SparePart_Year, SparePart_Description, SparePart_Image, SparePart_Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  db.query(sqlcommand,[productID,productname,productamount,productprice,productbrand,productmodel,productyear,productdescription,productimage,productcatagory],function(err,results)
  {
    if(err)
    {
      throw err
    }
    else
    {
      res.json(results)
    }
  }
)
})

app.post('/login', function (req, res) {
  let username = req.body.username;
	let password = req.body.password;
  //get user/pass in body and check in database
  if (username && password)
  {
    const sqlcommand = 'SELECT * FROM `users` WHERE `username` = BINARY ? and `password` = BINARY ?'
    db.query(sqlcommand,[username,password],function(err, results)
  {
    //use this as debugging only!!!!
    //console.log(results) --> if there are query (have a username and password), you should see RowDataPacket { id: x, username: 'x', password: 'x' } as array[0], 
    if (err) //if there is error in query
    {
      throw err
    }
    //hardcode fr
    else if (results.length > 0 && results[0].id != 3) //if account exist (other acc)
    {
      res.send("Login successful")
      res.end()
    }
    else if (results.length > 0 && results[0].id == 3) //if account exist (and admin acc), kinda hardcode tho
    {
      res.send("Login successful as Admin")
      res.end()
    }
    else
    {
      res.send("Incorrect username or password!")
      res.end()
    }
  })
  }
  else
  {
    res.send("You must input username and password")
    res.end()
 }
})


app.listen(5000, () => 
    console.log("Server is running....")
)
