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
    const [search_carregistration, setsearch_carregistration] = useState("");
    const [status, setstatus] = useState('')
    const [statusdropdown, setstatusdropdown] = useState([])

    const fetchdata = () => {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/queuehistory`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdownquetestatus`)
        ])
        
        .then((res) => {
            console.log(res.data)
            setqueuedata(res[0].data)
            setstatusdropdown(res[1].data)
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchdata()
    },[])

    function clearsearch()
    {
        setsearch_time('')
        setsearch_time2('')
        setsearch_carregistration('')
        setstatus('')
        fetchdata()
    }

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

    function search()
    {
        axios.post(`${import.meta.env.VITE_API_URL}/searchqueuehistory`,
            {
                search_time: search_time,
                search_time2: search_time2 || search_time,
                search_carregistration: search_carregistration,
                search_status: status
            })
            .then((res) => {
                console.log(res)
                setqueuedata(res.data)
                setCurrentPage(1);
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
        <div className='kanit-bold flex flex-col md:flex-row justify-between items-center bg-white p-4 shadow-md rounded-lg space-y-4 md:space-y-0'>
            <div></div>
            <h1 className="max-md:text-lg md:text-4xl text-gray-700">ประวัติคิวเข้าใช้บริการ</h1>
            <button className="w-full md:w-auto text-white bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded-lg text-lg transition" onClick={() => setishistorymodal(false)}>กลับ</button>
        </div>
        <form className="mt-4 p-4 bg-white shadow-md rounded-lg">
            <div className="flex flex-col md:flex-row md:space-x-4 md:items-end space-y-2 md:space-y-0">
                <div className="w-full md:w-1/4">
                <label htmlFor="search_time" className="block text-gray-700 text-sm font-medium mb-1">วันที่เริ่มต้น</label>
                <input id="search_time" type="date"
                value={search_time}
                    className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={(e) => setsearch_time(e.target.value)}/>
                </div>
                <div className="w-full md:w-1/4">
                    <label htmlFor="search_time2" className="block text-gray-700 text-sm font-medium mb-1">วันที่สิ้นสุด</label>
                    <input id="search_time2" type="date"
                    value={search_time2}
                    className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={(e) => setsearch_time2(e.target.value)} />
                </div>
                <div className="w-full md:w-1/4">
                    <label htmlFor="search_status" className="block text-gray-700 text-sm font-medium mb-1">สถานะคิว</label>
                    <select id="search_status" value={status} onChange={(e) => setstatus(e.target.value)}
                        className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">ทั้งหมด</option>
                            {statusdropdown.map((status, index) => (
                            <option key={index} value={status.Booking_Status_ID}>{status.Booking_Status_Name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-1/4">
                    <label htmlFor="search_carregistration" className="block text-gray-700 text-sm font-medium mb-1">เลขทะเบียนรถ</label>
                    <input type="text" id="search_carregistration"
                        value={search_carregistration} onChange={(e) => setsearch_carregistration(e.target.value)} placeholder="เลขทะเบียนรถ"
                        className="h-[42px] shadow border rounded-lg w-full px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button type="button" onClick={clearsearch}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                <button type="button" onClick={search} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                </button>
                </div>
            </div>
            </form>
        <div className="relative overflow-x-auto shadow-md rounded-2xl mt-6">
            <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-xl">
                <thead className="text-sm md:text-base text-white bg-blue-500">
                    <tr>
                        <th className='text-start px-4 py-3'>วันที่เข้าใช้บริการ</th>
                        <th className='text-start px-6 py-3'>เวลาที่จอง</th>
                        <th className='text-center px-6 py-3'>เลขทะเบียนรถ</th>
                        <th className='text-center px-6 py-3'>ช่างผู้รับผิดชอบ</th>
                        <th className='text-center px-6 py-3'>ดูรายละเอียด</th>
                        <th className='text-end px-6 py-3'>สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    {currentQueuedata.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-blue-100 md:text-lg">
                            <td className='text-start px-4 py-3'>{new Date(item.Booking_Date).toLocaleDateString('th-TH')}</td>
                            <td className='text-start px-4 py-3'>{item.Booking_Time}</td>
                            <td className='text-center px-6 py-3'>{item.Car_RegisNum}</td>
                            <td className='text-center px-6 py-3'>{item.Technician_Names || "-"}</td>
                            <td className='text-center py-3'>
                                <button type='button' onClick={() => openDetailModal(item)} className="text-blue-500 hover:text-blue-700">📄</button>  
                            </td>
                            <td className='text-end px-6 py-3'>
                                {item.Booking_Status_Name}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
                            <p><strong>ชื่อจริง:</strong> {Detail.User_Firstname}</p>
                            <p><strong>นามสกุล:</strong> {Detail.User_Lastname}</p>
                            <p><strong>รุ่นของรถ:</strong>{Detail.Model_Name} {Detail.Model_Year}</p>
                            <p><strong>เลขทะเบียนรถ:</strong>{Detail.Car_RegisNum} {Detail.Province_Name}</p>
                            <p><strong>รายละเอียดการจอง:</strong>
                            {Detail.SparePart_Details === null ? (
                                <p>{Detail.Booking_Description || "-"}</p>
                            ) : (
                                <div className="mt-1 space-y-1 whitespace-pre-line">
                                <div><b>อะไหล่:</b></div>
                                {Detail.SparePart_Details.split('\n').map((sp, i) => (
                                    <div key={i}>• {sp}</div>
                                ))}
                                {Detail.Service && (
                                    <>
                                    <div className="mt-2"><b>บริการ:</b></div>
                                    {Detail.Service.split('\n').map((item, i) => (
                                        <div key={i}>• {item}</div>
                                    ))}
                                    </>
                                )}
                                </div>
                            )}</p>
                        </div>
                        <div className="flex justify-center">
                            <button type='button' onClick={CloseDetailModal} className="px-6 py-2 text-white bg-green-500 hover:bg-green-700 rounded-lg transition">ตกลง</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
}


export default Queue_History