import axios from "axios";
import React, { useEffect, useState } from "react";
import Queue_History from "./Queue_History.jsx";

function Queue_Management()
{
    const [queuedata,setqueuedata] = useState([])
    const [ishistorymodal, setishistorymodal] = useState(false)
    const [search_time, setsearch_time] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editQueue, setEditQueue] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [Detail, setDetail] = useState(null)
    const [disabledTimes, setDisabledTimes] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);  // กำหนดวันที่ใหม่
        setTime("");    // รีเซ็ตเวลาเมื่อเลือกวันใหม่
    };

    const handleTimeChange = (selectedTime) => {
       setEditQueue({ ...editQueue, Booking_Time: selectedTime });
       setTime(selectedTime);
        
        // ตรวจสอบวันที่และเวลาที่เลือก
        if (date && selectedTime) {
            axios.post(`${import.meta.env.VITE_API_URL}/checkQueue`, { date, time: selectedTime })
                .then((res) => {
                    const { queueCount, isFull } = res.data;
                    // ถ้าเวลานั้นเต็มหรือจองมากกว่า 3 คน จะทำให้เวลานั้นไม่สามารถเลือกได้
                    if (isFull || queueCount >= 3) {
                        setDisabledTimes(prevDisabledTimes => [...prevDisabledTimes, selectedTime]);
                    } else {
                        // หากเวลานั้นไม่เต็มแล้ว ให้ลบออกจาก disabledTimes
                        setDisabledTimes(prevDisabledTimes => prevDisabledTimes.filter(time => time !== selectedTime));
                    }
                    console.log(disabledTimes)
                })
                .catch((err) => console.log(err));
        }
    };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/allqueue`)
        .then((res) => {
            console.log(res.data)
            setqueuedata(res.data)
        })
        .catch((err) => {
            console.log(err)})

        if (date) {
            axios.post(`${import.meta.env.VITE_API_URL}/checkQueue`, { date })
                .then((res) => {
                    const bookedTimes = res.data; 
                    const disabled = [];
        
                    // ตรวจสอบว่าเวลาที่เต็มมีหรือไม่
                    for (const time in bookedTimes) {
                        if (bookedTimes[time] >= 3) {
                            disabled.push(time);
                        }
                    }
                    setDisabledTimes(disabled);
                    console.log(disabledTimes)
                })
                .catch((err) => console.log(err));
            }
        }, [date]);

    function deleteitem(index)
    {
        event.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/deletequeue`,
            {
                deletequeueno: index
            }
        )
        .then((res) => {
            console.log(res)
        })
        .catch(err => {
            console.log(eer)
        })
        location.reload()
    }

    function history()
    {
        event.preventDefault()
        console.log("history")
        setishistorymodal(true)
    }

    function searchtime(search_time)
    {
        console.log(search_time)
        event.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/searchqueuetime`,
            {
                search_time: search_time
            })
            .then((res) => {
                console.log(res)
                setqueuedata(res.data)
            })
        .catch((err) => {
            console.log(err);
        })
    }

    function openEditModal(item) {
        setEditQueue(item);
        setIsEditModalOpen(true);
    }    
    
    function closeEditModal() {
        setIsEditModalOpen(false); 
    }

    function updateQueue() {
        if (disabledTimes.includes(time)) {
            return;
        }
        axios.put(`${import.meta.env.VITE_API_URL}/updatequeue/${editQueue.Booking_ID}`, {
            bookingdate: editQueue.Booking_Date,
            bookingtime: editQueue.Booking_Time,
        })
        .then((res) => {
            setqueuedata(queuedata.map(item => item.Booking_ID === editQueue.Booking_ID ? editQueue : item));
            setIsEditModalOpen(false); 
        })
        .catch((err) => {
            console.log("Error updating queue", err);
        });
    }

    function openDetailModal(item) {
        setDetail(item);
        setIsDetailModalOpen(true);  
    }

    function CloseDetailModal(item) {
        setIsDetailModalOpen(false);  
    }

    return <>
    {!ishistorymodal && (<div>
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className='flex flex-row justify-between items-center bg-white p-4 shadow-md rounded-lg'>
                <div></div>
                <h1 className="text-xl font-semibold text-gray-700">รายการคิวเข้าใช้บริการ</h1>
                <button className="text-white bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded-lg text-lg transition" onClick={() => history()}>ประวัติ</button>
            </div>
            <form className="mt-4 p-4 bg-white shadow-md rounded-lg flex space-x-4 items-center">      
                <input className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="date" type="date" required onChange={(e) => setsearch_time(e.target.value)}/>
                <button type='button' id="search" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"onClick={() => searchtime(search_time)}>
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                    </svg>
                </button>
            </form>
            <div className='relative overflow-x-auto shadow-md rounded-2xl mt-6'>
                <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-lg">
                    <thead className="text-base text-white bg-blue-500">
                        <tr>
                            <th className='px-4 py-3'>วันที่เข้าใช้บริการ</th>
                            <th className='px-6 py-3'>เวลาที่จอง</th>
                            <th className='text-center px-6 py-3'>ดูรายละเอียด</th>
                            <th className='text-center px-6 py-3'>แก้ไข</th>
                            <th className='text-center px-6 py-3'>เสร็จแล้ว</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queuedata.map((item, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100">
                                <td className='px-4 py-3'>{new Date(item.Booking_Date).toLocaleDateString('th-TH')}</td>
                                <td className='px-4 py-3'>{item.Booking_Time}</td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => openDetailModal(item)} className="text-blue-500 hover:text-blue-700">📄รายละเอียด</button>  
                                </td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => openEditModal(item)} className="text-yellow-500 hover:text-yellow-700">✏️แก้ไข</button>
                                </td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => deleteitem(item.Booking_ID)} className="text-green-500 hover:text-green-700">✅เสร็จสิ้น</button>  
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    )}

        {isEditModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded shadow-lg w-1/2">
                    <h2 className="text-[1.5vw] mb-4">แก้ไขวัน/เวลาที่เข้าใช้บริการ</h2>
                    <form onSubmit={e => { e.preventDefault(); updateQueue(); }}>
                        <div className="mb-4">
                            <label className="block text-gray-700">วันที่เข้าใช้บริการ</label>
                            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded" value={editQueue.Booking_Date} min={new Date().toISOString().split("T")[0]} onChange={(e) => {setEditQueue({ ...editQueue, Booking_Date: e.target.value });handleDateChange(e.target.value);}}/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">เวลาที่เข้าใช้บริการ</label>
                            <select id="time" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={editQueue.Booking_Time} onChange={(e) => handleTimeChange(e.target.value)}>
                                <option value="" disabled>--:--</option>
                                {["09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00"].map(timeSlot => (
                                <option key={timeSlot} value={timeSlot} disabled={disabledTimes.includes(timeSlot)}>
                                    {timeSlot} {disabledTimes.includes(timeSlot) ? "(ถูกจองเต็มแล้ว)" : ""}
                                </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 text-gray-700 bg-red-400 hover:bg-red-600 rounded" onClick={closeEditModal}>ยกเลิก</button>
                            <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded">บันทึก</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {isDetailModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded shadow-lg w-1/3">
                    <h2 className="text-[1.5vw] mb-4">รายละเอียด</h2>
                    <form>
                        <div className="mb-4">
                            <p><strong>วันที่จอง:</strong> {new Date(Detail.Booking_Date).toLocaleDateString('th-TH')}</p>
                            <p><strong>เวลาที่จอง:</strong> {Detail.Booking_Time}</p>
                            <p><strong>ชื่อจริง:</strong> {Detail.Booking_FirstName}</p>
                            <p><strong>นามสกุล:</strong> {Detail.Booking_LastName}</p>
                            <p><strong>ประเภทการบริการ:</strong> {Detail.Service_Name}</p>
                            <p><strong>รายละเอียดการจอง:</strong> {Detail.Booking_Description ? Detail.Booking_Description : "-"}</p>
                            <p><strong>เลขทะเบียนรถ:</strong> {Detail.Booking_CarRegistration ? Detail.Booking_CarRegistration : "-"}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button type='button' onClick={CloseDetailModal} className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded">ตกลง</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        
        {ishistorymodal && (
            <Queue_History setishistorymodal={setishistorymodal}/>
        )}
    </>
}

export default Queue_Management