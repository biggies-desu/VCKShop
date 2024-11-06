import React from "react";
import Navbar from "../Navbar.jsx"
import axios from 'axios'
import { useState } from "react";

//คิดว่าตอนทำจริงๆน่าจะประมาณนั้ https://www.youtube.com/watch?v=qqL_SA2v6BE&t=965s

function loginfunction()
{
    event.preventDefault()
    console.log("Clicked login!")
        axios.post('http://localhost:5000/login', //post username/password to login api
        {
            username: username.value,
            password: password.value
        }
        )
        //check login|
        //todo : auth/cookie stuff
        .then((res) => {
            console.log(res)
        if(res.data === "Login successful")
        {
            console.log("Redirect to homepage")
            window.location.replace("/");
        }
        if(res.data === "Login successful as Admin")
        {
            console.log("Redirect to homepage as admin")
            window.location.replace("/admin");
        }
        if(res.data === "Incorrect username or password!")
        {
            console.log("Incorrect Username or password!")
            document.getElementById("errmsg").innerHTML = "Incorrect Username or password!";
        }
        if(res.data === "You must input username and password")
        {
            console.log("You must input username and password")
            document.getElementById("errmsg").innerHTML = "You must input username and password!";
        }
        //console.log(res.status
        //console.log(username.value)
        })
        .catch(error=>{
        console.log(error)
        });
}

function registerfunction()
{
    event.preventDefault()
    console.log("Clicked!!!")
}

function Login()
{
    const [username, setusername] = useState()
    const [password, setpassword] = useState()

    return <>
    <Navbar />
    <form class="flex items-center justify-center">
        <div class="mt-20">
            <div class="text-center text-[2vw] mb-5 ">Login</div>
            <div>Username</div>
            <input value={username} type="text" name="username" id="username" onChange={e => setusername(e.target.value)} class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md" ></input>
            <div>Password</div>
            <input value={password} type="password" name="password" id="password" onChange={e => setpassword(e.target.value)} class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md" ></input>
            <div class="text-red-600 text-[1vw] mt-3" id="errmsg"></div>
            <div class="items-center justify-between flex">
            <button onClick={loginfunction} id="login" class="text-center rounded-full bg-green-400 text-[1vw] w-2/5 py-2 px-1 mt-4">Login</button>
            <button onClick={registerfunction} id="register" class="text-center rounded-full bg-green-400 text-[1vw] w-2/5 py-2 px-1 mt-4 ">Register</button>                
            </div>
        </div>
    </form>
    </>
}

export default Login