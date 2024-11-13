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
  let productbrand = req.body.productbrand
  let productmodel = req.body.productmodel
  let productyear = req.body.productyear
  let productdescription = req.body.productdescription
  let productimage = req.body.productimage
  console.log(req.body)
  if (productname && productcatagory && productprice && productamount && productbrand && productmodel && productyear)
  {
    const sqlcommand = `INSERT INTO sparepart (SparePart_Name, SparePart_ProductID, SparePart_Amount, SparePart_Price, SparePart_Description, SparePart_Image, SparePart_Brand_ID, SparePart_Model_ID, Category_ID)
    VALUES (?,?,?,?,?,?,
      (SELECT SparePart_Brand_ID FROM sparepart_brand WHERE SparePart_Brand_Name = ?),
      (SELECT SparePart_Model_ID FROM sparepart_model WHERE SparePart_Model_Name = ? AND SparePart_Model_Year = ?),
      (SELECT Category_ID FROM category WHERE Category_Name = ?))`
    db.query(sqlcommand,[productname,productID,productamount,productprice,productdescription,productimage,productbrand,productmodel,productyear,productcatagory],function(err,results)
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

app.listen(5000, () => 
    console.log("Server is running....")
)
