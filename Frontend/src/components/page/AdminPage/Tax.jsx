import React, { useEffect,useState } from "react";
import axios from "axios";

function Tax()
{
    const [taxdata, settaxdata] = useState([])
    const [detail, setdetail] = useState([])
    const [search_time, setsearch_time] = useState('')
    const [search_time2, setsearch_time2] = useState('')
    const [isDetailModalOpen, setisDetailModalOpen] = useState(false)
    const [totalprice, settotalprice] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // จำนวนรายการที่จะแสดงในแต่ละหน้า
    const [totalPages, setTotalPages] = useState(1);
    const [issearch, setissearch] = useState(false)
    const [vatdropdown, setvatdropdown] = useState([])
    const [vat, setvat] = useState('')

    useEffect(() => {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/getalltax`),
            axios.get(`${import.meta.env.VITE_API_URL}/getcurrentmonthtotalprice`),
            axios.get(`${import.meta.env.VITE_API_URL}/default_vat`)
        ])
        .then((res) => {
            settaxdata(res[0].data)
            settotalprice(res[1].data)
            setvatdropdown(res[2].data)
            setvat(7) // default vat
            console.log(vatdropdown)
        })
        .catch((err) => console.log(err))
    }, [])

    useEffect(() => {
        if (taxdata.length > 0) {
            const totalPages = Math.ceil(taxdata.length / itemsPerPage);
            setTotalPages(totalPages); 
        }
    }, [taxdata, itemsPerPage]); 

    function searchtime() {
        if (search_time) {
            axios.all([
                axios.post(`${import.meta.env.VITE_API_URL}/getsearchtax`, {
                    search_time: search_time,
                    search_time2: search_time2 || search_time // กรณี search_time2 ไม่มีค่า ให้ใช้ search_time
                }),
                axios.post(`${import.meta.env.VITE_API_URL}/getselecttotalprice`, {
                    search_time: search_time,
                    search_time2: search_time2 || search_time
                })
            ])
            .then((res) => {
                console.log(res[0].data);
                console.log(res[1].data);
                settaxdata(res[0].data);
                settotalprice(res[1].data);
                setissearch(true);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    function fetchDetail(item)
    {
        axios.get(`${import.meta.env.VITE_API_URL}/gettaxdetail/${item.booking_id}`)
        .then((res) => {
            setdetail(res.data)
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function openDetailModal(item) {
        fetchDetail(item);
        setisDetailModalOpen(true);  
    }

    function CloseDetailModal(item) {
        setisDetailModalOpen(false);  
    }

    const currentTaxdata = taxdata.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const changePage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return <>
    <div className="p-6 bg-gray-100 min-h-screen">
        <div className='kanit-bold flex flex-row justify-center items-center bg-white p-4 shadow-md rounded-lg'>
            <h1 className="max-md:text-lg md:text-4xl text-gray-700">คำนวณภาษี</h1>
        </div>
        {totalprice && !issearch && (
        <div className="bg-yellow-400 p-4 rounded-lg shadow-md mt-4">
            <div className="flex justify-between items-center">
            <div>
                <h3 className="text-3xl font-bold text-gray-800">{ (totalprice?.[0]?.totalprice * (vat / (vat + 100))).toFixed(2) || "0.00" } บาท</h3>
                <p className="text-gray-700">จำนวนภาษีในเดือนที่ {(new Date()).getMonth()+1}</p>
            </div>
            <div className="text-gray-600">
                <i className="ion ion-stats-bars text-4xl"></i>
            </div>
            </div>
        </div>
        )}
        {totalprice && issearch && (
            <div className="bg-yellow-400 p-4 rounded-lg shadow-md mt-4">
            <div className="flex justify-between items-center">
            <div>
                <h3 className="text-3xl font-bold text-gray-800">{ (totalprice?.[0]?.totalprice * (vat / (vat + 100))).toFixed(2) || "0.00"} บาท</h3>
                <p className="text-gray-700">จำนวนภาษีในช่วงเวลาที่เลือก</p>
            </div>
            <div className="text-gray-600">
                <i className="ion ion-stats-bars text-4xl"></i>
            </div>
            </div>
        </div>
        )}
        
        
        <form className="mt-4 p-4 bg-white shadow-md rounded-lg md:flex md:space-x-4 items-center">      
            <input className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="month" type="date" required onChange={(e) => setsearch_time(e.target.value)}/>
            <input className="shadow border rounded-lg w-full max-md:mt-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="month" type="date" required onChange={(e) => setsearch_time2(e.target.value)}/>
            <select id="ีtax" className="shadow border rounded-lg w-full py-2 px-4 max-md:mt-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
             type="text" value={vat} placeholder='ภาษี' onChange={(e) => setvat(parseFloat(e.target.value))}>
                {vatdropdown.map((vat, index) => (
                    <option key={index} value={vat.VAT_Value}>
                        {vat.VAT_Name}
                    </option>
                ))}
             </select>
            <button type='button' id="search" className="p-2 max-md:mt-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" required onClick={() => searchtime()}>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                </svg>
            </button>
        </form>
        <div className='relative overflow-x-auto shadow-md rounded-2xl mt-6'>
            <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-lg">
                <thead className="text-sm md:text-base text-white bg-blue-500">
                    <tr>
                        <th className='px-4 py-3'>เลขคิว</th>
                        <th className='px-6 py-3'>วันที่จอง</th>
                        <th className='px-6 py-3'>เวลา</th>
                        <th className='text-center px-6 py-3'>ดูรายละเอียด</th>
                        <th className='text-center px-6 py-3'>จำนวนภาษี {vat}%</th>
                    </tr>
                </thead>
                <tbody>
                {currentTaxdata.map((item, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                        <td className='px-4 py-3'>#{item.booking_id}</td>
                        <td className='px-4 py-3'>{new Date(item.booking_date).toLocaleDateString('th-TH')}</td>
                        <td className='px-4 py-3'>{item.booking_time}</td>
                        <button type='button' onClick={() => openDetailModal(item)} className="text-blue-500 hover:text-blue-700 px-4 py-3">📄รายละเอียด</button>
                        <td className='px-4 py-3'>{(item.totalprice * (vat / (vat + 100))).toFixed(2)} บาท</td>
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
    {isDetailModalOpen && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-3xl mx-4 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4 kanit-bold">
                <h2></h2>
                <h2 className="text-xl text-center">รายการสินค้าที่เหลือน้อย</h2>
                <div onClick={() => CloseDetailModal()}><button type ='button'>
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
                </button></div>
                </div>
                <div className="relative overflow-x-auto">
                <table className="w-full text-sm md:text-base table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="text-start px-3 py-2">รหัสสินค้า</th>
                            <th className="text-start px-3 py-2">ชื่อสินค้า</th>
                            <th className="text-center px-2 py-2">จำนวนที่ขาย</th>
                            <th className="text-end px-2 py-2">ภาษี {vat}% (VAT)</th>
                        </tr>
                    </thead>
                    <tbody>
                    {detail?.length > 0 ? (
                         detail.map((item, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                            <td className="text-start py-4">{item.sparepart_productid}</td>
                            <td className="text-start py-4">{item.sparepart_name}</td>
                            <td className="text-center py-4">{item.booking_sparepart_quantity}</td>
                            <td className="text-end py-4">{(item.totalprice * (vat / (vat + 100))).toFixed(2)} บาท</td>
                            </tr>
                        ))
                    ) : (<tr>
                            <td colSpan="4" className="text-center py-4">ไม่พบข้อมูล</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )}
    </>
}

export default Tax