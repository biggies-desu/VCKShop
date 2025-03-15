import axios from "axios";
import React, { useEffect, useState } from "react";
import Queue_History from "./Queue_History.jsx";

function Queue_Management()
{
    const [queuedata,setqueuedata] = useState([])
    const [ishistorymodal, setishistorymodal] = useState(false)
    const [search_time, setsearch_time] = useState('')
    const [search_time2, setsearch_time2] = useState('')
    const [search_carregistration, setsearch_carregistration] = useState("");
    const [search_status, setSearchStatus] = useState('');
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
    const [techniciandata,settechniciandata] = useState([])
    const [status, setstatus] = useState('')
    const [statusdropdown, setstatusdropdown] = useState([])

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

    const handleTimeChange = (selectedDate) => {
        setDate(selectedDate);
        setTime("");
        
        if (selectedDate) {
            axios.post(`${import.meta.env.VITE_API_URL}/checkQueue`, { date: selectedDate })
                .then((res) => {
                    const bookedTimes = res.data;
                    const disabled = [];
                    for (const time in bookedTimes) {
                        if (bookedTimes[time] >= 3) {
                            disabled.push(time);
                        }
                    }
                    setDisabledTimes(disabled);
                })
                .catch((err) => console.error("checkQueue error:", err));
        }
    };
    
    useEffect(() => {
        fetchdata()
        }, [date]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/technician`)
        .then((res) => {
        settechniciandata(res.data);
        })
        .catch((err) => {
            console.log(eer)
        });
    }, []);

    const fetchTechniciansPerBooking = async (bookingId) => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/booking_technicians/${bookingId}`);
        return res.data.map(t => t.Technician_ID);
      };

      const fetchdata = async () => {
        try {
            const [queueRes, statusRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/allqueue`),
                axios.get(`${import.meta.env.VITE_API_URL}/getdropdownquetestatus`)
            ]);
            const queueList = queueRes.data.map(item => ({
                ...item,
                Technician_IDs: item.Technician_IDs
                    ? item.Technician_IDs.split(',').map(id => parseInt(id))
                    : []
            }));
            setqueuedata(queueList);
            setstatusdropdown(statusRes.data);
        } catch (err) {
            console.error("Error in fetchdata:", err);
        }
    };

    const assignTechnicians = (booking_id, technician_ids) => {
        axios.post(`${import.meta.env.VITE_API_URL}/assign_technicians`, {
          booking_id,
          technician_ids,
        })
        .then((res) => {
          console.log(res);
          setqueuedata(prev =>
            prev.map(item =>
              item.Booking_ID === booking_id ? { ...item, Technician_IDs: technician_ids } : item
            )
          );
        })
        .catch((err) => {
            console.log(eer)
        });
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

    function history()
    {
        event.preventDefault()
        console.log("history")
        setishistorymodal(true)
    }

    function search() {
        axios.post(`${import.meta.env.VITE_API_URL}/searchqueue`, {
          search_time: search_time,
          search_time2: search_time2 || search_time,
          search_carregistration: search_carregistration,
          search_status: status
        })
        .then((res) => {
            const rawData = res.data;
          
            // Directly parse Technician_IDs from raw data
            const queueList = rawData.map(item => ({
              ...item,
              Technician_IDs: item.Technician_IDs 
                ? item.Technician_IDs.split(',').map(id => parseInt(id))
                : []
            }));
          
            setqueuedata(queueList);
            setCurrentPage(1);
          })
        .catch((err) => {
          console.log(err);
        });
      }

    function openEditModal(item) {
        setEditQueue(item);
        setIsEditModalOpen(true);
    }    
    
    function closeEditModal() {
        setIsEditModalOpen(false); 
    }

    function handleStatusChange(booking_id, status) {
        console.log(booking_id,status)
        axios.post(`${import.meta.env.VITE_API_URL}/updatequeue_status`, {
          booking_id,
          status,
          technician_id: null
        })
        .then((res) => {
          console.log(res)
          fetchdata();
          if (status === 'เสร็จสิ้นแล้ว') {
            setishistorymodal(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function handleTechnicianChange(booking_id, selectedTechs) {
        assignTechnicians(booking_id, selectedTechs);
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
            <form className="mt-4 p-4 bg-white shadow-md rounded-lg">
            <div className="flex flex-col md:flex-row md:space-x-4 md:items-end space-y-2 md:space-y-0">
                <div className="w-full md:w-1/4">
                <label htmlFor="search_time" className="block text-gray-700 text-sm font-medium mb-1">วันที่เริ่มต้น</label>
                <input id="search_time" type="date"
                    className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={(e) => setsearch_time(e.target.value)}/>
                </div>
                <div className="w-full md:w-1/4">
                    <label htmlFor="search_time2" className="block text-gray-700 text-sm font-medium mb-1">วันที่สิ้นสุด</label>
                    <input id="search_time2" type="date"
                    className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={(e) => setsearch_time2(e.target.value)} />
                </div>
                <div className="w-full md:w-1/4">
                    <label htmlFor="search_status" className="block text-gray-700 text-sm font-medium mb-1">สถานะคิว</label>
                    <select id="search_status" value={status} onChange={(e) => setstatus(e.target.value)}
                        className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">ทั้งหมด</option>
                        {statusdropdown.filter((s) => s.Booking_Status_ID === 1 || s.Booking_Status_ID === 2)
                        .map((status, index) => (
                            <option key={index} value={status.Booking_Status_ID}>
                                {status.Booking_Status_Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-1/4">
                    <label htmlFor="search_carregistration" className="block text-gray-700 text-sm font-medium mb-1">เลขทะเบียนรถ</label>
                    <input type="text" id="search_carregistration"
                        value={search_carregistration} onChange={(e) => setsearch_carregistration(e.target.value)} placeholder="เลขทะเบียนรถ"
                        className="h-[42px] shadow border rounded-lg w-full px-4 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    </div>
                <div className="w-full md:w-auto flex flex-col items-start md:items-end">
                <label className="block text-transparent mb-1">Search</label>
                <button type="button" onClick={search} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                </button>
                </div>
            </div>
            </form>
            <div className='relative overflow-x-auto shadow-md rounded-2xl mt-6'>
                <table className="w-full text-left text-gray-600 bg-white shadow-md rounded-lg">
                    <thead className="text-sm md:text-base text-white bg-blue-500">
                        <tr>
                            <th className='px-4 py-3'>วันที่เข้าใช้บริการ</th>
                            <th className='px-6 py-3'>เวลาที่จอง</th>
                            <th className='text-center px-6 py-3'>เลขทะเบียนรถ</th>
                            <th className='text-center px-6 py-3'>ดูรายละเอียด</th>
                            <th className='text-center px-6 py-3'>แก้ไข</th>
                            <th className='text-center px-6 py-3'>สถานะ</th>
                            <th className='text-center px-6 py-3'>ลบคิว</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentQueuedata.map((item, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                                <td className='px-4 py-3'>{new Date(item.Booking_Date).toLocaleDateString('th-TH')}</td>
                                <td className='px-4 py-3'>{item.Booking_Time}</td>
                                <td className='text-center py-3'>{item.Car_RegisNum}</td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => openDetailModal(item)} className="text-blue-500 hover:text-blue-700">📄</button>  
                                </td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => openEditModal(item)} className="text-yellow-500 hover:text-yellow-700">✏️</button>
                                </td>
                                <td className="text-center py-3">
                                    <div className="flex flex-col items-center space-y-2">
                                    <select
                                        value={item.Booking_Status_ID}
                                        onChange={(e) => handleStatusChange(item.Booking_ID, parseInt(e.target.value))}
                                        className="shadow border rounded-lg w-full py-2 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                        {statusdropdown.map((status, index) => (
                                            <option key={index} value={status.Booking_Status_ID}>
                                            {status.Booking_Status_Name}
                                            </option>
                                        ))}
                                        </select>

                                        {(item.Booking_Status_ID === 2 || item.Booking_Status_ID === 3) && (
                                        <div className="w-full">
                                            <div className="flex flex-wrap gap-2 mb-2">
                                            {item.Technician_IDs?.map((tid) => {
                                                const tech = techniciandata.find(t => t.Technician_ID === tid);
                                                return (
                                                <span key={tid} className="flex items-center bg-teal-100 text-teal-800 text-sm px-2 py-1 rounded-full border border-teal-300">
                                                    {tech?.Technician_Name || "ไม่พบชื่อ"}
                                                    <button
                                                    type="button"
                                                    className="ml-2 text-sm hover:text-red-500"
                                                    onClick={() => {const newSelected = item.Technician_IDs.filter(id => id !== tid);handleTechnicianChange(item.Booking_ID, newSelected);}}>✕
                                                    </button>
                                                </span>);
                                            })}
                                            </div>
                                            <select value="" onChange={(e) => {const selectedTid = parseInt(e.target.value);
                                                const alreadySelected = item.Technician_IDs?.includes(selectedTid);
                                                if (!alreadySelected) {
                                                    const newSelected = [...(item.Technician_IDs || []), selectedTid];
                                                    handleTechnicianChange(item.Booking_ID, newSelected);
                                                }
                                            }}
                                            className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-400">
                                            <option value="">เลือกช่างผู้รับผิดชอบ</option>
                                            {Array.isArray(techniciandata) &&techniciandata.map((tech) => (
                                                <option key={tech.Technician_ID} value={tech.Technician_ID}>
                                                    {tech.Technician_Name}
                                                </option>
                                                ))}
                                            </select>
                                        </div>)}
                                    </div>
                                </td>
                                <td className='text-center py-3'>
                                    <button type='button' onClick={() => deleteitem(item.Booking_ID)} className="text-red-500 hover:text-red-700">❌</button>  
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
                            <p><strong>ชื่อจริง:</strong> {Detail.User_Firstname}</p>
                            <p><strong>นามสกุล:</strong> {Detail.User_Lastname}</p>
                            <p><strong>รุ่นของรถ:</strong>{Detail.Model_Name} {Detail.Model_Year}</p>
                            <p><strong>เลขทะเบียนรถ:</strong>{Detail.Car_RegisNum} {Detail.Province_Name}</p>
                            <p><strong>รายละเอียดการจอง:</strong> {Detail.Booking_Description ? Detail.Booking_Description : "-"}</p>
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