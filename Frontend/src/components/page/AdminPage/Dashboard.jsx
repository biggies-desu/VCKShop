import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import { Chart } from "react-google-charts";


function Dashboard()
{
    const [queuedata, setqueuedata] = useState([])
    const [queuestatusdata, setqueuestatusdata] = useState([])
    const [itemdata, setitemdata] = useState([])
    const [itemtypedata, setitemtypedata] = useState([])
    const [notifydata, setnotifydata] = useState([])
    const [isListoflowsupplyModalOpen, setisListoflowsupplyModalOpen] = useState(false)
    const [notifyitem, setnotifyitem] = useState([])

    const [chart1, setchart1] = useState([])
    const [chart2, setchart2] = useState([])
    const colormapping = {
        "เสร็จสิ้นแล้ว":"#4CAF50",
        "กำลังดำเนินการ":"#FFF59D",
        "รอดำเนินการ":"#FF5722"
    }

    const getRandomColor = () => {
        return `#${Math.floor(Math.random()*16777215).toString(16)}`; // Random HEX color
    };

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
                setqueuestatusdata(res[1].data) //*use for queue chart
                setitemdata(res[2].data)
                setitemtypedata(res[3].data) //* use for itemtype in warehouse
                setnotifydata(res[4].data)
                setnotifyitem(res[5].data)

               //set chart1 -- จำนวนสถานะคิว
               let chartdata1 = [
                ["สถานะ", "จำนวน", { role: "style" }],
                ...res[1].data.map(item => [item.label, Number(item.value), colormapping[item.label]])
               ]
               setchart1(chartdata1)
               //set chart2 -- จำนวนอะไหล่ตามประเภทในร้านที่มี
               let chartdata2 = [
                ["ประเภทอะไหล่", "จำนวน", { role: "style" }],
                ...res[3].data.map(item => [item.label, Number(item.value), getRandomColor()])
               ]
               setchart2(chartdata2)
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
    <div className="p-6 bg-gray-100 min-h-screen">
    <div className='kanit-bold flex flex-row justify-center items-center bg-white p-4 shadow-md rounded-lg'>
        <h1 className="max-md:text-lg md:text-4xl text-gray-700">Dashboard</h1>
    </div>
    <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 mt-4">
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
                <p>คิวที่รอดำเนินการ</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
        </div>
        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{queuestatusdata[1]?.value}</h3>
                <p>คิวที่กำลังดำเนินการ</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
        </div>
        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{queuestatusdata[2]?.value}</h3>
                <p>คิวที่เสร็จแล้ว</p>
            </div>
            <div class="icon">
                <i class="ion ion-stats-bars"></i>
            </div>
        </div>
        </div>
    {chart1 && <Chart chartType="ColumnChart" width="100%" height="100%" data={chart1} />}
    {chart2.length > 1 && <Chart chartType="ColumnChart" width="100%" height="100%" data={chart2} />}
    {isListoflowsupplyModalOpen && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-3xl mx-4 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-center">รายการสินค้าที่เหลือน้อย</h2>
                <div onClick={() => closelowsupplymodal()}><button type ='button'>
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
        </div>
        )}
    </div>
    </>
}

export default Dashboard