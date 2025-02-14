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

    return <>
    {!ishistorymodal && (<div>
        <div class='flex flex-row justify-between'>
        <h1 className="text-[1.5vw] mb-4 pt-4 px-4 "></h1>
        <h1 className="text-[1.5vw] mb-4 pt-4 px-4 ">รายการคิวเข้าใช้บริการ</h1>
        <button className="text-[1.5vw] mb-4 pt-4 px-6 "onClick={() => history()}>ประวัติ</button>
        </div>
        <form class="content-start mx-8 my-2">      
            <div class="flex space-x-4 content-center">
            <input class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="date" required onChange={(e) => setsearch_time(e.target.value)}></input>
                <button type='button' id="search" onClick={() => searchtime(search_time)}>
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="black" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                    </svg>
                </button>  
            </div>
        </form>
        <div class='relative overflow-x-auto shadow-md sm:rounded-2xl'>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-base text-gray-700 bg-gray-400">
                <tr>
                <th class='text-start px-3 py-2'>วันที่จอง</th>
                <th class='text-start px-6 py-2'>เวลาที่จอง</th>
                <th class='text-end px-6 py-2'>ดูรายละเอียด</th>
                <th class='text-end px-6 py-2'>แก้ไข</th>
                <th class='text-end px-6 py-2'>เสร็จแล้ว</th>
                </tr>
            </thead>
            <tbody>
                {queuedata.map((item, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-100 border-b-2">
                        <td class ='text-start px-3 py-2'>{new Date(item.Booking_Date).toLocaleDateString('th-TH')}</td>
                        <td class ='text-start px-3 py-2'>{item.Booking_Time}</td>
                        <td class='text-end py-2'>
                            <button type = 'button' onClick={() => openDetailModal(item)}>
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="black" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
                                </svg>
                            </button>  
                        </td>
                        <td class='text-end py-2'>
                            <button type = 'button' onClick={() => edititem(item.Queue_ID)}>
                            <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                            </svg>
                            </button>  
                        </td>
                        <td class='text-end py-2'>
                            <button type = 'button' onClick={() => deleteitem(item.Queue_ID)}>
                            <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                            </svg>
                            </button>  
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
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
                            <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded">ตกลง</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
}

export default Queue_Management
