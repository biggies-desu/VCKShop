import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function Queue_History({setishistorymodal})
{

    const [queuedata, setqueuedata] = useState([])

    useEffect(() => {
        axios.get('http://localhost:5000/api/queuehistory')
        .then((res) => {
            console.log(res.data)
            setqueuedata(res.data)
        })
        .catch((err) => {
            console.log(err);
        })
    },[])

    function viewdetail(index)
    {
        console.log(index)
    }

    return<>
    <div class='flex flex-col text-nowrap'>
        <div class='flex flex-row justify-between'>
            <button className="text-[1.5vw] mb-4 pt-4 px-6 "onClick={() => setishistorymodal(false)}>กลับ</button>
            <h1 className="text-[1.5vw] mb-4 pt-4 px-4 ">เพิ่มรายการสินค้า</h1>
            <h1 className="text-[1.5vw] mb-4 pt-4 px-4 "></h1>
        </div>
        
        <div class='relative overflow-x-auto'>
        <table class="w-full text-left text-[1vw] table-auto">
            <thead>
                <tr>
                <th class='text-start px-3 py-2'>วันที่จอง</th>
                <th class='text-start px-6 py-2'>เวลาที่จอง</th>
                <th class='text-end px-6 py-2'>ดูรายละเอียด</th>
                <th class='text-end px-6 py-2'>สถานะ</th>
                </tr>
            </thead>
            <tbody>
                {queuedata.map((item, index) => 
                <tr key={index}>
                    <td class ='text-start px-3 py-2'>{new Date(item.Booking_Date).toLocaleDateString('th-TH')}</td>
                    <td class ='text-start px-3 py-2'>{item.Booking_Time}</td>
                    <td class='text-end py-2' onClick={() => viewdetail(item.Queue_ID)}>
                        <button type = 'button'>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="black" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
                            </svg>
                        </button>  
                    </td>
                    <td class ='text-start px-3 py-2'>{item.Queue_Status}</td>
                </tr>

            )
        }
            </tbody>
        </table>
        </div>

    </div>
    </>
}


export default Queue_History