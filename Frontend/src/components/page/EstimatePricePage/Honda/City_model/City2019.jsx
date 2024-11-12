import React from "react";
import Navbar from "../../../../Navbar.jsx";
import Footer from "../../../../Footer.jsx";
import { Link } from "react-router-dom";

function City2019()
{
    return <>
    <Navbar />
    <div class="flex p-4">
        <div class="flex items-center">
            <Link to="/City">
                <button className="p-2 rounded">
                    <img src="src/components/image/back-icon.png" className="h-10 w-10"/>
                </button>
            </Link>
        </div>
        <div class="flex p-4 justify-center items-center w-full">
            <h1 class="text-3xl font-semibold mb-6 text-center">ค้นหาจากรถยี่ห้อ Honda รุ่น City (2019)</h1>
        </div>
    </div>
        <div class="container mx-auto px-4">
        <p class="flex text-gray-900 text-2xl font-bold px-96 mb-6">หมวดหมู่</p>
        <div class="flex justify-center mb-3 space-x-4">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl">ทั้งหมด</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-7 rounded-xl ml-2">โช็ค</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl ml-2">ผ้าเบรค</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl ml-2">จานเบรค</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl ml-2">หัวเทียน</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl ml-2">ลูกปืน</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-7 rounded-xl ml-2">อื่นๆ</button>
        </div>
        <div class="grid lg:grid-cols-4 gap-4 m-10">
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-lg font-bold">รูปสินค้า 1</h2>
                <p class="text-gray-400 mb-3">รหัสสินค้า SKU-03753</p>
                <p class="text-cyan-400 mb-3">ผ้าเบรคหลัง HONDA CIVIC FC/FK 1.8/1.5 L ปี 2016-2017 (1 ชุด4 ชิ้น) GOOGAI SPIDER</p>
                <div class="flex items-center text-red-500">
                    <span>*</span><p class="text-gray-700 ml-1">2,500.00 บาท</p>
                </div>
                <button class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">เพิ่มไปยังตะกร้า</button>
            </div>
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-lg font-bold">รูปสินค้า 2</h2>
                <p class="text-gray-400 mb-3">รหัสสินค้า SKU-03745</p>
                <p class="text-cyan-400 mb-3">โช๊คอัพหลัง ฮอนด้าซีวิค เอฟซี CIVIC FC 1.8 L ปี 2016 ขึ้นไป (1 คู่) </p>
                <div class="flex items-center text-red-500">
                    <span>*</span><p class="text-gray-700 ml-1">3,200.00 บาท</p><p class="text-gray-700 ml-1 line-through text-xs">3,200.00 บาท</p>
                </div>
                <button class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">เพิ่มไปยังตะกร้า</button>
            </div>
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-lg font-bold">รูปสินค้า 3</h2>
                <p class="text-gray-400 mb-3">รหัสสินค้า SDU-03712</p>
                <p class="text-cyan-400 mb-3">ลูกปืนล้อหน้า HONDA CIVIC FC ปี 2016-2020 (1 ตัว) แท้</p>
                <div class="flex items-center text-red-500">
                    <span>*</span><p class="text-gray-700 ml-1">1,400.00 บาท</p>
                </div>
                <button class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">เพิ่มไปยังตะกร้า</button>
            </div>
            <div class="bg-white p-4 rounded shadow">
                <h2 class="text-lg font-bold">รูปสินค้า 4</h2>
                <p class="text-gray-400 mb-3">รหัสสินค้า SKU-03441</p>
                <p class="text-cyan-400 mb-3">ลูกปืนล้อหน้า HONDA CIVIC FC ปี 2016-2020 (1 ตัว) แท้</p>
                <div class="flex items-center text-red-500">
                    <span>*</span><p class="text-gray-700 ml-1">2,200.00 บาท</p><p class="text-gray-700 ml-1 line-through text-xs">2,500.00 บาท</p>
                </div>
                <button class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">เพิ่มไปยังตะกร้า</button>
            </div>
        </div>
    </div>
    <Footer />
    </>
}

export default City2019