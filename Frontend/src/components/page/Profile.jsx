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

    function editprofile()
    {
        event.preventDefault();
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
    <form class="flex flex-wrap items-center justify-center mt-20">
        <div class="w-1/4">
            <div class="font-bold text-[2vw] mb-2">Account setting</div>
            <div class='p-2 space-y-2'>
            <div class='font-bold'>Username</div>
            <input value={username} type="text" name="username" id="username" placeholder="๊ชื่อบัญชี" class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md" readOnly></input>
            <div class='font-bold'>Firstname</div>
            <input value={firstname} type="text" name="firstname" id="firstname" placeholder="ชื่อจริง" onChange={e => setfirstname(e.target.value)} class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"></input>
            <div class='font-bold'>Lastname</div>
            <input value={lastname} type="text" name="lastname" id="lastname" placeholder="นามสกุล" onChange={e => setlastname(e.target.value)} class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"></input>
            <div class='font-bold'>Email</div>
            <input value={email} type="email" name="email" id="email" placeholder="อีเมล" onChange={e => setemail(e.target.value)} class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"></input>
            <div class='font-bold'>Telephone</div>
            <input value={telephone} type="tel" name="telephone" id="telephone" placeholder="เบอร์โทรศัพท์"maxlength="10" inputMode="numeric" onChange={e => settelephone(e.target.value.replace(/[^0-9]/g, ''))} class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"></input>
            </div>
            <div class="items-center justify-between flex">
        <button onClick={() => editprofile()} id="editfunc" class="text-center rounded-full bg-green-400 text-[1vw] w-2/5 py-2 px-1 mt-4">Save Change</button>
        </div>
    </div>
    </form>
    <Footer />
    </>
}

export default Profile