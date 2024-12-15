const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const request = require('request')
const FormData = require('form-data');
const multer  = require('multer')
const cron = require('node-cron');
const bodyParser = require('body-parser')

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");

//require dotenv
require('dotenv').config();
const LINE_USERID = process.env.LINE_USERID
const LINE_ACCESSTOKEN = process.env.LINE_ACCESSTOKEN

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

app.post('/api/linemessage1',(req,res) =>
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
  //post to line api
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
cron.schedule('0 */3 * * *', () => { //every 10 mins
  const message = new Date().toLocaleString('th-TH')
  request.post(
    {
      url: 'http://localhost:5000/api/linemessage1',
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



//todo, create table if not exist
app.get('/api/user',(req,res) => {
      const sqlcommand = "SELECT * FROM user"
      db.query(sqlcommand,(err,data) => {
        if(err)     return res.json(err);
        return res.json(data)
      })
    })

app.get('/api/allsparepart',(req,res) => {
      const sqlcommand = "SELECT * FROM `sparepart` join `category` ON sparepart.Category_ID = category.Category_ID;"
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
    if (err){
      throw err
    }
    else{
      res.json(results)
    }
  })
})

app.get('/api/getdropdowncategory',(req,res) => {
  const sqlcommand = "SELECT Category_Name FROM category"
  db.query(sqlcommand,(err,data) => {
    if(err)     return res.json(err);
    return res.json(data)
  })
})
app.get('/api/getdropdownbrand',(req,res) => {
  const sqlcommand = "SELECT SparePart_Brand_Name FROM sparepart_brand"
  db.query(sqlcommand,(err,data) => {
    if(err)     return res.json(err);
    return res.json(data)
  })
})

app.post('/api/getdropdownmodel',function (req,res) {
  let brandname = req.body.brandname
  console.log(req.body)
  const sqlcommand = `SELECT DISTINCT SparePart_Model_Name FROM sparepart_model
                      JOIN SparePart_Brand ON sparepart_model.SparePart_Brand_ID = SparePart_Brand.SparePart_Brand_ID
                      WHERE SparePart_Brand.SparePart_Brand_Name = ?`;
  db.query(sqlcommand,[brandname],function(err,results)
  {
      if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(results)
      }
  })
})

app.post('/api/getdropdownyear',function (req,res) {
  let modelname = req.body.modelname
  console.log(req.body)
  const sqlcommand = `SELECT DISTINCT SparePart_Model_Year FROM sparepart_model 
                      WHERE SparePart_Model_Name = ?;`
  db.query(sqlcommand,[modelname],function(err,results)
  {
      if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(results)
      }
  })
})

app.get('/api/getdropdownservice', function(req,res)
{ const sqlcommand = `SELECT Service_Name from service`
  db.query(sqlcommand,(err,data) => {
    if(err)
    {
      return res.json(err)
    }
    else
    {
      res.json(data)
    }
  })
})
app.post('/api/addqueue', function (req,res) {
  let fullName = req.body.fullname

  let firstName = req.body.firstname
  let lastName = req.body.lastname
  let phoneNumber = req.body.phoneNumber
  let email = req.body.email

  let date = req.body.date
  let time = req.body.time
  let serviceType = req.body.serviceType
  let details = req.body.details
  let userID = req.body.userID || null //gonna check this again when login cookie/session are done
  console.log(req.body)
  //insert to booking table
  const sqlcommand1 = `INSERT INTO booking (Booking_Date,	Booking_Time,	Booking_FirstName, Booking_LastName, User_ID, Booking_Description, Service_ID)
                      VALUES (?,?,?,?,?,?,
                      (SELECT Service_ID FROM service WHERE Service_Name = ?)
                      )`
      db.query(sqlcommand1,[date,time,firstName,lastName,userID,details,serviceType],(err,data1) => {
        if(err)
        {
          return res.json(err)
        }
        //res.json(data1)
        //console.log(data1)
        //detail service type into queue
        const insertid = data1.insertId
        const sqlcommand2 = `INSERT INTO queue (Booking_ID, Queue_Status)
                            VALUES (?, 'ยังไม่เสร็จสิ้น')`
            db.query(sqlcommand2,[insertid],(err,data2) => {
              if(err)
              {
                return res.json(eer)
              }
              else
              {
                  res.json(data2)
              }
            })
      }) 
  //ยังไม่มี login เป็นหลักแหล่ง
})

app.get('/api/allqueue', function (req,res){
  const sqlcommand = `Select * from booking b
        INNER JOIN queue q WHERE b.Booking_ID = q.Booking_ID
        AND q.Queue_Status = 'ยังไม่เสร็จสิ้น'
        ORDER BY DATE(b.Booking_Date), b.Booking_Time DESC`
  db.query(sqlcommand,function(err,results)
{
  if(err)
  {
    res.send(err)
  }
  else
  {
    res.json(results)
  }
})
})
app.get('/api/queuehistory', function (req,res){
  const sqlcommand = `Select * from booking b
        INNER JOIN queue q WHERE b.Booking_ID = q.Booking_ID
        ORDER BY DATE(b.Booking_Date), b.Booking_Time DESC`
  db.query(sqlcommand,function(err,results)
{
  if(err)
  {
    res.send(err)
  }
  else
  {
    res.json(results)
  }
})
})
app.post('/api/deletequeue', function (req,res) {
  let deletequeueno = req.body.deletequeueno
  const sqlcommand = `UPDATE queue set Queue_Status = 'เสร็จสิ้นแล้ว' WHERE Queue_ID = ?`
  db.query(sqlcommand,[deletequeueno], function(err, results)
{
  if(err) {
    res.send(err)
  }
  else {
    res.json(results)
  }
  })
})
app.post('/api/searchqueuetime', function (req,res) {
  let time = req.body.search_time
  const sqlcommand = `SELECT * FROM booking b
                      INNER JOIN queue q ON b.Booking_ID = q.Booking_ID
                      WHERE q.Queue_Status = 'ยังไม่เสร็จสิ้น'
                      AND b.Booking_Date = ?
                      ORDER BY DATE(b.Booking_Date), b.Booking_Time DESC;`
  db.query(sqlcommand,[time],function(err,results){
  if(err){
    res.send(err)}
  else{
    res.json(results)
  }})
})
app.post('/api/addproduct', function (req,res) {
  let productname = req.body.productname
  let productID = req.body.productID
  let productcatagory = req.body.productcatagory
  let productamount = req.body.productamount
  let productprice = req.body.productprice
  let productmodel = req.body.productmodel
  let productyear = req.body.productyear
  let productdescription = req.body.productdescription
  let productimage = req.body.productimage
  console.log(req.body)
  if (productname && productcatagory && productprice && productamount && productmodel && productyear)
  {
    const sqlcommand = `INSERT INTO sparepart (SparePart_Name, SparePart_ProductID, SparePart_Amount, SparePart_Price, SparePart_Description, SparePart_Image,  SparePart_Model_ID, Category_ID)
    VALUES (?,?,?,?,?,?,
      (SELECT SparePart_Model_ID FROM sparepart_model WHERE SparePart_Model_Name = ? AND SparePart_Model_Year = ?),
      (SELECT Category_ID FROM category WHERE Category_Name = ?))`
    db.query(sqlcommand,[productname,productID,productamount,productprice,productdescription,productimage,productmodel,productyear,productcatagory],function(err,results)
    {
      if(err)
      {
        res.send(err)
      }
      else
      {
        res.json(results)
      }
    }
  )}
})
app.delete('/api/deletesparepart/:id', function (req, res) {
  const sparepartId = req.params.id;
  console.log(req.body)
  const sqlcommand = 'DELETE FROM sparepart WHERE SparePart_ID = ?';
  db.query(sqlcommand, [sparepartId], function (err, result) {
      if(err) {
        res.send(err)
      }
      else{
        res.json(result)
      }
  });
});
app.put('/api/updatesparepart/:id', function (req, res) {
  const sparepartId = req.params.id;
  let productamount = req.body.productamount;
  let productprice = req.body.productprice;
  console.log(req.body)
  const sqlcommand = `UPDATE sparepart SET SparePart_Amount = ?, SparePart_Price = ?
                      WHERE SparePart_ID = ?`;
   db.query(sqlcommand, [productamount, productprice, sparepartId], function (err, results) {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
});
app.get('/api/getdashboard_queuenum', function (req, res) {
  const sqlcommand = `SELECT 'All_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b
  WHERE b.Booking_ID = q.Booking_ID
  UNION ALL
  SELECT 'Today_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
  WHERE b.Booking_Date = CURDATE()
  UNION ALL
  SELECT 'Monthly_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
  WHERE MONTH(b.Booking_Date) = MONTH(CURRENT_DATE()) And YEAR(b.Booking_Date) = YEAR(CURRENT_DATE()) 
  UNION ALL
  SELECT 'Finished_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
  WHERE q.Queue_Status = 'เสร็จสิ้นแล้ว'
  UNION ALL
  SELECT 'Unfinished_Queue' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
  WHERE q.Queue_Status = 'ยังไม่เสร็จสิ้น'`
  db.query(sqlcommand,function(err,results){
  if(err) {res.send(err)}
  else {res.json(results)}
  })
})

app.get('/api/getdashboard_itemnum', function (req, res) {
  const sqlcommand = `SELECT 'ทุกรายการ' as label, COUNT(*) as value FROM sparepart`
  db.query(sqlcommand,function(err,results){
  if(err) {res.send(err)}
  else {res.json(results)}
  })
})
app.get('/api/getdashboard_itemtypenum', function (req,res){
  const sqlcommand = `SELECT Category_Name as label, COUNT(*) as value FROM sparepart s
  JOIN category c ON s.Category_ID = c.Category_ID
  GROUP BY c.Category_Name`
  db.query(sqlcommand,function(err,results){
    if(err) {res.send(err)}
    else {res.json(results)}
    })
})
app.get('/api/getdashboard_queuestatusnum', function (req, res) {
  const sqlcommand = `SELECT 'เสร็จสิ้นแล้ว' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
  WHERE q.Queue_Status = 'เสร็จสิ้นแล้ว'
  UNION ALL
  SELECT 'ยังไม่เสร็จสิ้น' as label, COUNT(*) as value FROM queue q JOIN booking b on b.Booking_ID = q.Booking_ID
  WHERE q.Queue_Status = 'ยังไม่เสร็จสิ้น'`
  db.query(sqlcommand,function(err,results){
  if(err) {res.send(err)}
  else {res.json(results)}
  })
})

//12/10/2024 add
// Promise wrapper for db.query
const queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

app.post('/api/register', async (req, res) =>
{
  try{
    let {username, password} = req.body
    console.log(req.body)
    if (!username || !password) { //if no username in register input
      return res.status(400).json({ message: 'Username and password are required' });
    }
    // check that is this username alreadu register?
    const sqlcommand1 = 'SELECT * FROM user where User_Username = ?'
    const results = await queryAsync(sqlcommand1, [username]);
    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    //hashing password = more security
    const passwordhash = await bcrypt.hash(password,10)
    let userdata = {
      User_Username: username,
      User_Password: passwordhash
    }
    console.log(userdata)
    const sqlcommand2 = 'INSERT into user SET ?'
    await db.query(sqlcommand2,[userdata])
    res.json({message: 'Inserted'})
  }
  catch (err)
  {
    console.log('err',err) 
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
})

app.post('/api/login', async (req, res) => {
  try{
    let {username, password} = req.body
    console.log(req.body)
    if (username && password) { //if in form has password, compare to database
      const sqlcommand1 = 'SELECT * FROM user where User_Username = ?'
      const results = await queryAsync(sqlcommand1, [username]);
      console.log(results)
      if (results.length > 0) { // Check if username exists in the database
        const hashcompare = await bcrypt.compare(password,results[0].User_Password)
        console.log(hashcompare)
        if(!hashcompare){
          return res.status(401).json({message: 'Password is wrong'})
        }
        else{
          //check if its admin account??
          if(results[0].User_Role === 'Customer')
          {
            return res.status(200).json({message: 'Login as Customer'})
          }
          if(results[0].User_Role === 'Admin')
          {
            return res.status(200).json({message: 'Login as Admin'})
          }
          
        }
      } else {
        return res.status(401).json({ message: 'No user exist' });
      }
    }
    else
    {
      return res.status(401).json({ message: 'Username and password are required' });
    }
  }
  catch (err)
  {
    console.log('err', err) 
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
})

app.post('/login', function (req, res) {
  let username = req.body.username;
	let password = req.body.password;
  console.log(req.body)
  //get user/pass in body and check in database
  if (username && password)
  {
    const sqlcommand = 'SELECT * FROM `user` WHERE `User_Username` = BINARY ? and `User_Password` = BINARY ?'
    db.query(sqlcommand,[username,password],function(err, results)
  {
    //use this as debugging only!!!!
    //console.log(results) --> if there are query (have a username and password), you should see RowDataPacket { id: x, username: 'x', password: 'x' } as array[0], 
    if (err) //if there is error in query
    {
      throw err
    }
    //hardcode fr
    else if (results.length > 0 && results[0].User_ID != 3) //if account exist (other acc)
    {
      res.send("Login successful")
      res.end()
    }
    else if (results.length > 0 && results[0].User_ID == 3) //if account exist (and admin acc), kinda hardcode tho
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

app.get("/sparepart", (req, res) => {
  const ModelId = req.query.modelId; // ดึงค่าจาก query parameter
  const query = "SELECT * FROM sparepart WHERE SparePart_Model_ID = ?"; // query ที่จะดึงข้อมูลจากฐานข้อมูล 
  db.query(query, [ModelId], (err, results) => { // ใช้ตัวแปร ModelId แทนค่าใน query
      if (err) {
          res.status(500).json({ message: "Error fetching data", error: err });
      } else {
          res.json(results); // ส่งผลลัพธ์กลับไปยัง frontend
      }
  });
});
app.get("/sparepartcategory", (req, res) => {
  const ModelId = req.query.modelId; // ดึงค่าจาก query parameter
  const Category = req.query.category
  console.log(req.query)
  const query = `SELECT * FROM sparepart WHERE SparePart_Model_ID = ? and Category_ID = ?` // query ที่จะดึงข้อมูลจากฐานข้อมูล 
  db.query(query, [ModelId, Category], (err, results) => { // ใช้ตัวแปร ModelId แทนค่าใน query
      if (err) {
          res.status(500).json({ message: "Error fetching data", error: err });
      } else {
          res.json(results); // ส่งผลลัพธ์กลับไปยัง frontend
      }
  });
});

app.listen(5000, () => 
    console.log("Server is running....")
)
