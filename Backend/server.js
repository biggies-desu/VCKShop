const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const FormData = require('form-data');
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

const login = require('./routes/login')
const queue = require('./routes/queue')
const dashboard = require('./routes/dashboard')
const getdropdown = require('./routes/getdropdown')
const linemessage = require('./routes/linemessage')
const sparepart = require('./routes/sparepart')
const upload = require('./routes/upload')

app.use(express.json())
app.use(bodyParser())
app.use(cookieParser());
app.use(cors());

app.get('/',(req, res) => {
  res.send("Hello world")
})

const loggermw = require('./middleware/loggermw') //log
app.use(loggermw)

app.use(login)
app.use(queue)
app.use(dashboard)
app.use(getdropdown)
app.use(linemessage)
app.use(sparepart)
app.use(upload)



app.listen(5000, () => 
    console.log("Server is running....")
)
