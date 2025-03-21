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
    const [selectedServices, setSelectedServices] = useState([]);
    const [dropdownservice, setdropdownservice] = useState([])
    const [dropdownbrand, setdropdownbrand] = useState([])

    const location = useLocation();
    const { state } = location || {};
    const [cart, setCart] = useState(state?.cart || []);
    const modelId = state?.modelId || null;
    const totalPrice = [...cart, ...selectedServices].reduce((sum, item) => sum + (item.SparePart_Price || 0) * (item.quantity || 1) + (item.Service_Price || 0),0);


    const navigate = useNavigate();

    const handleAddService = () => {
        if (service) {
            const selectedServiceUser = dropdownservice.find(item => item.Service_Name === service);
            if (selectedServiceUser) {
                setSelectedServices([...selectedServices, selectedServiceUser]);
                setService("");
            }
        }
    };
      useEffect(() => {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdownbrand`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdownservice`)
            ])
            
            .then((res) => {
                setdropdownbrand(res[0].data)
                setdropdownservice(res[1].data)
            })
            .catch((err) => {
                console.log(err);
              });
        ;} ,[]);
    
    function Cart() {
        useEffect(() => {
            if (cart.length > 0 && dropdownservice.length > 0) {
                const selectedService = dropdownservice[0];
                setSelectedServices(prevSelectedServices => [...prevSelectedServices, selectedService]);
            }
        }, [cart, dropdownservice]);
    
        if (cart.length > 0 || selectedServices.length > 0) {
            const sparePartIds = cart.map((item) => item.SparePart_ID);
            return (
                <div>
                    {cart.map((item, index) => (
                        <div key={index} className='flex flex-col md:flex-row justify-between'>
                            <p className="text-start text-lg flex flex-row justify-between w-12/12 sm:w-9/12 lg:w-10/12 2xl:w-11/12">{index + 1}. {item.SparePart_Name}<span className="ml-auto hidden md:flex flex-col md:flex-row">จำนวน :&nbsp;</span><span className="text-red-500 flex flex-col md:flex-row">{item.quantity}</span>&nbsp;รายการ</p>
                            <p className="sm:text-end text-lg">{Number(item.SparePart_Price.toFixed(2) * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2})} บาท</p>
                      </div>
                    ))}
                    {selectedServices.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row justify-between">
                            <p className="sm:text-end text-start text-lg">{cart.length + index + 1}. {item.Service_Name}</p>
                            <p className="sm:text-end text-lg">{Number(item.Service_Price.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2})} บาท</p>
                        </div>
                    ))}
                    <div className="flex flex-col py-4 px-4">
                        <div className="flex justify-end items-center gap-6">
                            <p className="text-end text-gray-600">จำนวนสินค้าทั้งหมด</p>
                            <p className="text-end text-gray-600">ราคารวมทั้งหมด</p>
                        </div>
                        <div className="flex justify-end items-center gap-6">
                            <p className="text-end text-2xl font-bold text-blue-600">รวม <span className="text-red-600">{cart.reduce((total, item) => total + item.quantity, 0) + selectedServices.length}</span> รายการ</p>
                            <p className="text-end text-2xl font-bold text-blue-600">{Number(totalPrice.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2})} บาท</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <p>ไม่มีข้อมูลอะไหล่</p>;
        }
    }
    const Navigatetoqueue = () => {
        navigate('/queue', { state: { cart, selectedServices, modelId } });
    };

    return <>
    <Navbar />
    <div className="bg-orange-100 p-6 pb-60 kanit-regular">
        <h1 className="text-3xl font-semibold mb-6 text-center">เครื่องมือสำหรับการประเมินราคาอะไหล่พร้อมบริการและค่าบริการ</h1>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2">ค้นหาอะไหล่ตามยี่ห้อ/รุ่น</label>
            <div className="flex space-x-4">
                <select id="brand" value={brand} type="text"  onChange={e => {setBrand(e.target.value)}} className="block w-full p-3 text-lg text-gray-800 border border-yellow-400 rounded-xl shadow-lg bg-orange-200 bg-opacity-50 focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="ยี่ห้อ">
                <option selected value='' disabled>เลือกยี่ห้อ</option>
                    {dropdownbrand.map((item, index) => (
                        <option key={index} value={item.Brand_Name}>{item.Brand_Name}</option>
                    ))}
                </select>
                <Link to="/Allcarmodels" state={{ selectedBrand: brand }}>
                    <button className="p-3 bg-orange-300 text-white rounded-xl hover:bg-orange-200 shadow-md">
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
                <select id="service" value={service} type="text" onChange={e =>  setService(e.target.value)} className="block w-full p-3 text-lg text-gray-800 border border-gray-300 rounded-xl shadow-lg bg-orange-200 bg-opacity-50 focus:ring-2 focus:ring-blue-500 transition-all" placeholder="รุ่น">
                                                                                                            
                <option selected value='' disabled>เลือกบริการ</option>
                    {dropdownservice.map((item, index) => (
                        <option key={index} value={item.Service_Name}>{item.Service_Name}</option> //คิดอยู่จะใช้ดีไหม dropdownservice.slice(1)
                    ))}
                </select>
                <button className="bg-orange-300 text-white px-4 py-2 rounded-lg hover:bg-orange-400 shadow-md transition-colors" onClick={handleAddService} >เพิ่มเข้ารายการ</button>
            </div>
        </div>

        <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">ผลการประเมินราคา</h2>{Cart()}
        </div>
        <div class='flex flex-row justify-end'>
            <button onClick={Navigatetoqueue} className='text-center rounded-full bg-green-500 text-lg py-4 px-8 mt-4 mb-20 hover:bg-green-400 transition-colors'>จองตอนนี้</button>
      </div>
    </div>
    <Footer />
    </>
}
export default EstimatePrice