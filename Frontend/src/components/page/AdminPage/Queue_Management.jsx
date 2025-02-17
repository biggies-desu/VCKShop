import axios from "axios";
import React, { useEffect, useState } from "react";
import Queue_History from "./Queue_History.jsx";

function Queue_Management()
{
    const [queuedata,setqueuedata] = useState([])
    const [ishistorymodal, setishistorymodal] = useState(false)
    const [search_time, setsearch_time] = useState('')
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [Detail, setDetail] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:5000/allqueue')
        .then((res) => {
            console.log(res.data)
            setqueuedata(res.data)
        })
        .catch((err) => {
            console.log(err);
        })
    },[])

    function edititem(index)
    {
        event.preventDefault()
        console.log(index)
    }

    function deleteitem(index)
    {
        event.preventDefault()
        axios.post('http://localhost:5000/deletequeue',
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
        axios.post('http://localhost:5000/searchqueuetime',
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
                            <th className='px-4 py-3'>วันที่จอง</th>
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
                                    <button type='button' onClick={() => edititem(item.Queue_ID)} className="text-yellow-500 hover:text-yellow-700">✏️แก้ไข</button>
                                </td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => deleteitem(item.Queue_ID)} className="text-green-500 hover:text-green-700">✅เสร็จสิ้น</button>  
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    )}
        {ishistorymodal && (
            <Queue_History setishistorymodal={setishistorymodal}/>
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
    </>
}

export default Queue_Management