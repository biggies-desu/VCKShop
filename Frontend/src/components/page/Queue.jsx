import React, { useEffect, useState } from "react";
import Navbar from "../Navbar.jsx"
import Footer from "../Footer.jsx"
import axios from "axios";

function Queue()
{
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [errorFullName, setErrorFullName] = useState('');
    const [errorPhoneNumber, setErrorPhoneNumber] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorDate, setErrorDate] = useState('');
    const [errorTime, setErrorTime] = useState('');
    const [isModalOpen, setIsModalOpen] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [details, setDetails] = useState(``);
    const [userID, setuserID] = useState('');


    const [servicedropdown, setservicedropdown] = useState([])
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [isModalConfirmedOpen, setisModalConfirmOpen] = useState(false); //init ว่าลงผ่านยัง
    const openConfirmedModal = () => setisModalConfirmOpen(true)
    const closeConfirmedModal = () => setisModalConfirmOpen(false)

    useEffect(() => {
        //fetch servicetype that avaliable
        axios.get('http://localhost:5000/api/getdropdownservice')
            .then((res) => {
                setservicedropdown(res.data)
            })
            .catch((err) => {
                console.log(err);
              });
        ;} ,[]);

    const handleSubmit = (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้า

        if (!fullName) {
            setErrorFullName("กรุณากรอกชื่อ-นามสกุล");
        } else if (fullName) {
            setErrorFullName(''); // หากกรอกแล้ว ให้เคลียร์ข้อความเตือน
        }

        if (!phoneNumber) {
            setErrorPhoneNumber("กรุณากรอกเบอร์โทรศัพท์");
        } else if (phoneNumber) {
            setErrorPhoneNumber('');
        }

        if (!email) {
            setErrorEmail("กรุณากรอกอีเมล");
        } else if (email) {
            setErrorEmail('');
        }
        
        if (!date) {
            setErrorDate("กรุณากรอกวันที่จอง");
        } //else if (date) //ก่อนหน้า 
        //{
        //    //condition ดัก ไม่ให้ใส่วันก่อน
        // }
        else if (date)
        {
            setErrorDate('');
        }

        if (!time) {
            setErrorTime("กรุณากรอกเวลาที่จอง");
        } else if (time) {
            setErrorTime('');
        }

        // ตรวจสอบว่าไม่มีข้อผิดพลาดในฟิลด์ทั้งหมดหรือไม่
        if (fullName && phoneNumber && email && date && time) {
            openModal();
        }
    };

    function submitqueue()
    {
        event.preventDefault()
        // console.log(fullName)
        // console.log(phoneNumber)
        // console.log(email)
        // console.log(date)
        // console.log(time)
        // console.log(serviceType)
        // console.log(details)
        //มันควรมี modal อะไรสักอย่าง confirm ว่าจองสำเร็จแล้ว
        closeModal();

        //split fullname to first+last
        const namearray  = fullName.split(" ");
        const firstname = namearray[0]
        const lastname = namearray[1]

        //send data to db
        axios.post('http://localhost:5000/api/addqueue', 
            {
                fullname: fullName,
                firstname: firstname,
                lastname: lastname,
                phoneNumber: phoneNumber,
                email: email,
                date: date,
                time: time,
                serviceType: serviceType,
                details: details,
                userID: userID
            }
        )
        .then((res) =>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })

        openConfirmedModal();
    }

    function closeconfirmnoti()
    {
        //also redirecting to somewhere?
        closeConfirmedModal();
    }

    return <>
    <Navbar />
    <div class="bg-gray-100 p-6 shadow-md mx-auto w-full">
    <h1 class="text-3xl font-semibold text-center">เครื่องมือสำหรับการจองเข้าใช้บริการอู่</h1>

    <div class="flex">
        <div class="w-1/3 p-6">
            <h2 class="text-lg font-semibold mb-4">ระบุวันที่ต้องการจอง</h2>
            <label class="block text-gray-700 mb-2" for="date"> วันที่จอง </label>
            <input class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="date" required onChange={(e) => setDate(e.target.value)}></input>
            {errorDate && <p className="text-red-500 text-sm mt-2">{errorDate}</p>}
        </div>

        <div class="w-2/3  p-6">
            <h2 class="text-lg font-semibold mb-4">ระบุเวลาที่ต้องการจอง</h2>
            <label class="block text-gray-700 mb-2" for="time"> เวลา </label>
            <select id="time" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={(e) => setTime(e.target.value)}>
                <option value="" disabled selected>--:--</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
            </select>
            {errorTime && <p className="text-red-500 text-sm mt-2">{errorTime}</p>}
        </div>
    </div>


    <div class="mt-4 bg-white p-6 rounded shadow">
        <h2 class="text-[2vw] font-semibold mb-4">รายละเอียดผู้จอง</h2>
            <form class="space-y-8" onSubmit={handleSubmit}>
                <div class="flex space-x-4">
                    <div class="w-1/2">
                        <label class="block">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
                        <input type="text" class="w-full border border-gray-300 p-2 rounded" placeholder="ชื่อ-นามสกุล" value={fullName} onChange={(e) => setFullName(e.target.value)}></input>
                        {errorFullName && <p className="text-red-500 text-sm mt-2">{errorFullName}</p>}
                    </div>
                    <div class="w-1/2">
                        <label class="block text-sm font-normal">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
                        <input type="tel" inputMode="numeric" class="w-full border border-gray-300 p-2 rounded" placeholder="เบอร์โทรศัพท์" value={phoneNumber}
                            maxlength="10" onChange={(e) => {
                                // ตรวจสอบให้กรอกเฉพาะตัวเลข
                                const value = e.target.value.replace(/[^0-9]/g, ''); 
                                setPhoneNumber(value);
                            }}>
                        </input>
                        {errorPhoneNumber && <p className="text-red-500 text-sm mt-2">{errorPhoneNumber}</p>}
                    </div>
                </div>
                <div class="flex space-x-4">
                    <div class="w-1/2">
                        <label class="block text-sm font-normal">อีเมล <span class="text-red-500">*</span></label>
                        <input type="email" class="w-full border border-gray-300 p-2 rounded" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        {errorEmail && <p className="text-red-500 text-sm mt-2">{errorEmail}</p>}
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-normal">ประเภทการบริการ</label>
                        <select className="w-full border border-gray-300 p-2 rounded" value={serviceType} onChange={e => setServiceType(e.target.value)}>
                        {servicedropdown && servicedropdown.length > 0 && servicedropdown.map((item, index) => (
                            <option key={index} value={item.Service_Name}>
                                {item.Service_Name}
                            </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    {
                        //ตรงนี้ต้องpassค่าจากหน้าเลือกอะไหล่มา later db ยังก้งอยู่ 11/11/2024
                    }
                    <label className="block text-sm font-normal">รายละเอียด</label>
                    <textarea type="text" class="w-full border border-gray-300 p-2 min-h-10 rounded" rows="4" value={details} onChange={(e) => setDetails(e.target.value)}/>
                </div>
                    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">ยืนยันการจอง</button>
            </form>
    </div>
    </div>
    {isModalOpen && ( //แสดงผล Modal confirm
    <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center px-4">
        <div className="relative mx-auto shadow-xl rounded-md bg-white max-w-md w-full">
            <div className="p-6 pt-0 text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mt-5 mb-4">ข้อมูลการจองของคุณ</h3>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md text-left mb-4">
                    <p className="text-gray-700 mb-2"><strong>ชื่อ-นามสกุล:</strong> {fullName}</p>
                    <p className="text-gray-700 mb-2"><strong>เบอร์โทรศัพท์:</strong> {phoneNumber}</p>
                    <p className="text-gray-700 mb-2"><strong>อีเมล:</strong> {email}</p>
                    <p className="text-gray-700 mb-2"><strong>วันที่จอง:</strong> {date}</p>
                    <p className="text-gray-700 mb-2"><strong>เวลาที่จอง:</strong> {time}</p>
                    <p className="text-gray-700 mb-2"><strong>ประเภทการบริการ:</strong> {serviceType}</p>
                    <p className="text-gray-700"><strong>รายละเอียด:</strong> {details}</p>
                </div>
                <button onClick={closeModal} className="text-black font-medium rounded-lg text-base px-4 py-2 mt-4 mr-16">ยกเลิก</button>
                <button onClick={() => submitqueue()} className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 font-medium rounded-lg text-base px-4 py-2 mt-4">ยืนยัน</button>
            </div>
        </div>
    </div>
    )}

    {isModalConfirmedOpen && (
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
                    <h4 class="text-[2vw] text-gray-800 font-semibold mt-4">จองคิวเสร็จสิ้น!!</h4>
                    <p class="text-sm text-gray-500 leading-relaxed mt-4 px-2">ลูกค้าสามารถเข้าใจบริการในวันเวลาที่ทำการจองไว้</p>
                    <div class='justify-center item-center'>
                        <button type="button" onClick={() => closeconfirmnoti()} class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 font-medium rounded-lg text-base px-4 py-2 mt-4">ตกลง</button>
                    </div>
                </div>
            </div>
        </div>
        )
    }
    <Footer />
    </>
}

export default Queue