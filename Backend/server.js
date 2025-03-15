const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const FormData = require('form-data');
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require('path');

const app = express();

const login = require('./routes/login')
const queue = require('./routes/queue')
const dashboard = require('./routes/dashboard')
const getdropdown = require('./routes/getdropdown')
const linemessage = require('./routes/linemessage')
const sparepart = require('./routes/sparepart')
const upload = require('./routes/upload')
const warehouse_log = require('./routes/warehouselog')
const tax = require('./routes/tax')
const email = require('./routes/email')
const account = require('./routes/account')
const setting = require('./routes/setting')

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
app.use(warehouse_log)
app.use(tax)
app.use(email)
app.use(account)
app.use(setting)
app.use('/uploads', express.static('uploads'));
app.use('/model_images', express.static(path.join(__dirname, 'routes', 'model_images')));
app.use('/model_images', express.static(path.resolve(__dirname, 'routes/model_images')));

app.listen(5000, "0.0.0.0", () => 
    console.log("Server is running....")
)