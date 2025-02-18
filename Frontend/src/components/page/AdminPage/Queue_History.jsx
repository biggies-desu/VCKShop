import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function Queue_History({setishistorymodal})
{

    const [queuedata, setqueuedata] = useState([])
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [Detail, setDetail] = useState(null)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/queuehistory`)
        .then((res) => {
            console.log(res.data)
            setqueuedata(res.data)
        })
        .catch((err) => {
            console.log(err);
        })
    },[])

    function openDetailModal(item) {
        setDetail(item);
        setIsDetailModalOpen(true);  
    }

    return<>
    <div className='flex flex-col text-nowrap'>
        <div className='flex flex-row justify-between'>
            <button className="text-[1.5vw] mb-4 pt-4 px-6 "onClick={() => setishistorymodal(false)}>กลับ</button>
            <h1 className="text-[1.5vw] mb-4 pt-4 px-4 ">ประวัติคิวเข้าใช้บริการ</h1>
            <h1 className="text-[1.5vw] mb-4 pt-4 px-4 "></h1>
        </div>
        
        <div className="relative overflow-x-auto shadow-md sm:rounded-2xl">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-base text-gray-700 bg-gray-400">
                <tr>
                <th className='text-start px-3 py-2'>วันที่จอง</th>
                <th className='text-start px-6 py-2'>เวลาที่จอง</th>
                <th className='text-end px-6 py-2'>ดูรายละเอียด</th>
                <th className='text-end px-6 py-2'>สถานะ</th>
                </tr>
            </thead>
            <tbody>
                {queuedata.map((item, index) => 
                <tr key={index} className="odd:bg-white even:bg-gray-100 border-b-2">
                    <td className ='text-start px-3 py-2'>{new Date(item.Booking_Date).toLocaleDateString('th-TH')}</td>
                    <td className ='text-start px-3 py-2'>{item.Booking_Time}</td>
                    <td className='text-end py-2'>
                        <button type = 'button' onClick={() => openDetailModal(item)}>
                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="black" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
                            </svg>
                        </button>  
                    </td>
                    <td className={`text-end px-3 py-2 ${item.Queue_Status === "เสร็จสิ้นแล้ว" ? "text-black" : "text-red-500"}`}>{item.Queue_Status}</td>
                </tr>

            )
        }
            </tbody>
        </table>
        </div>
    </div>
    
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
                            <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded" onClick={() => setIsDetailModalOpen(false)}>ตกลง</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
}


export default Queue_History