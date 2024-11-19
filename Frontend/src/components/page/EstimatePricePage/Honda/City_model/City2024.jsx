import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../../../Navbar";
import Footer from "../../../../Footer";
import { useNavigate } from "react-router-dom";

function City2024() {
    const [sparepart, setSparePart] = useState([]);
    const [categoryoption, setcategoryoption] = useState([]);
    const [cart, setCart] = useState([]); // ตะกร้าสินค้าที่เลือก
    const navigate = useNavigate();
    const ModelId = 3; // City2024
    useEffect(() => {
        fetchalldata()
    }, []);

    // const fetchSpareParts = async () => {
    //     // เรียก API เพื่อดึงข้อมูล
    //     const response = await fetch("API_URL");
    //     const data = await response.json();
    //     setSparePart(data);
    // };

    function AddToCart(val) {
        setCart((prevCart) => {
            // ตรวจสอบว่ามีสินค้าในตะกร้าแล้วหรือไม่
            const exists = prevCart.some(
                (cartItem) => cartItem.SparePart_ID === val.SparePart_ID
            );
            if (!exists) {
                return [...prevCart, val]; // เพิ่มสินค้าลงใน Array
            }
            return prevCart;
        });
    };

    const NavigateEstimate = () => {
        navigate("/estimateprice", { state: { cart } }); //ส่งข้อมูลไปหน้า estimateprice
    };

    function fetchalldata()
    {
        axios.all([
            axios.get(`http://localhost:5000/sparepart?modelId=${ModelId}`),
            axios.get(`http://localhost:5000/api/getdropdowncategory`)
        ])
        
        .then((response) => {
            setSparePart(response[0].data); // ตั้งค่าผลลัพธ์ที่ได้ใน state
            setcategoryoption(response[1].data);
            console.log(response)
        })
    }

    function sortbycategory(category)
    {
        console.log(category)
        axios.get(`http://localhost:5000/sparepartcategory?modelId=${ModelId}&category=${category}`) //ทำไม?
        .then((res) => {setSparePart(res.data)
        console.log(res)})
        
    }

    return <>
    <Navbar />
        <div className="flex p-4">
            <div className="flex items-center">
                <Link to="/City">
                    <button className="p-2 rounded">
                        <img src="src/components/image/back-icon.png" className="h-10 w-10"/>
                    </button>
                </Link>
            </div>
            <div className="flex p-4 justify-center items-center w-full">
                <h1 className="text-3xl font-semibold mb-6 text-center">ค้นหาจากรถยี่ห้อ Honda รุ่น City (2024)</h1>
            </div>
        </div>
        <div className="container mx-auto px-4">
            <p className="flex text-gray-900 text-2xl font-bold px-96 mb-6 text-nowrap">หมวดหมู่</p>
            <div className="flex justify-center mb-3 space-x-4">
            <button key="0" onClick={fetchalldata} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl">ทั้งหมด</button>
                {categoryoption.map((item, index) => (
                    <button key={index+1} onClick={() => sortbycategory(index+1)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl">{item.Category_Name}</button>
                ))}

            </div>
            <button onClick={NavigateEstimate} className="mt-4 bg-blue-500 text-white p-2 rounded-2xl flex justify-end items-end">ดูผลการประเมินราคา ({cart.length} รายการ)</button>
            <div className="grid lg:grid-cols-4 gap-4 m-10">
                {sparepart.map((val) => (
                    <div className="bg-white p-4 rounded shadow">
                    <span>
                        <img src={val.Category_ID == 3 ? "src/components/image/Cartires.png" : "src/components/image/wheel2.jpg" } width="200" height="100" />
                    </span>
                    <h2 className="text-lg font-bold">{val.SparePart_Name}</h2>
                    <p className="text-gray-400 mb-3">รหัสสินค้า {val.SparePart_ProductID}</p>
                    <p className="text-cyan-400 mb-3">{val.SparePart_Description}</p>
                    <div className="flex items-center text-red-500">
                        <span>*</span><p className="text-gray-700 ml-1">{val.SparePart_Price} บาท</p>
                    </div>
                    <button className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => AddToCart(val)}>เพิ่มไปยังตะกร้า</button>
                </div>
                ))}
            </div>
        </div>
        <Footer />
        </>
}

export default City2024;