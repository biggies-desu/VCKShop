import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart } from "@mui/x-charts"


function Dashboard()
{
    const [queuedata, setqueuedata] = useState([])
    const [queuestatusdata, setqueuestatusdata] = useState([])
    const [itemdata, setitemdata] = useState([])
    const [itemtypedata, setitemtypedata] = useState([])

    const [isListoflowsupplyModalOpen, setisListoflowsupplyModalOpen] = useState(false)

    useEffect(() => {
        axios.all([
            axios.get('http://localhost:5000/api/getdashboard_queuenum'),
            axios.get('http://localhost:5000/api/getdashboard_queuestatusnum'),
            axios.get('http://localhost:5000/api/getdashboard_itemnum'),
            axios.get('http://localhost:5000/api/getdashboard_itemtypenum')
        ])
            .then((res) => {
                setqueuedata(res[0].data)
                setqueuestatusdata(res[1].data)
                setitemdata(res[2].data)
                setitemtypedata(res[3].data)
                console.log(res)
            })
            .catch((err) => {
                console.log(err);
              });
        ;} ,[]);

    function openlowsupplymodal(){
        setisListoflowsupplyModalOpen(true) // open modal
    }

    function closelowsupplymodal(){
        setisListoflowsupplyModalOpen(false) // close modal
    }

    return <>
    <div class ='flex flex-col Justify-center'>
    <h1 class="text-[1.5vw] mb-4 text-center pt-4">Dashboard</h1>
    <div class="grid grid-cols-2 auto-rows-min">
    <div class = 'h-44 w-full text-nowrap' id='top1'>
        <div class ='grid grid-cols-2 '>
            <div class='bg-zinc-100 p-8 rounded shadow-lg mx-2 border-black border-2 flex flex-col justify-center'>
                <div class='flex justify-center pb-4 font-bold text-[1.5vw]'>จำนวนการจองทั้งหมด</div>
                <div class='flex justify-center font-bold text-[1.7vw]'>{queuedata[0]?.value}</div>
            </div>
            <div class='bg-zinc-100 p-8 rounded shadow-lg mx-2 border-black border-2 flex flex-col justify-center'>
            <div class='flex justify-center pb-4 font-bold text-[1.5vw]'>จำนวนการจองในวันนี้</div>
            <div class='flex justify-center font-bold text-[1.7vw]'>{queuedata[1]?.value}</div>
            </div>
        </div>
    </div>
    <div class = 'h-44 w-full text-nowrap' id ='top2'>
        <div class ='grid grid-cols-2 '>
        <div class='bg-zinc-100 p-8 rounded shadow-lg mx-2 border-black border-2 flex flex-col justify-center'>
            <div class='flex justify-center pb-4 font-bold text-[1.5vw]'>จำนวนการจองในเดือนนี้</div>
            <div class='flex justify-center font-bold text-[1.7vw]'>{queuedata[2]?.value}</div>
            </div>
            <div class='bg-zinc-100 p-8 rounded shadow-lg mx-2 border-black border-2 flex flex-col justify-center'>
            <div class='flex justify-center pb-4 font-bold text-[1.5vw]'>จำนวนสินค้าที่เหลือน้อย</div>
            <div class='flex flex-row justify-between'>
            <div class='flex justify-center font-bold text-[1.7vw]'>1</div>
            <div className="block rounded px-2 py-1 text-gray-700 bg-green-400 hover:bg-green-500 shadow-lg active:bg-green-700 focus:bg-green-500"
            onClick={() => openlowsupplymodal()}>ดูรายการ</div>
            </div>
            
            </div>
        </div>
    </div>
    <div class = 'h-44 w-full text-nowrap' id='top3'>
        <div class ='grid grid-cols-2 '>
            <div class='bg-zinc-100 p-8 rounded shadow-lg mx-2 border-black border-2 flex flex-col justify-center'>
            <div class='flex justify-center pb-4 font-bold text-[1.5vw]'>จำนวนคิวที่เสร็จแล้ว</div>
            <div class='flex justify-center font-bold text-[1.7vw]'>{queuestatusdata[0]?.value}</div>
            </div>
            <div class='bg-zinc-100 p-8 rounded shadow-lg mx-2 border-black border-2 flex flex-col justify-center'>
                <div class='flex justify-center pb-4 font-bold text-[1.5vw]'>จำนวนคิวที่กำลังดำเนืนการ</div>
                <div class='flex justify-center font-bold text-[1.7vw]'>{queuestatusdata[1]?.value}</div>
            </div>
            
        </div>
    </div>
    <div class = 'h-44 w-full text-nowrap' id ='top4'>
        <div class ='grid'>
            <div class='bg-zinc-100 p-8 rounded shadow-lg mx-2 border-black border-2 flex flex-col justify-center'>
            <div class='flex justify-center pb-4 font-bold text-[1.5vw]'>จำนวนสินค้าในคลัง</div>
            <div class='flex justify-center font-bold text-[1.7vw]'>{itemdata[0]?.value}</div>
            </div>
        </div>
    </div>
    
    <div class = 'h-[20vw] w-full flex flex-col'>
        <div class = 'text-center text-[1.5vw] font-bold pb-4'>จำนวนคิวที่มี</div>
        <PieChart series={[{
        data: queuestatusdata,
        arcLabel: (item) => `${item.label}`,
        arcLabelMinAngle: 30
        },]}/>
    </div>
    <div class = 'h-[20vw] w-full flex flex-col'>
        <div class = 'text-center text-[1.5vw] font-bold pb-4'>ประเภทอะไหล่ที่มีในร้าน</div>
        <PieChart series={[{
        data: itemtypedata,
        arcLabel: (item) => `${item.label}`,
        arcLabelMinAngle: 30
        },]}/>
    </div>
    </div>
    </div>
    {isListoflowsupplyModalOpen && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-lg w-1/3 max-h-screen">
            <div className="flex flex-row justify-between">
                <h2></h2>
                <h2 className="text-[1.5vw] text-center">รายการสินค้าที่เหลือน้อย</h2>
                <div onClick={() => closelowsupplymodal()}><button type ='button'>
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
                            <th className="text-start px-6 py-2">ประเภท</th>
                            <th className="text-end px-2 py-2">จำนวนที่เหลือ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key='1'>
                        <td className="text-start px-3 py-2">xxxxxx</td>
                        <td className="text-start px-3 py-2">น้ำมันเครื่อง No.1</td>
                        <td className="text-start px-3 py-2">น้ำมันเครื่อง</td>
                        <td className="text-end px-1 py-2">1</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>)}
    </>
}

export default Dashboard