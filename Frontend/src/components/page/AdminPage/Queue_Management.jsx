import axios from "axios";
import React, { useEffect, useState } from "react";
import Queue_History from "./Queue_History.jsx";

function Queue_Management()
{
    const [queuedata,setqueuedata] = useState([])
    const [ishistorymodal, setishistorymodal] = useState(false)
    const [search_time, setsearch_time] = useState('')
    const [search_time2, setsearch_time2] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editQueue, setEditQueue] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [Detail, setDetail] = useState(null)
    const [isDeleteModalOpen, setisDeleteModalOpen] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [disabledTimes, setDisabledTimes] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // จำนวนรายการที่จะแสดงในแต่ละหน้า
    const [totalPages, setTotalPages] = useState(1);

    const openModal = (index) => {
        setDeleteId(index);
        setisDeleteModalOpen(true);
    };
    
    const closeModal = () => {
        setDeleteId('');
        setisDeleteModalOpen(false);
    };

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
            fetchdata()
            }, [date]);

    const fetchdata = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/allqueue`)
        .then((res) => {
            console.log("Updated queue:", res.data);
            setqueuedata(res.data);
        })
        .catch((err) => console.error(err));

    if (date) {
        axios.post(`${import.meta.env.VITE_API_URL}/checkQueue`, { date })
            .then((res) => {
                const bookedTimes = res.data; 
                const disabled = [];
                
                for (const time in bookedTimes) {
                    if (bookedTimes[time] >= 3) {
                        disabled.push(time);
                    }
                }
                setDisabledTimes(disabled);
                console.log(disabled);
            })
            .catch((err) => console.error(err));
        }
    };

    useEffect(() => {
        if (queuedata.length > 0) {
            const totalPages = Math.ceil(queuedata.length / itemsPerPage);
            setTotalPages(totalPages); 
        }
    }, [queuedata, itemsPerPage]);

    function deleteitem(index) {
        openModal(index);
    }

    function confirmDelete(index)
    {
        event.preventDefault()
        console.log(index)
        axios.delete(`${import.meta.env.VITE_API_URL}/deletequeue/${index}`)
        .then((res) => {
            console.log(res)
            fetchdata()
            closeModal();
        })
        .catch(err => {
            console.log(eer)
        })
    }

    function cancelDelete() {
        closeModal();
    }

    function finishitem(index)
    {
        event.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/finishqueue`,
            {
                finishqueueno: index
            }
        )
        .then((res) => {
            console.log(res)
            fetchdata()
        })
        .catch(err => {
            console.log(eer)
        })
    }

    function history()
    {
        event.preventDefault()
        console.log("history")
        setishistorymodal(true)
    }

    function searchtime()
    {
        console.log(search_time,search_time2)
        event.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/searchqueuetime`,
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

    const currentQueuedata = queuedata.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const changePage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return <>
    {!ishistorymodal && (
     
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className='kanit-bold flex flex-col md:flex-row justify-between items-center bg-white p-4 shadow-md rounded-lg space-y-4 md:space-y-0'>
                <div></div>
                <h1 className="max-md:text-lg md:text-4xl text-gray-700">รายการคิวเข้าใช้บริการ</h1>
                <button className="w-full md:w-auto text-white bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded-lg text-lg transition" onClick={() => history()}>ประวัติ</button>
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
            <div className='relative overflow-x-auto shadow-md rounded-2xl mt-6'>
                <table className="w-full text-left text-gray-600 bg-white shadow-md rounded-lg">
                    <thead className="text-sm md:text-base text-white bg-blue-500">
                        <tr>
                            <th className='px-4 py-3'>วันที่เข้าใช้บริการ</th>
                            <th className='px-6 py-3'>เวลาที่จอง</th>
                            <th className='text-center px-6 py-3'>ดูรายละเอียด</th>
                            <th className='text-center px-6 py-3'>แก้ไข</th>
                            <th className='text-center px-6 py-3'>เสร็จแล้ว</th>
                            <th className='text-center px-6 py-3'>ลบคิว</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentQueuedata.map((item, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                                <td className='px-4 py-3'>{new Date(item.Booking_Date).toLocaleDateString('th-TH')}</td>
                                <td className='px-4 py-3'>{item.Booking_Time}</td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => openDetailModal(item)} className="text-blue-500 hover:text-blue-700">📄รายละเอียด</button>  
                                </td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => openEditModal(item)} className="text-yellow-500 hover:text-yellow-700">✏️แก้ไข</button>
                                </td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => finishitem(item.Booking_ID)} className="text-green-500 hover:text-green-700">✅เสร็จสิ้น</button>  
                                </td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => deleteitem(item.Booking_ID)} className="text-red-500 hover:text-red-700">❌ลบคิว</button>  
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
    )}

        {isEditModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
                    <h2 className="text-xl font-bold mb-4">แก้ไขวัน/เวลาที่เข้าใช้บริการ</h2>
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
                        <div className="flex justify-center space-x-4">
                            <button className="px-4 py-2 text-gray-700 bg-red-400 hover:bg-red-600 rounded" onClick={closeEditModal}>ยกเลิก</button>
                            <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded">บันทึก</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

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
                            {/* <p><strong>ประเภทการบริการ:</strong> {Detail.Service_Name}</p> */}
                            <p><strong>รายละเอียดการจอง:</strong> {Detail.Booking_Description ? Detail.Booking_Description : "-"}</p>
                            <p><strong>เลขทะเบียนรถ:</strong> {Detail.Booking_CarRegistration ? Detail.Booking_CarRegistration : "-"}</p>
                        </div>
                        <div className="flex justify-center">
                            <button type='button' onClick={CloseDetailModal} className="px-6 py-2 text-white bg-green-500 hover:bg-green-700 rounded-lg transition">ตกลง</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        
        {ishistorymodal && (
            <Queue_History setishistorymodal={setishistorymodal}/>
        )}

        {isDeleteModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div class="p-4 md:p-5 text-center">
                        <svg class="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 class="mt-2 mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">ต้องการลบคิวเข้าใช้บริการหรือไม่?</h3>
                        <button onClick={confirmDelete} data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">ใช่, ยืนยัน</button>
                        <button onClick={cancelDelete} data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">ไม่, ยกเลิก</button>
                    </div>
                </div>
            </div>
        )}
    </>
}

export default Queue_Management