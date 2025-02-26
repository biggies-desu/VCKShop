import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar.jsx"
import axios from 'axios'
//คิดว่าตอนทำจริงๆน่าจะประมาณนั้ https://www.youtube.com/watch?v=qqL_SA2v6BE&t=965s

function Login()
{
    event.preventDefault()
    const [username, setusername] = useState()
    const [password, setpassword] = useState()
    const [emailreg, setemailreg] = useState()
    const [usernamereg, setusernamereg] = useState()
    const [passwordreg, setpasswordreg] = useState()
    const [confirmpasswordreg, setconfirmpasswordreg] = useState()

    const [isRegisterModalOpen, setisRegisterModalOpen] = useState(false)
    const [isConfirmModalOpen, setisConfirmModalOpen] = useState(false)

    const modalRef = useRef(null);

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

    useEffect(() => {
        if (isRegisterModalOpen) {
          modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, [isRegisterModalOpen]);

    function loginfunction()
    {
    event.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/login`, //post username/password to login api
        {
            username: username,
            password: password
        }
        )
        .then((res) => {
            if(res.status === 200)
            {
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

function validateusername(){
    const regex = /^.{8,}$/;
    if (!regex.test(usernamereg)){
        document.getElementById("errmsgusernamereg").innerHTML = "Username must contain at least 8 Charachers";
        return false
    }
    else{
        document.getElementById("errmsgusernamereg").innerHTML = "";
        return true
    }
}

function validatepassword(){
    const regex = /^(?=.*\d).{8,}$/;
    if (!regex.test(passwordreg)){
        document.getElementById("errmsgpasswordreg").innerHTML = "Must contain at least one number and at least 8 or more characters";
        return false
    }
    if (confirmpasswordreg !== passwordreg)
    {
        document.getElementById("errmsgpasswordreg").innerHTML = "Password is not match";
        return false
    }
    else{
        document.getElementById("errmsgpasswordreg").innerHTML = "";
        return true
    }
}

function registerfunction()
{
    event.preventDefault()
    const isusernamevalid = validateusername()
    const ispasswordvalid = validatepassword()

    if(!isusernamevalid || !ispasswordvalid)
    {
        return; //exit funtion due invalid username or password
    }

    axios.post(`${import.meta.env.VITE_API_URL}/register`,
    {
        username: usernamereg,
        password: passwordreg,
    })
    .then((res) => {
        console.log(res)
        if(res.status === 200)
        {
            openconfirmmodal()
            setTimeout(() => window.location.reload(), 3000)
        }
    })
    .catch((err) => {
        console.log(err);
        if (err.response.data.message === 'Username already exists') {
            console.log('Username already exists')
            document.getElementById("errmsgusernamereg").innerHTML = "Username already exists!";
        } else {
            alert("An unexpected error occurred. Please try again.");
        }
    });
    console.log("Clicked!!!")
    }
    
    return <>
    <Navbar />
    <section className="login-container kanit-regular">
        <div className="top-blue w-[250px] h-[250px] bg-blue-400 rounded-full absolute top-[10%] left-[50%] transform -translate-x-1/2"></div>
        <div className="bottom-pink w-[280px] h-[280px] rounded-full absolute top-[50%] left-[12%] lg:left-[30%]"></div>
        <div className="top-orange w-[300px] h-[300px] rounded-full absolute top-[5%] left-[5%] md:left-[23%] lg:left-[30%]"></div>
        <div className="container_login w-[350px] sm:w-[500px] m-auto text-center p-8 text-white z-10" style={{ backdropFilter: 'blur(20px)' }}>
            <img id="passport" src="data:image/png;base64,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" alt="Avatar" className="mx-auto rounded-full mb-4"  />
            <p><span className="text-white text-4xl text-center mb-8">Login</span></p>
            <hr className="my-4" />
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <input value={username} type="text" id="username" placeholder="Username..." className="w-full mx-auto p-2 text-base sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-transparent focus:text-white focus:italic bg-black bg-opacity-10" onChange={(e) => setusername(e.target.value)}/>
                <input value={password} type="password" id="password" placeholder="Password..." className="w-full mx-auto p-2 text-base sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-transparent focus:text-white focus:italic bg-black bg-opacity-10" onChange={(e) => setpassword(e.target.value)}/>
                <div class="text-red-600 mt-3 text-start" id="errmsg"></div>
                <button type="submit"onClick={loginfunction}className="p-2 sm:text-lg bg-blue-500 rounded-2xl m-8 w-36 mx-auto sm:w-48 hover:bg-gradient-to-r hover:from-orange-500 hover:via-pink-500 hover:to-pink-700">
                    Login
                </button>
            </form>
            <p>ยังไม่มีบัญชี? <button onClick={() => openRegisterModal()} id="register" className="mt-10 underline hover:text-yellow-300">สมัครตอนนี้เลย</button></p>
        </div>
    </section>

    {isRegisterModalOpen && (
        <section className="login-container py-0 kanit-regular">
        <div className="bg-gray-800 h-screen inset-0 flex items-center justify-center" ref={modalRef}>
        <div className="top-blue w-[250px] h-[250px] bg-blue-400 rounded-full absolute top-[10%] left-[50%] transform -translate-x-1/2"></div>
        <div className="bottom-pink w-[280px] h-[280px] rounded-full absolute top-[50%] left-[12%] lg:left-[30%]"></div>
        <div className="top-orange w-[300px] h-[300px] rounded-full absolute top-[5%] left-[5%] md:left-[23%] lg:left-[30%]"></div>
        {/* <div className="bg-animate inset-0 flex items-center justify-center bg-black bg-opacity-50 h-screen" ref={modalRef}> */}
        {/* <div className="bg-animate p-8 rounded-lg max-w-lg h-1/2 mx-auto flex items-center justify-center inset-0 z-50 fixed mt-auto mb-auto"> */}
            <div className="container_login p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 w-[350px] sm:w-[500px] justify-center items-center">
                <div className="flex flex-row justify-between">
                    <h1></h1>
                    <h1 className="text-4xl font-regular text-white text-center mb-8">Register</h1>
                    <div>
                        <button onClick={() => closeRegisterModel()} type ='button'>
                            <svg class="w-6 h-6 text-white dark:text-white bg-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <form className="space-y-6">
                    <div className="relative">
                        <input value={usernamereg} type="text" placeholder="Username" name="usernamereg" title="Must contain at least 8 Charachers" id="usernamereg" required pattern="/^.{8,}$/" onChange={e => setusernamereg(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                        <i className="fas fa-user absolute right-3 top-3 text-yellow-500"></i>
                        <div class="text-red-600 mt-3" id="errmsgusernamereg"></div>
                    </div>
                    <div className="relative">
                        <input value={passwordreg} type="password" placeholder="Password" name="passwordreg" title="Must contain at least one number and at least 8 or more characters" id="passwordreg" required pattern="^(?=.*\d).{8,}$" onChange={e => setpasswordreg(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                        <i className="fas fa-lock absolute right-3 top-3 text-yellow-500"></i>
                    </div>
                    <div className="relative">
                        <input value={confirmpasswordreg} type="password" placeholder="Confirm Password" name="confirmpasswordreg" title="Confirm password" id="confirmpasswordreg" required pattern="^(?=.*\d).{8,}$" onChange={e => setconfirmpasswordreg(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                        <i className="fas fa-check-double absolute right-3 top-3 text-yellow-500"></i>
                        <div class="text-red-600 mt-3" id="errmsgpasswordreg"></div>
                    </div>
                    <button onClick={() => {registerfunction()}} id="register" className="w-full bg-gradient-to-r from-yellow-500 to-purple-400 text-white font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">Sign Up</button>
                </form>
                <div className="mt-8 text-center">
                    <div className="flex justify-center space-x-4 mt-4">
                        <a href="#" className="text-blue-500 hover:text-blue-600 transform hover:scale-125 transition-all duration-300">
                            <i className=" text-2xl"></i>
                        </a>
                        <a href="#" className="text-blue-400 hover:text-blue-500 transform hover:scale-125 transition-all duration-300">
                            <i className=" text-2xl"></i>
                        </a>
                        <a href="#" className="text-red-500 hover:text-red-600 transform hover:scale-125 transition-all duration-300">
                            <i className=" text-2xl"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <i className="fas fa-meteor text-yellow-500 text-4xl absolute animate-ping" style={{ top: "10%", left: "5%" }}></i>
                <i className="fas fa-star text-blue-500 text-2xl absolute animate-pulse" style={{ top: "20%", right: "10%" }}></i>
                <i className="fas fa-rocket text-red-500 text-5xl absolute" style={{ bottom: "15%", left: "15%" }}></i>
                <i className="fas fa-planet-ringed text-purple-500 text-6xl absolute rotate" style={{ top: "40%", right: "20%" }}></i>
            </div>
        </div>
        {/* </div> */}
        </section>
    )}

    {isConfirmModalOpen && (
        <div class="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center px-4 py-96">
            <div role="alert" className="flex justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-100 bg-white p-4 mb-4 w-full max-w-sm z-50">
                <div className="flex gap-4">
                    <span className="text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </span>
                    <div className="flex-1">
                        <strong className="block font-medium text-gray-900">Register Successfully</strong>
                        <p className="mt-1 text-sm text-gray-700">Registration completed Please log in.</p>
                    </div>
                    <button className="text-gray-500 transition hover:text-gray-600" type="button" onClick={() => closeconfirmmodal()}>
                        <span className="sr-only">Dismiss popup</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
}

export default Login