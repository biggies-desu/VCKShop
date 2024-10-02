import React from "react";
import Navbar from "../Navbar.jsx"
import axios from 'axios'

var userfortest = [];

//คิดว่าตอนทำจริงๆน่าจะประมาณนั้ https://www.youtube.com/watch?v=qqL_SA2v6BE&t=965s

function loginfunction()
{
    console.log("button pressed")
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    axios.get('http://localhost:5000/api/user')
    .then(res=>{
        console.log(res)
    })
    .catch(error=>{
        console.log(error)
    })

    //วน array
    for (let i = 0; i<userfortest.length; i++)
    {
        if (username == userfortest.data[i].username && password == userfortest.data[i].password)
        {
            //ถ้ามันถูกก้อหลุด Loop เลย
            console.log("ถูกต้อง")
            document.getElementById("warning").innerHTML = "Success!"
            return false;
            //redirect ไปหน้า management
            //ไม่มีโค้ด ยังไม่ทำ
        }
    }
    console.log("ไม่ถูก")
    document.getElementById("warning").innerHTML = "Incorrect Password!"
}


function Login()
{
    return <>
    <Navbar />
    <h1> 
    ระบบ Login (แบบง่ายๆ)
    </h1>
    <div id = "login" className="login">
        <div className="loginform">
            Username<br/>
            <input type="text" id="username" placeholder="Username"></input><br/>
            Password<br/>
            <input type="text" id="password" placeholder="Password"></input><br/>
            <button type="button" className="buttonlogin" onClick={loginfunction}>Login!</button>  <div id="warning"></div>            
        </div> 
    </div>
    </>
}

export default Login