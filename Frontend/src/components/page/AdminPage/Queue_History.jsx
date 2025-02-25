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
    
    function CloseDetailModal(item) {
        setIsDetailModalOpen(false);  
    }

    return<>    
    <div className="p-6 bg-gray-100 min-h-screen kanit-regular">
        <div className='flex flex-col text-nowrap'>
            <div className='flex flex-row justify-between items-center bg-white p-4 shadow-md rounded-lg'>
                <button className="text-white bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded-lg text-lg transition" onClick={() => setishistorymodal(false)}>กลับ</button>
                <h1 className="text-xl font-semibold text-gray-700">ประวัติคิวเข้าใช้บริการ</h1>
                <h1 className="text-xl font-semibold text-gray-700"></h1>
            </div>
            <div className="relative overflow-x-auto shadow-md rounded-2xl mt-6">
                <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-xl">
                    <thead className="text-base text-white bg-blue-500">
                        <tr>
                            <th className='text-start px-4 py-3'>วันที่จอง</th>
                            <th className='text-start px-6 py-3'>เวลาที่จอง</th>
                            <th className='text-end px-6 py-3'>ดูรายละเอียด</th>
                            <th className='text-end px-6 py-3'>สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queuedata.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-blue-100">
                                <td className='text-start px-4 py-3'>{new Date(item.Booking_Date).toLocaleDateString('th-TH')}</td>
                                <td className='text-start px-4 py-3'>{item.Booking_Time}</td>
                                <td className='text-end py-3'>
                                    <button type='button' onClick={() => openDetailModal(item)} className="text-blue-500 hover:text-blue-700">📄</button>  
                                </td>
                                <td className={`text-end px-3 py-2 ${item.Booking_Status === "เสร็จสิ้นแล้ว" ? "text-green-500" : "text-red-500"}`}>
                                    {item.Booking_Status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    {isDetailModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
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
                            <button type='button' className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded" onClick={CloseDetailModal}>ตกลง</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
}


export default Queue_History