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


    const [firstname, setfirstname] = useState()
    const [lastname, setlastname] = useState()
    const [telephone, settelephone] = useState()
    const [email, setemail] = useState()

    event.preventDefault()
    useEffect(() => {
        //fetch
        const token = localStorage.getItem('token')
        const userid = jwtDecode(token).user_id
        console.log(userid)

        axios.get(`http://localhost:5000/getcurrentprofile/${userid}`)
            .then((res) => {
                if(res.status === 200)
                {
                    setuserdata(res.data[0]) //set userdata to show
                    setloading(false)
                }
            })
            .catch((err) => {
                console.log(err);
            });
        ;} ,[]);
    function editprofile()
    {
        //เด่วทำ
    }

    console.log(userdata)

    return <>
    <Navbar />
    {loading ? (<Loading />) : <></>}
    <form class="flex flex-wrap items-center justify-center mt-20">
        <div class="w-1/4">
            <div class="font-bold text-[2vw] mb-2">Account setting</div>
            <div class='p-2 space-y-2'>
            <div class='font-bold'>Username</div>
            <input value={userdata?.User_Username} type="text" name="username" id="username" class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md" readOnly></input>
            <div class='font-bold'>Firstname</div>
            <input value={userdata?.User_Firstname} type="text" name="firstname" id="ufirstname" class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"></input>
            <div class='font-bold'>Lastname</div>
            <input value={userdata?.User_Lastname} type="text" name="lastname" id="lastname" class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"></input>
            <div class='font-bold'>Email</div>
            <input value={userdata?.User_Email} type="text" name="email" id="email" class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"></input>
            <div class='font-bold'>Telephone</div>
            <input value={userdata?.User_Telephone} type="text" name="telephone" id="telephone" class="p-[0.8vw] w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"></input>
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