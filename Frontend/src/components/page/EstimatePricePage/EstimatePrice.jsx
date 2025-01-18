import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function EstimatePrice() {
    const [brand, setBrand] = useState("");
    const [service, setService] = useState("");

    const [dropdownservice, setdropdownservice] = useState([])
    const [dropdownbrand, setdropdownbrand] = useState([])

    const location = useLocation();
    const { state } = location || {};
    const cart = state?.cart || []; // รับข้อมูล Array ที่ส่งมา
    const totalPrice = cart.reduce((sum, item) => sum + item.SparePart_Price, 0);

    const navigate = useNavigate();

    const handleAddService = () => {
        setService(""),setBrand("");
      }

      useEffect(() => {
        axios.all([
            axios.get('http://localhost:5000/api/getdropdownbrand'),
            axios.get('http://localhost:5000/api/getdropdownservice')
            ])
            
            .then((res) => { // i copied this in modal_addprodect,jsx
                setdropdownbrand(res[0].data)
                setdropdownservice(res[1].data)
            })
            .catch((err) => {
                console.log(err);
              });
        ;} ,[]);

    function getPagePath()  {
        switch (brand) {
            case "Honda":
                return "/Honda";
            case "Toyota":
                return "/Toyota";
            case "Ford":
                return "/Ford";
            case "Nissan":
                return "/Nissan";
            case "Mazda":
                return "/Mazda";
            case "Mitsubishi":
                return "/Mitsubishi";
            case "Suzuki":
                return "/Suzuki";
            default:
                return "/EstimatePrice";
        }
    };

    function Cart()  {
        if (cart.length > 0) {
            return (
            <div className="">
                {cart.map((item, index) => (
                        <div key={index} class='flex flex-row justify-between'>
                            <p className="text-start text-xl">{index+1}. {item.SparePart_Name}</p>
                            <p className="text-end text-xl">{item.SparePart_Price} บาท</p>
                        </div>
                ))}
                <div class="flex flex-col py-4">
                    <p class="text-end text-gray-600">ราคารวมทั้งหมด:</p>
                    <p class="text-end text-2xl font-bold text-blue-600">{totalPrice} บาท</p>
                </div>
            </div>
        );
        } else {
            <p>ไม่มีข้อมูลอะไหล่</p>
        }
    }

    const Navigatetoqueue = () => {
        navigate('/queue',{state: {cart}})
    }

    return <>
    <Navbar />
    <div className="bg-white p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">เครื่องมือสำหรับการประเมินราคาอะไหล่พร้อมบริการและค่าบริการ</h1>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2">ค้นหาอะไหล่ตามยี่ห้อ/รุ่น</label>
            <div className="flex space-x-4">
                <select id="brand" value={brand} type="text"  onChange={e => {setBrand(e.target.value)}} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ยี่ห้อ">
                <option selected value='' disabled>เลือกยี่ห้อ</option>
                    {dropdownbrand && dropdownbrand.length > 0 && dropdownbrand.map((item, index) => (
                    <option key={index} value={item.SparePart_Brand_Name}>
                    {item.SparePart_Brand_Name}
                    </option>
                    ))}
                </select>
                <Link to={getPagePath()}>
                    <button className="p-2 rounded">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="black" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                        </svg>
                    </button>
                </Link>
            </div>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2">บริการ</label>
            <div className="flex space-x-2">
                <select id="service" value={service} type="text" onChange={e =>  setService(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="รุ่น">
                <option selected value='' disabled>เลือกบริการ</option>
                    {dropdownservice && dropdownservice.length > 0 && dropdownservice.map((item, index) => (
                    <option key={index} value={item.Service_Name}>
                    {item.Service_Name}
                    </option>
                    ))}
                </select>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleAddService} >เพิ่มเข้ารายการ</button>
            </div>
        </div>

        <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">ผลการประเมินราคา</h2>{Cart()}
        </div>
        <div class='flex flex-row justify-end'>
            <button onClick={Navigatetoqueue} class = 'text-center rounded-full bg-green-400 text-[1vw] py-4 px-4 mt-4 '>จองตอนนี้</button>
      </div>
    </div>
    <Footer />
    </>
}

export default EstimatePrice