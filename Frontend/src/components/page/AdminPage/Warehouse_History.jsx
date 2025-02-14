import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function Warehouse_History()
{
    const [logdata, setlogdata] = useState([])

    useEffect(() => {
        axios.get('http://localhost:5000/warehouselog')
            .then((res) => {
                setlogdata(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    
    return <>
    <div class='flex flex-row justify-between'>
        <h1 className="text-[1.5vw] mb-4 pt-4 px-4 "></h1>
        <h1 className="text-[1.5vw] mb-4 pt-4 px-4 ">ประวัติการนำเข้า-จ่ายสินค้า</h1>
        <h1 className="text-[1.5vw] mb-4 pt-4 px-4 "></h1>
    </div>

    <div class='relative overflow-x-auto shadow-md sm:rounded-2xl'>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-base text-gray-700 bg-gray-400">
            <tr>
            <th class='text-start px-3 py-2'>วันที่ดำเนินการ</th>
            <th class='text-start px-3 py-2'>กิจกรรม</th>
            <th class='text-end px-6 py-2'>รายละเอียด</th>
            </tr>
        </thead>
        <tbody>
            {
                logdata.map((item, index) => (
                    <tr key = {index} className="odd:bg-white even:bg-gray-100 border-b-2">
                         <td class ='text-start px-3 py-2'>{item.WL_Time}</td>
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