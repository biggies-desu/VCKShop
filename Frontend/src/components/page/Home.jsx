import React, { useState } from "react";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import { Link } from "react-router-dom";
import "../../index.css";

function Home() {
  return (
    <>
      <Navbar />
        <div className="bg-cover bg-center text-white py-80 md:py-96 kanit-bold border-4 border-black" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("${import.meta.env.VITE_IMAGE_BASE_URL}/vckimg.jpg")` }}>
          <div className="container mx-auto text-center">
            <h1 className="max-md:text-xl md:text-8xl font-bold mb-10">วิชัยการยาง VCKRacingShop</h1>
            <p className="max-md:text-sm md:text-2xl mb-8 bg-animate w-1/2 text-center justify-center container">"สินค้าทุกชิ้นเป็นของใหม่ และรับประกันคุณภาพ ของแท้ 100%"</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center rounded-lg max-md:space-y-4">
            <Link to="/queue" id="queue" className="mx-4 px-4 py-3 bg-slate-700 text-gray-200 font-semibold rounded-2xl hover:bg-gray-800 md:text-xl">
              จองเข้าใช้บริการ
            </Link>
            <Link to="/estimateprice" id="estimateprice" className="mx-4 px-4 py-3 bg-slate-700 text-gray-200 font-semibold rounded-2xl hover:bg-gray-800 md:text-xl">
              ประเมินราคา
            </Link>
          </div>
        </div>
        <div className="py-5 md:py-16 kanit-bold bg-orange-100">
          <div className="container mx-auto  text-center grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div className="bg-white p-6 max-md:border-2 border-black rounded-2xl shadow-lg md:-translate-y-24 transform hover:-translate-y-2 md:hover:-translate-y-28 transition-transform duration-300">
              <div className="space-y-3 mt-4">
                <a className="text-xl no-underline font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">บริการซ่อมแซมรถยนต์</a>
                <ul className="space-y-2">
                  <li>
                    <a className="text-lg no-underline text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมเครื่องยนต์</a>
                  </li>
                  <li>
                    <a className="text-lg no-underline text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมช่วงล่าง</a>
                  </li>
                  <li>
                    <a className="text-lg no-underline text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมระบบไฟฟ้ารถยนต์</a>
                  </li>
                  <li>
                    <a className="text-lg no-underline text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมระบบเบรก</a>
                  </li>
                  <li>
                    <a className="text-lg no-underline text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมแซมและตรวจสอบระบบไฟฟ้าภายใน</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="bg-white p-6 max-md:border-2 border-black rounded-2xl shadow-lg md:-translate-y-24 transform hover:-translate-y-2 md:hover:-translate-y-28 transition-transform duration-300">
              <div className="space-y-3 mt-4">
                <a className="text-xl no-underline font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">บริการการตรวจเช็คและบำรุงรักษา</a>
                <ul className="space-y-2">
                  <li>
                    <a className="text-lg text-gray-700 no-underline hover:text-blue-500 transition-colors duration-300 kanit-light">เปลี่ยนน้ำมันเครื่อง</a>
                  </li>
                  <li>
                    <a className="text-lg text-gray-700 no-underline hover:text-blue-500 transition-colors duration-300 kanit-light">ตรวจเช็คระบบเบรกและช่วงล่าง</a>
                  </li>
                  <li>
                    <a className="text-lg text-gray-700 no-underline hover:text-blue-500 transition-colors duration-300 kanit-light">ตรวจสอบระบบไฟฟ้า</a>
                  </li>
                  <li>
                    <a className="text-lg text-gray-700 no-underline hover:text-blue-500 transition-colors duration-300 kanit-light">เปลี่ยนไส้กรองอากาศและน้ำมัน</a>
                  </li>
                  <li>
                    <a className="text-lg text-gray-700 no-underline hover:text-blue-500 transition-colors duration-300 kanit-light">ตรวจเช็คและเปลี่ยนสายพาน</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-6 max-md:border-2 border-black rounded-2xl shadow-lg md:-translate-y-24 transform hover:-translate-y-2 md:hover:-translate-y-28 transition-transform duration-300">
              <div className="space-y-3 mt-4">
                <a className="text-xl font-semibold no-underline text-gray-800 hover:text-blue-600 transition-colors duration-300">บริการแต่งรถยนต์</a>
                <ul className="space-y-2">
                  <li>
                    <a className="text-lg text-gray-700 no-underline hover:text-blue-500 transition-colors duration-300 kanit-light">แต่งภายนอก (Body Kits)</a>
                  </li>
                  <li>
                    <a className="text-lg text-gray-700 no-underline hover:text-blue-500 transition-colors duration-300 kanit-light">เปลี่ยนล้อและยาง</a>
                  </li>
                  <li>
                    <a className="text-lg text-gray-700 no-underline hover:text-blue-500 transition-colors duration-300 kanit-light">ติดตั้งไฟ LED และชุดแต่ง</a>
                  </li>
                  <li>
                    <a className="text-lg text-gray-700 no-underline hover:text-blue-500 transition-colors duration-300 kanit-light">ติดตั้งกันชนหน้าหลัง</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <section className="container max-md:py-11 text-center">
            <h2 className="text-xl md:text-3xl font-extrabold mb-8">อัพเดทผลงานและบริการล่าสุด</h2>
            <p className="md:text-lg mb-8">คำแนะนำจากทีมงานมืออาชีพในการเพิ่มประสิทธิภาพการขับขี่ของคุณ</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="border-2 border-gray-800 p-1 bg-white rounded-lg shadow-lg overflow-hidden">
                <img className="w-full h-full object-cover" src={`${import.meta.env.VITE_IMAGE_BASE_URL}/Card_1.jpg`} alt="Blog 1"/>
                <div className="p-6"></div>
              </div>
              <div className="border-2 border-gray-800 p-1 bg-white rounded-lg shadow-lg overflow-hidden">
                <img className="w-full h-full object-cover" src={`${import.meta.env.VITE_IMAGE_BASE_URL}/Card_2.jpg`} alt="Blog 2"/>
                <div className="p-6"></div>
              </div>
              <div className="border-2 border-gray-800 p-1  bg-white rounded-lg shadow-lg overflow-hidden">
                <img className="w-full h-full object-cover" src={`${import.meta.env.VITE_IMAGE_BASE_URL}/Card_3.jpg`} alt="Blog 3"/>
                <div className="p-6"></div>
              </div>
            </div>
          </section>
          <section className="container max-md:py-5 py-16 text-center md:mb-16">
            <h2 className="text-xl md:text-3xl font-extrabold mb-8">บริการใหม่จากอู่ซ่อมวิชัยการยาง</h2>
            <p className="md:text-lg mb-8">เคล็ดลับการซ่อมแซมและปรับแต่งรถยนต์อย่างมืออาชีพ เพื่อเพิ่มประสิทธิภาพในการขับขี่และยืดอายุการใช้งานของรถยนต์ของคุณ</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <img className="w-full h-48 object-cover" src={`${import.meta.env.VITE_IMAGE_BASE_URL}/Card_4.jpg`} alt="Blog 1"/>
                <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
                  <p className="text-white font-bold text-xl">อะไหล่เต็มคลัง</p>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-sm">
                  <p>Mar 16, 2020 - อะไหล่ยนต์</p>
                </div>
              </div>
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <img className="w-full h-48 object-cover" src={`${import.meta.env.VITE_IMAGE_BASE_URL}/Card_5.jpg`} alt="Blog 2"/>
                <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
                  <p className="text-white font-bold text-xl">ของแต่งเพรียบพร้อม</p>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-sm">
                  <p>Mar 10, 2020 - ของแต่ง</p>
                </div>
              </div>
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <img className="w-full h-48 object-cover" src={`${import.meta.env.VITE_IMAGE_BASE_URL}/Card_6.jpg`} alt="Blog 3"/>
                <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
                  <p className="text-white font-bold text-xl">มีล้อหลากหลาย</p>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-sm">
                  <p>Feb 12, 2020 - ล้อแม็ก</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      <Footer />
    </>
  );
}

export default Home;