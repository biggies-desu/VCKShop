const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer')

require('dotenv').config();

router.post('/sentemail', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const message = req.body.message
    console.log(req.body)
    console.log(process.env.MAILUSER, process.env.MAILPASS);

    //config transport service ไว้เข้าเมล
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: process.env.MAILUSER,
        to: "biggies7993@gmail.com", // Change to the owner's email later
        subject: `ข้อความจากคุณ ${name}`,
        text: `เนี้อหาข้อความ\n${message}\nอีเมลติดต่อกลับ : ${email}`
    };

    // Send email and handle response
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
        res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ success: false, error: err.message });
    }

})

module.exports = router;