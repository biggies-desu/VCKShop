import React, { useEffect,useState } from "react";
import axios from "axios";

function Tax()
{
    const [taxdata, settaxdata] = useState([])
    const [detail, setdetail] = useState([])
    const [search_time, setsearch_time] = useState('')
    const [isDetailModalOpen, setisDetailModalOpen] = useState(false)
    const [totaltax, settotaltax] = useState([])
    useEffect(() => {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/getalltax`),
            axios.get(`${import.meta.env.VITE_API_URL}/getcurrentmonthtotaltax`)
        ])
        .then((res) => {
            settaxdata(res[0].data)
            settotaltax(res[1].data)
            
        })
        .catch((err) => console.log(err))
    }, [])

    function searchtime(search_time)
    {
        if(search_time)
        {
            axios.all([
                axios.post(`${import.meta.env.VITE_API_URL}/getmonthtax`,{search_time: search_time}),
                axios.post(`${import.meta.env.VITE_API_URL}/getselectmonthtotaltax`,{search_time: search_time})
            ])
            .then((res) => {
                console.log(res[0].data)
                console.log(res[1].data)
            settaxdata(res[0].data)
            settotaltax(res[1].data)
        })
            .catch((err)=>{
            console.log(err)
        })
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

    return <>
    <div className="p-6 bg-gray-100 min-h-screen">
        <div className='flex flex-row justify-center items-center bg-white p-4 shadow-md rounded-lg'>
            <h1 className="text-xl font-semibold text-gray-700">คำนวณภาษี</h1>
        </div>
        {totaltax && (
            <div className="bg-yellow-400 p-4 rounded-lg shadow-md mt-4">
            <div className="flex justify-between items-center">
            <div>
                <h3 className="text-3xl font-bold text-gray-800">{totaltax?.[0]?.totaltax ?? '0.00'} บาท</h3>
                <p className="text-gray-700">จำนวนภาษีเดือนนี้</p>
            </div>
            <div className="text-gray-600">
                <i className="ion ion-stats-bars text-4xl"></i>
            </div>
            </div>
        </div>
        )}
        
        
        <form className="mt-4 p-4 bg-white shadow-md rounded-lg flex space-x-4 items-center">      
            <input className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="month" type="month" required onChange={(e) => setsearch_time(e.target.value)}/>
            <button type='button' id="search" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" required onClick={() => searchtime(search_time)}>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                </svg>
            </button>
        </form>
        <div className='relative overflow-x-auto shadow-md rounded-2xl mt-6'>
            <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-lg">
                <thead className="text-base text-white bg-blue-500">
                    <tr>
                        <th className='px-4 py-3'>เลขคิว</th>
                        <th className='px-6 py-3'>วันที่จอง</th>
                        <th className='px-6 py-3'>เวลา</th>
                        <th className='text-center px-6 py-3'>ดูรายละเอียด</th>
                        <th className='text-center px-6 py-3'>จำนวนภาษี 7%</th>
                    </tr>
                </thead>
                <tbody>
                {taxdata.map((item, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100">
                        <td className='px-4 py-3'>#{item.booking_id}</td>
                        <td className='px-4 py-3'>{new Date(item.booking_date).toLocaleDateString('th-TH')}</td>
                        <td className='px-4 py-3'>{item.booking_time}</td>
                        <button type='button' onClick={() => openDetailModal(item)} className="text-blue-500 hover:text-blue-700 px-4 py-3">📄รายละเอียด</button>
                        <td className='px-4 py-3'>{item.totaltax} บาท</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
    {isDetailModalOpen && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-lg w-1/2 max-h-screen">
            <div className="flex flex-row justify-between">
                <h2></h2>
                <h2 className="text-[1.5vw] text-center">รายการสินค้าที่เหลือน้อย</h2>
                <div onClick={() => CloseDetailModal()}><button type ='button'>
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
                </button></div>
                </div>
                <div className="relative overflow-x-auto">
                <table className="w-full text-left text-[1vw] table-auto">
                    <thead>
                        <tr>
                            <th className="text-start px-3 py-2">รหัสสินค้า</th>
                            <th className="text-start px-3 py-2">ชื่อสินค้า</th>
                            <th className="text-center px-2 py-2">จำนวนที่ขาย</th>
                            <th className="text-end px-2 py-2">ภาษี 7%(VAT)</th>
                        </tr>
                    </thead>
                    <tbody>
                    {detail?.length > 0 ? (
                         detail.map((item, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100">
                            <td className="text-start py-4">{item.sparepart_productid}</td>
                            <td className="text-start py-4">{item.sparepart_name}</td>
                            <td className="text-center py-4">{item.booking_sparepart_quantity}</td>
                            <td className="text-end py-4">{item.taxprice} บาท</td>
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
        </div>)}
    </>
}

export default Tax