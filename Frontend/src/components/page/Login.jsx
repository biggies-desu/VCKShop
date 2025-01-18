import React from "react";
import Navbar from "../Navbar.jsx"
import axios from 'axios'
import { useState } from "react";

//คิดว่าตอนทำจริงๆน่าจะประมาณนั้ https://www.youtube.com/watch?v=qqL_SA2v6BE&t=965s

function loginfunction()
{
    event.preventDefault()
    console.log("Clicked login!")
        axios.post('http://localhost:5000/api/login', //post username/password to login api
        {
            username: username.value,
            password: password.value
        }
        )
        //todo : auth/cookie stuff
        .then((res) => {
            //set token to localstroage

            const token = res.data.token
            localStorage.setItem('token', token)
            if(res.data.message === 'Login as Customer')
            {
                window.location.replace("/");
            }
            if(res.data.message === 'Login as Admin')
            {
                window.location.replace("/admin");
            }
        })
        .catch(error=>{
            console.log(error)
        if (error.response.data.message === 'Username and password are required')
        {
            document.getElementById("errmsg").innerHTML = "Username and password are required!"
        }
        if (error.response.data.message === 'No user exist')
        {
            document.getElementById("errmsg").innerHTML = "No user exist!"
        }
        if (error.response.data.message === 'Password is wrong')
        {
            document.getElementById("errmsg").innerHTML = "Incorrect Password!"
        }
        });
}

function validateusername(usernamereg){
    const regex = /^.{8,}$/;
    if (!regex.test(usernamereg)){
        document.getElementById("errmsgusernamereg").innerHTML = "Username must contain at least 8 Charachers";
        console.log("bad username")
        return false
    }
    else{
        document.getElementById("errmsgusernamereg").innerHTML = "";
        console.log("good username")
        return true
    }
}

function validatepassword(passwordereg){
    const regex = /^(?=.*\d).{8,}$/;
    if (!regex.test(passwordereg)){
        document.getElementById("errmsgpasswordreg").innerHTML = "Must contain at least one number and at least 8 or more characters";
        console.log("bad password")
        return false
    }
    else{
        document.getElementById("errmsgpasswordreg").innerHTML = "";
        console.log("good password")
        return true
    }
}

