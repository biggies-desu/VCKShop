import React, { useEffect, useState } from "react";
import Navbar from "../Navbar.jsx"
import Footer from "../Footer.jsx"
import axios from "axios";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Loading from '../Loading.jsx'

function Profile()
{
    const [userdata, setuserdata] = useState([])
    const [loading, setloading] = useState(true)
    const [username, setusername] = useState()
    const [firstname, setfirstname] = useState()
    const [lastname, setlastname] = useState()
    const [telephone, settelephone] = useState()
    const [email, setemail] = useState()
    const [showNotification, setShowNotification] = useState(false);

    const token = localStorage.getItem('token')
    const userid = jwtDecode(token).user_id
    useEffect(() => {
        //fetch
        axios.get(`${import.meta.env.VITE_API_URL}/getcurrentprofile/${userid}`)
            .then((res) => {
                if(res.status === 200)
                {
                    const data = res.data[0]
                    setuserdata(data) //set userdata to show
                    setusername(data.User_Username)
                    setfirstname(data.User_Firstname)
                    setlastname(data.User_Lastname)
                    settelephone(data.User_Telephone)
                    setemail(data.User_Email)
                    setloading(false)
                }
            })
            .catch((err) => {
                console.log(err);
                setloading(false)
            });
        ;} ,[]);

    function editprofile(event)
    {
        event.preventDefault(); // ป้องกันไม่ให้ฟอร์มรีเฟรช
        setShowNotification(true); // แสดงการแจ้งเตือน
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
        console.log(userid)
        axios.put(`${import.meta.env.VITE_API_URL}/updateprofile/${userid}`,
        {
            firstname: firstname,
            lastname: lastname,
            email: email,
            telephone: telephone
        })
        .then((res)=>{
            if(res.status === 200){
                console.log(res)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
    

    return <>

    <Navbar />
    {loading ? (<Loading />) : <></>}
    {/* Notification for changes saved */}
    {showNotification && (
        <div role="alert" className="flex justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-100 bg-white p-4 mb-4 w-full max-w-sm">
            <div className="flex gap-4">
                <span className="text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </span>
                <div className="flex-1">
                    <strong className="block font-medium text-gray-900">Changes saved</strong>
                    <p className="mt-1 text-sm text-gray-700">Your product changes have been saved.</p>
                </div>
                <button className="text-gray-500 transition hover:text-gray-600" onClick={() => setShowNotification(false)}>
                    <span className="sr-only">Dismiss popup</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
      )}
    <form class="flex justify-center kanit-regular">
        <div className="bg-gray-700 h-full pt-24 py-40 inset-0 flex items-center justify-center w-screen">
        <div className="bg-black bg-opacity-80 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 max-w-md w-full justify-center items-center">
            <div className="flex flex-row justify-center">
                <h1 className="text-4xl font-extrabold mb-8">Account setting</h1>
            </div>
            <form className="space-y-6">
                <div className="flex justify-start font-bold">Username</div>
                <div className="relative">
                <input value={username} type="text" name="username" id="username" placeholder="๊ชื่อบัญชี" className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300" readOnly></input>
                <i className="fas fa-user absolute right-3 top-3 text-yellow-500"></i> 
                </div>             
                <div className="flex justify-start font-bold">Firstname</div>
                <div className="relative">
                <input value={firstname} type="text" name="firstname" id="firstname" placeholder="ชื่อจริง" onChange={e => setfirstname(e.target.value)} class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                <i className="fas fa-address-card absolute right-3 top-3 text-yellow-500"></i>
                </div>
                <div className="flex justify-start font-bold">Lastname</div>
                <div className="relative">
                <input value={lastname} type="text" name="lastname" id="lastname" placeholder="นามสกุล" onChange={e => setlastname(e.target.value)} class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                <i className="fas fa-address-card absolute right-3 top-3 text-yellow-500"></i>
                </div>
                <div className="flex justify-start font-bold">Email</div>
                <div className="relative">
                <input value={email} type="email" name="email" id="email" placeholder="อีเมล" onChange={e => setemail(e.target.value)} class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                <i className="fas fa-envelope absolute right-3 top-3 text-yellow-500"></i>
                </div>
                <div className="flex justify-start font-bold">Telephone</div>
                <div className="relative">
                <input value={telephone} type="tel" name="telephone" id="telephone" placeholder="เบอร์โทรศัพท์"maxlength="10" inputMode="numeric" onChange={e => settelephone(e.target.value.replace(/[^0-9]/g, ''))} class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                <i className="fas fa-phone absolute right-3 top-3 text-yellow-500"></i>
                </div>
                <button onClick={(e) => editprofile(e)} id="editfunc" className="w-full bg-gradient-to-r from-yellow-500 to-purple-400 text-white font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">Save Change</button>
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
        </form>
    <Footer />
    </>
}

export default Profile