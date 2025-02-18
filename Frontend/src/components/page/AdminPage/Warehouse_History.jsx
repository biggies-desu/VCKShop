import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function Warehouse_History()
{
    const [logdata, setlogdata] = useState([])
    const [search_time, setsearch_time] = useState('')

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/warehouselog`)
        .then((res) => {
            setlogdata(res.data)
        })
        .catch((err) => {
            console.log(err)
        });
    }, []);

    function searchtime(even) {
        event.preventDefault();
        console.log("search : ", search_time);
        axios.post(`${import.meta.env.VITE_API_URL}/searchwarehousetime`, 
            {
                search_time: search_time
            }
        )
        .then((res) => {
            setlogdata(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    return <>
    <div class='flex flex-row justify-between'>
        <h1 className="text-[1.5vw] mb-4 pt-4 px-4 "></h1>
        <h1 className="text-[1.5vw] mb-4 pt-4 px-4 ">ประวัติการนำเข้า-จ่ายสินค้า</h1>
        <h1 className="text-[1.5vw] mb-4 pt-4 px-4 "></h1>
    </div>
    <form className="mt-4 p-4 bg-white shadow-md rounded-lg flex space-x-4 items-center">      
        <input className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="date" type="date" required onChange={(e) => setsearch_time(e.target.value)}/>
        <button type='button' id="search" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" onClick={searchtime}>
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
            </svg>
        </button>
    </form>
    <div className='relative overflow-x-auto shadow-md rounded-2xl mt-6'>
        <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-lg">
            <thead className="text-base text-white bg-blue-500">
                <tr>
                    <th class='text-start px-3 py-2'>วันที่ดำเนินการ</th>
                    <th class='text-start px-3 py-2'>กิจกรรม</th>
                    <th class='text-end px-6 py-2'>รายละเอียด</th>
                </tr>
            </thead>
        <tbody>
            {
                logdata.map((item, index) => (
                    <tr key = {index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100">
                         <td className="text-start px-3 py-2">{item.WL_Time}</td>
                         <td class ='text-start px-3 py-2'>{item.WL_Action}</td>
                         <td class ='text-end px-6 py-2'>{item.WL_Description}</td>
                    </tr>
                ))
            }
        </tbody>
    </table>
    </div>
    </>
}
export default Warehouse_History