function registerfunction()
{
    

    event.preventDefault()
    const isusernamevalid = validateusername(usernamereg.value)
    const ispasswordvalid = validatepassword(passwordreg.value)

    if(!isusernamevalid || !ispasswordvalid)
    {
        return; //exit funtion due invalid username or password
    }

    axios.post('http://localhost:5000/api/register',
    {
        username: usernamereg.value,
        password: passwordreg.value
    })
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err);
        if (err.response.data.message === 'Username already exists') {
            console.log('Username already exists')
            document.getElementById("errmsgusernamereg").innerHTML = "Username already exists!";
        } else {
            // Handle unexpected errors
            alert("An unexpected error occurred. Please try again.");
        }
    });
    console.log("Clicked!!!")

    return 
}
function Login()
{
    event.preventDefault()
    const [username, setusername] = useState()
    const [password, setpassword] = useState()
    const [usernamereg, setusernamereg] = useState()
    const [passwordreg, setpasswordreg] = useState()

    const [isRegisterModalOpen, setisRegisterModalOpen] = useState(false)
    const [isConfirmModalOpen, setisConfirmModalOpen] = useState(false)
    
    function openRegisterModal(){
        setisRegisterModalOpen(true) // open modal
    }
    function closeRegisterModel(){
        setisRegisterModalOpen(false)
    }
    function openconfirmmodal(){
        setisConfirmModalOpen(true)
    }

    function closeconfirmmodal(){
        setisConfirmModalOpen(false)
        window.location.reload()
    }
    
    return <>
    <Navbar />
    <form class="flex items-center justify-center">
        <div class="mt-20 w-1/4">
            <div class="text-center font-bold text-[2vw] mb-2">Login</div>
            <div class='p-2 space-y-2'>
            <div class='font-bold'>Username</div>
            <input value={username} type="text" name="username" id="username" onChange={e => setusername(e.target.value)} class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md" ></input>
            <div class ='font-bold'>Password</div>
            <input value={password} type="password" name="password" id="password" onChange={e => setpassword(e.target.value)} class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md" ></input>
            <div class="text-red-600 text-[1vw] mt-3" id="errmsg"></div>
            </div>
            
            <div class="items-center justify-between flex">
            <button onClick={() => loginfunction()} id="login" class="text-center rounded-full bg-green-400 text-[1vw] w-2/5 py-2 px-1 mt-4">Login</button>
            <button onClick={() => openRegisterModal()} id="register" class="text-center rounded-full bg-green-400 text-[1vw] w-2/5 py-2 px-1 mt-4 ">Register</button>                
            </div>
        </div>
    </form>
    {isRegisterModalOpen && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-lg w-1/3 max-h-screen">
            <div className="flex flex-row justify-between">
                <h2></h2>
                <h2 className="text-[1.5vw] text-center font-bold">Register</h2>
                <div onClick={() => closeRegisterModel()}><button type ='button'>
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
                </button></div>
            </div>
            <div class='p-2 space-y-2'>
            <div class='font-bold'>Username</div>
            <input value={usernamereg} type="text" name="usernamereg" title="Must contain at least 8 Charachers" id="usernamereg" placeholder="Username" required pattern="/^.{8,}$/"onChange={e => setusernamereg(e.target.value)} class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md" ></input>
            <div class="text-red-600 text-[1vw] mt-3" id="errmsgusernamereg"></div>
            <div class ='font-bold'>Password</div>
            <input value={passwordreg} type="password" name="passwordreg" title="Must contain at least one number and at least 8 or more characters"id="passwordreg"placeholder="Password" required pattern="^(?=.*\d).{8,}$" onChange={e => setpasswordreg(e.target.value)} class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md" ></input>
            <div class="text-red-600 text-[1vw] mt-3" id="errmsgpasswordreg"></div>
            </div>
            
            <button onClick={() => {registerfunction(), openconfirmmodal()}} id="register" class="text-center rounded-full bg-green-400 text-[1vw] w-2/5 py-2 px-1 mt-4 ">Register</button>
            </div>
        </div>)}

    {isConfirmModalOpen && (
        <div class="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center px-4">
        <div class="relative mx-auto shadow-xl rounded-md bg-white max-w-md w-full">
            <div class="my-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-14 shrink-0 fill-green-500 inline" viewBox="0 0 512 512">
                    <path
                        d="M383.841 171.838c-7.881-8.31-21.02-8.676-29.343-.775L221.987 296.732l-63.204-64.893c-8.005-8.213-21.13-8.393-29.35-.387-8.213 7.998-8.386 21.137-.388 29.35l77.492 79.561a20.687 20.687 0 0 0 14.869 6.275 20.744 20.744 0 0 0 14.288-5.694l147.373-139.762c8.316-7.888 8.668-21.027.774-29.344z"
                        data-original="#000000" />
                    <path
                        d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 470.487c-118.265 0-214.487-96.214-214.487-214.487 0-118.265 96.221-214.487 214.487-214.487 118.272 0 214.487 96.221 214.487 214.487 0 118.272-96.215 214.487-214.487 214.487z"
                        data-original="#000000" />
                </svg>
                <h4 class="text-[2vw] text-gray-800 font-semibold mt-4">ลงทะเบียนเสร็จสิ้น กรุณาเข้าสู่ระบบ</h4>
                <div class='justify-center item-center'>
                    <button type="button" onClick={() => closeconfirmmodal()} class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 font-medium rounded-lg text-base px-4 py-2 mt-4">ตกลง</button>
                </div>
            </div>
        </div>
    </div>
    )}
    </>
}

export default Login