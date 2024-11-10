import React, { useState, useEffect } from "react";
import Navbar from "../Navbar.jsx"
import Footer from "../Footer.jsx"

function Calc()
{
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [service, setService] = useState("");
    const [models, setModels] = useState([]);
    const handleAddService = () => {
        setService(""),setBrand("");
    }
    //set brand/model
    useEffect(() => {
        if (brand === "Honda") {
            setModels(["City", 
              "Jazz", 
              "Civic", 
              "Accord", 
              "HR-V", 
              "CR-V"]);
        }  else if (brand === "Toyota") {
            setModels(["Yaris", 
              "Vios", 
              "Corolla Altis", 
              "Camry", 
              "Fortuner", 
              "Hilux Revo", 
              "Alphard"]);
        }  else if (brand === "Ford") {
                setModels(["Everest", 
                  "Ranger", 
                  "Mustang"]);
        } else {
            setModels([]);
        }
    }, [brand]);

    return <>
    <Navbar />
    <div className="bg-white p-6 mt-8">
        <h1 className="text-[3vw] font-semibold mb-6 text-center">เครื่องมือสำหรับการประเมินราคาอะไหล่พร้อมบริการและค่าบริการ</h1>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-[2vw]">ค้นหาอะไหล่ตามยี่ห้อ/รุ่น</label>
            <div className="flex space-x-4">
                <select id="brand" className="border border-gray-300 p-2 rounded w-4/12" value={brand} onChange={(e) => setBrand(e.target.value)}>
                    <option value="">เลือกยี่ห้อ</option>
                    <option value="Honda">Honda</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Ford">Ford</option>
                </select>
                <select id="model" className="border border-gray-300 p-2 rounded w-4/12" value={model} onChange={(e) => setModel(e.target.value)}>
                    <option value="">เลือกรุ่น</option>
                    {models.map((model) => (
                        <option key={model} value={model}> {model} </option>
                        ))}
                </select>
                <button className="p-2 rounded" onClick={handleAddService} >
                    <img src="images/search-symbol.png" className="h-[3vw] w-[3vw]"/>
                </button>
            </div>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-[2vw]">บริการ</label>
            <div className="flex space-x-2">
                <select className="border border-gray-300 p-2 rounded w-full" value={service} onChange={(e) => setService(e.target.value)}>
                    <option value="">เลือกบริการ</option>
                    <option value="ChangeParts">เปลี่ยนอะไหล่</option>
                    <option value="OilChange">ถ่ายน้ำมันเครื่อง</option>
                    <option value="CheckCar">ตรวจสภาพรถ</option>
                </select>
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 text-[1.5vw]" onClick={handleAddService} >เพิ่มเข้ารายการ</button>
            </div>
        </div>

        <div class="mt-8 border-t pt-6">
            <h2 class="text-[2vw] font-bold mb-4">ผลการประเมินราคา</h2>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-gray-600 text-[1.4vw]">ค่าอะไหล่:</p>
                    <p class="text-[1.8vw] font-bold">XXX บาท</p>
                </div>
                <div>
                    <p class="text-gray-600 text-[1.4vw]">ค่าบริการ:</p>
                    <p class="text-[1.8vw] font-bold">XXX บาท</p>
                </div>
                <div class="col-span-2">
                    <p class="text-gray-600 text-[1.4vw]">ราคารวมทั้งหมด:</p>
                    <p class="text-[1.8vw] font-bold text-blue-600">XXX บาท</p>
                </div>
            </div>
      </div>
    </div>
    <Footer />
    </>
}

export default Calc