import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function Queue_History({setishistorymodal})
{

    const [queuedata, setqueuedata] = useState([])
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [Detail, setDetail] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // จำนวนรายการที่จะแสดงในแต่ละหน้า
    const [totalPages, setTotalPages] = useState(1);
    const [search_time, setsearch_time] = useState('')
    const [search_time2, setsearch_time2] = useState('')

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

    useEffect(() => {
        if (queuedata.length > 0) {
            const totalPages = Math.ceil(queuedata.length / itemsPerPage);
            setTotalPages(totalPages); 
        }
    }, [queuedata, itemsPerPage]); 

    function openDetailModal(item) {
        setDetail(item);
        setIsDetailModalOpen(true);  
    }
    
    function CloseDetailModal(item) {
        setIsDetailModalOpen(false);  
    }
    
    function searchtime()
    {
        console.log(search_time,search_time2)
        event.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/queuehistorytime`,
            {
                search_time: search_time,
                search_time2: search_time2 || search_time
            })
            .then((res) => {
                console.log(res)
                setqueuedata(res.data)
            })
        .catch((err) => {
            console.log(err);
        })
    }

    const currentQueuedata = queuedata.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const changePage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return<>    
    <div className="p-6 bg-gray-100 min-h-screen">
        <div className='flex flex-col text-nowrap'>
            <div className='kanit-bold flex flex-col md:flex-row justify-between items-center bg-white p-4 shadow-md rounded-lg space-y-4 md:space-y-0'>
                <div></div>
                <h1 className="max-md:text-lg md:text-4xl text-gray-700">ประวัติคิวเข้าใช้บริการ</h1>
                <button className="w-full md:w-auto text-white bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded-lg text-lg transition" onClick={() => setishistorymodal(false)}>กลับ</button>
            </div>
            <form className="mt-4 p-4 bg-white shadow-md rounded-lg flex-row md:flex md:space-x-4 items-center">      
                <input className="shadow border rounded-lg w-full md:w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="date" type="date" required onChange={(e) => setsearch_time(e.target.value)}/>
                <input className="shadow border rounded-lg w-full md:w-1/3 py-2 px-4 max-md:mt-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="date" type="date" required onChange={(e) => setsearch_time2(e.target.value)}/>
                <button type='button' id="search" className="max-md:mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"onClick={() => searchtime(search_time,search_time2)}>
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                    </svg>
                </button>
            </form>
            <div className="relative overflow-x-auto shadow-md rounded-2xl mt-6">
                <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-xl">
                    <thead className="text-sm md:text-base text-white bg-blue-500">
                        <tr>
                            <th className='text-start px-4 py-3'>วันที่จอง</th>
                            <th className='text-start px-6 py-3'>เวลาที่จอง</th>
                            <th className='text-end px-6 py-3'>ดูรายละเอียด</th>
                            <th className='text-end px-6 py-3'>สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentQueuedata.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-blue-100 md:text-lg">
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
        <ul class="flex space-x-5 justify-center font-[sans-serif] p-10">
            <button className="flex items-center justify-center shrink-0 bg-gray-100 w-9 h-9 rounded-md cursor-pointer hover:bg-blue-400" onClick={() => changePage(currentPage > 1 ? currentPage - 1 : 1)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 fill-gray-400" viewBox="0 0 55.753 55.753">
                    <path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" data-original="#000000" />
                </svg>
            </button>
                            
            {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`flex items-center justify-center shrink-0 border cursor-pointer text-base font-bold text-gray-800 px-[13px] h-9 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:border-blue-500'}`} onClick={() => changePage(index + 1)}>
                    {index + 1}
                </li>
            ))}
            <button className="flex items-center justify-center shrink-0 bg-gray-100 w-9 h-9 rounded-md cursor-pointer hover:bg-blue-400" onClick={() => changePage(currentPage < totalPages ? currentPage + 1 : totalPages)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 fill-gray-400 rotate-180" viewBox="0 0 55.753 55.753">
                    <path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"data-original="#000000" />
                </svg>
            </button>
        </ul>
    </div>
    
    {isDetailModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
                    <h2 className="text-xl mb-4 kanit-bold">รายละเอียด</h2>
                    <form>
                        <div className="mb-4 space-y-2">
                            <p><strong>วันที่จอง:</strong> {new Date(Detail.Booking_Date).toLocaleDateString('th-TH')}</p>
                            <p><strong>เวลาที่จอง:</strong> {Detail.Booking_Time}</p>
                            <p><strong>ชื่อจริง:</strong> {Detail.Booking_FirstName}</p>
                            <p><strong>นามสกุล:</strong> {Detail.Booking_LastName}</p>
                            <p><strong>ประเภทการบริการ:</strong> {Detail.Service_Name}</p>
                            <p><strong>รายละเอียดการจอง:</strong> {Detail.Booking_Description ? Detail.Booking_Description : "-"}</p>
                            <p><strong>เลขทะเบียนรถ:</strong> {Detail.Booking_CarRegistration ? Detail.Booking_CarRegistration : "-"}</p>
                        </div>
                        <div className="flex justify-center">
                            <button type='button' className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded" onClick={CloseDetailModal}>ตกลง</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
}


export default Queue_History