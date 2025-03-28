import React, { useEffect, useState } from "react";
import Navbar from "../Navbar.jsx"
import Footer from "../Footer.jsx"
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Profile()
{
    const [userdata, setuserdata] = useState([])
    const [username, setusername] = useState()
    const [firstname, setfirstname] = useState()
    const [lastname, setlastname] = useState()
    const [telephone, settelephone] = useState()
    const [email, setemail] = useState()
    const [newpassword, setnewpassword] = useState()
    const [confirmnewpassword, setconfirmnewpassword] = useState()
    const [showNotification, setShowNotification] = useState(false);
    const [activeTab, setActiveTab] = useState("EditPersonalHistory");
    const [carregis, setcarregis] = useState()
    const [historydata, sethistorydata] = useState([])
    const [cardropdown, setcardropdown] = useState([])

    const token = localStorage.getItem('token')
    const userid = jwtDecode(token).user_id
    const oldhashpassword = jwtDecode(token).user_password
    const role = jwtDecode(token).role

    useEffect(() => {
        //fetch
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/getcurrentprofile/${userid}`),
            axios.get(`${import.meta.env.VITE_API_URL}/cardropdown/${userid}`),
        ])
            .then((res) => {
                if(res[0].status === 200)
                {
                    const data = res[0].data?.[0]
                    setuserdata(data) //set userdata to show
                    setusername(data.User_Username)
                    setfirstname(data.User_Firstname)
                    setlastname(data.User_Lastname)
                    settelephone(data.User_Telephone)
                    setemail(data.User_Email)
                    console.log(data)
                }
                if(res[1].status === 200)
                {
                    setcardropdown(res[1].data)
                    console.log(res[1].data)
                }
            })
            .catch((err) => {
                console.log(err);
            });
        ;} ,[]);

    useEffect(() => {
            axios.post(`${import.meta.env.VITE_API_URL}/bookinghistory/${userid}`, {
                carID: carregis,
            })
            .then((res) => {
                sethistorydata(res.data);
                console.log(historydata)
            })
            .catch((err) => {
                console.error(err);
            });
            
        }, [carregis, userid]);

    function editprofile(event)
    {
        event.preventDefault();
        setShowNotification(true);
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

    function changepassword(event)
    {
        event.preventDefault();
        console.log(userid)
        const ispasswordvalid = validatepassword()
        if(!ispasswordvalid)
        {
            return; //exit funtion due invalid username or password
        }

        axios.post(`${import.meta.env.VITE_API_URL}/changepassword/${userid}`,
        {
            newpassword: newpassword,
            confirmnewpassword: confirmnewpassword,
            oldhashpassword: oldhashpassword,
            role: role

        })
        .then((res)=>{
            if(res.status === 200){
                console.log(res)
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
            }
        })
        .catch((err) => {
            console.log(err)
            if(err.response.data.message === 'Something went wrong')
            {
                document.getElementById("errchangepass").innerHTML = "Something went wrong!";
            }
            if(err.response.data.message === 'Passwords do not match')
            {
                document.getElementById("errchangepass").innerHTML = "Passwords do not match!";
            }
            if(err.response.data.message === 'Unauthorized')
            {
                document.getElementById("errchangepass").innerHTML = "Unauthorized!";
            }
        })
    }

    function validatepassword(){
        const regex = /^(?=.*\d).{8,}$/;
        if (!regex.test(newpassword)){
            document.getElementById("errchangepass").innerHTML = "Must contain at least one number and at least 8 or more characters";
            return false
        }
        if (confirmnewpassword !== newpassword)
        {
            document.getElementById("errchangepass").innerHTML = "Password is not match";
            return false
        }
        else{
            document.getElementById("errchangepass").innerHTML = "";
            return true
        }
    }
    

    return <>

    <Navbar />
    <div className="max-w-5xl mx-auto p-6 flex">
        <div className="w-1/4 pr-4">
            <div className="bg-gray-100 p-4 rounded-lg space-y-4">
                <button onClick={() => setActiveTab("EditPersonalHistory")} className={`w-full text-left px-4 py-2 rounded ${activeTab === "EditPersonalHistory" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>แก้ไขประวัติส่วนตัว</button>
                <button onClick={() => setActiveTab("ChangePassword")} className={`w-full text-left px-4 py-2 rounded ${activeTab === "ChangePassword" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>เปลี่ยนรหัสผ่าน</button>
                <button onClick={() => setActiveTab("ViewBookingHistory")} className={`w-full text-left px-4 py-2 rounded ${activeTab === "ViewBookingHistory" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>ดูประวัติการจอง</button>
            </div>
        </div>

        {showNotification && (
        <div role="alert" className="flex justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-100 bg-white p-4 mb-4 w-full max-w-md">
            <div className="flex gap-4">
                <span className="text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </span>
                <div className="flex-1">
                    <strong className="block font-medium text-gray-900">Changes saved</strong>
                    <p className="mt-1 text-sm text-gray-700">Your Password changes have been saved.</p>
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


        <div className="w-3/4 pl-4">
            {activeTab === "EditPersonalHistory" && (
                <form className="bg-white p-8 space-y-4">
                    <div className="bg-opacity-80 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 justify-center items-center border-4">
                    <h1 className="text-2xl font-bold mb-4">ตั้งค่าบัญชี</h1>
                        <form className="space-y-6">
                            <div className="flex justify-start font-bold">Username</div>
                                <div className="relative">
                                    <input value={username} type="text" name="username" id="username" placeholder="๊ชื่อบัญชี" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" readOnly></input>
                                </div>             
                            <div className="flex justify-start font-bold">Firstname</div>
                                <div className="relative">
                                    <input value={firstname} type="text" name="firstname" id="firstname" placeholder="ชื่อจริง" onChange={e => setfirstname(e.target.value)} class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                                </div>
                            <div className="flex justify-start font-bold">Lastname</div>
                                <div className="relative">
                                    <input value={lastname} type="text" name="lastname" id="lastname" placeholder="นามสกุล" onChange={e => setlastname(e.target.value)} class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                                </div>
                            <div className="flex justify-start font-bold">Email</div>
                                <div className="relative">
                                    <input value={email} type="email" name="email" id="email" placeholder="อีเมล" onChange={e => setemail(e.target.value)} class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                                </div>
                            <div className="flex justify-start font-bold">Telephone</div>
                                <div className="relative">
                                    <input value={telephone} type="tel" name="telephone" id="telephone" placeholder="เบอร์โทรศัพท์"maxlength="10" inputMode="numeric" onChange={e => settelephone(e.target.value.replace(/[^0-9]/g, ''))} class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                                </div>
                            <button onClick={(e) => editprofile(e)} className="bg-gradient-to-r from-yellow-500 to-purple-400 text-white font-bold py-2 rounded-lg w-full mt-4">Save Change</button>
                        </form>
                    </div>
                </form>
            )}
            {activeTab === "ViewBookingHistory" && (
                <form className="bg-white p-8 space-y-4">
                    <div className="bg-opacity-80 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 justify-center items-center border-4">
                        <h1 className="text-2xl font-bold mb-4">ประวัติคิวเข้าใช้บริการ</h1>
                        <select id="carregis" value={carregis} onChange={(e) => setcarregis(e.target.value)}
                        className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">ทั้งหมด</option>
                            {cardropdown.map((car, index) => (
                            <option key={index} value={car.Car_ID}>{car.Car_RegisNum} {car.Province_Name}</option>
                        ))}
                    </select>

                    <div className="relative overflow-x-auto mt-4">
                <table className="w-full text-sm md:text-base table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="text-start px-3 py-2">วันที่/เวลา</th>
                            <th className="text-start px-3 py-2">รุ่นรถ</th>
                            <th className="text-start px-6 py-2">ทะเบียนรถ</th>
                            <th className="text-end px-2 py-2">รายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historydata.map((item,index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100">
                                <td className="text-start py-3">{new Date(item.Booking_Date).toLocaleDateString('th-TH')} {item.Booking_Time}</td>
                                <td className="text-start py-3">{item.Brand_Name} {item.Model_Name} {item.Model_Year}</td>
                                <td className="text-end py-3">{item.Car_RegisNum} {item.Province_Name}</td>
                                <td className="text-end py-3">{item.Booking_Description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                    </div>
                        
                </form>
            )}
            {activeTab === "ChangePassword" && (
                <form className="bg-white p-8 space-y-4">
                    <div className="bg-opacity-80 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 justify-center items-center border-4">
                    <h1 className="text-2xl font-bold mb-4">เปลื่ยนรหัสผ่าน</h1>
                        <form className="space-y-6">
                            <div className="flex justify-start font-bold">รหัสผ่านใหม่</div>
                                <div className="relative">
                                    <input value={newpassword} onChange={e => setnewpassword(e.target.value)} type="password" required pattern="^(?=.*\d).{8,}$" name="newpassword" id="newpassword" placeholder="รหัสผ่านใหม่" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                                </div>             
                            <div className="flex justify-start font-bold">ยืนยันรหัสผ่านใหม่</div>
                                <div className="relative">
                                    <input value={confirmnewpassword} onChange={e => setconfirmnewpassword(e.target.value)} type="password" required pattern="^(?=.*\d).{8,}$" name="confirmnewpassword" id="confirmnewpassword" placeholder="ยืนยันรหัสผ่านใหม่" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                                </div>
                            <div class="text-red-600 mt-3" id="errchangepass"></div>
                            <button onClick={(e) => changepassword(e)} id="editfunc" className="w-full bg-gradient-to-r from-yellow-500 to-purple-400 text-white font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">Save Change</button>
                        </form> 
                    </div>
                </form>
                )}
        </div>
    </div>
    <Footer />
    </>
}

export default Profile