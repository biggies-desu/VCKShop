import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart } from "@mui/x-charts"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

function Dashboard()
{
    const [queuedata, setqueuedata] = useState([])
    const [queuestatusdata, setqueuestatusdata] = useState([])
    const [itemdata, setitemdata] = useState([])
    const [itemtypedata, setitemtypedata] = useState([])
    const [notifydata, setnotifydata] = useState([])
    const [isListoflowsupplyModalOpen, setisListoflowsupplyModalOpen] = useState(false)
    const [queuechart, setqueuechart] = useState()
    const [itemchart, setitemchart] = useState()
    const [notifyitem, setnotifyitem] = useState([])

    ChartJS.register(ArcElement, Tooltip, Legend);

    useEffect(() => {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/getdashboard_queuenum`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdashboard_queuestatusnum`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdashboard_itemnum`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdashboard_itemtypenum`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdashboard_notifynum`),
            axios.get(`${import.meta.env.VITE_API_URL}/getnotifyitem`) //in linemessage/getnotifyitem
        ])
            .then((res) => {
                setqueuedata(res[0].data)
                setqueuestatusdata(res[1].data)
                setitemdata(res[2].data)
                setitemtypedata(res[3].data)
                setnotifydata(res[4].data)
                setnotifyitem(res[5].data)

                //set data to queuechart to display in chartjs
                const formattedqueuechart = {
                    labels: res[1].data.map((item) => item.label),
                    datasets: [
                        {
                            data: res[1].data.map((item) => item.value),
                            backgroundColor: [
                                'rgba(45, 255, 185, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                              ],
                              borderColor: [
                                'rgba(45, 255, 185, 1)',
                                'rgba(255, 99, 132, 1)',
                                
                              ],
                              borderWidth: 1,
                        }
                    ]
                }
                setqueuechart(formattedqueuechart)
                //set data to itemchart to display in chartjs
                const formatteditemchart = {
                    labels: res[3].data.map((item) => item.label),
                    datasets: [
                        {
                            data: res[3].data.map((item) => item.value),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                        }
                    ]
                }
                setitemchart(formatteditemchart)

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
    <div class="grid grid-cols-4 gap-4 px-2">
        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{queuedata[0]?.value}</h3>
                <p>จำนวนการจองทั้งหมด</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
        </div>
        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{queuedata[1]?.value}</h3>
                <p>จำนวนการจองวันนี้</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
        </div>
        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{queuedata[2]?.value}</h3>
                <p>จำนวนการจองเดือนนี้</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
        </div>
        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{notifydata[0]?.value}</h3>
                <p>จำนวนอะไหล่ที่แจ้งเตือน</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
            <div class="small-box-footer text-left px-2" onClick={() => openlowsupplymodal()}>
                ดูรายการ
            </div>
        </div>

        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{itemdata[0]?.value}</h3>
                <p>จำนวนอะไหล่ในร้าน</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
        </div>
        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{queuestatusdata[0]?.value}</h3>
                <p>คิวที่เสร็จแล้ว</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
        </div>
        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{queuestatusdata[1]?.value}</h3>
                <p>คิวที่ยังไม่เสร็จ</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
        </div>
        <div>
        </div>
    <div class='col-span-2'>
        <div class = 'h-[20vw] w-full flex flex-col'>
            <div class = 'text-center text-[1.5vw] font-bold pb-4'>จำนวนคิวที่มี</div>
            <div class="h-[25vw] flex items-center justify-center">
                {queuechart ? <Pie data={queuechart} /> : <div>Loading...</div>}
            </div>
        </div>
    </div>
    <div class='col-span-2'>
        <div class = 'h-[20vw] w-full flex flex-col'>
            <div class = 'text-center text-[1.5vw] font-bold pb-4'>ประเภทอะไหล่ที่มีในร้าน</div>
            <div class="h-[25vw] flex items-center justify-center">
                {itemchart ? <Pie data={itemchart} /> : <div>Loading...</div>}
            </div>
        </div>
    </div>

    
    


    </div>
    </div>
    {isListoflowsupplyModalOpen && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-lg w-1/2 max-h-screen">
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
                        {notifyitem.map((item,index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100">
                                <td className="text-start py-4">{item.SparePart_ProductID}</td>
                                <td className="text-start py-4">{item.SparePart_Name}</td>
                                <td className="text-end py-4">{item.Category_Name}</td>
                                <td className="text-end py-4">{item.SparePart_Amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>)}
    </>
}

export default Dashboard