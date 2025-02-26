import React, { useState } from "react";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import { Link } from "react-router-dom";
import "../../index.css";

function Home() {
  return (
    <>
      <Navbar />
      <div className="flex bg-orange-100 border-2 border-black w-full h-full md:w-full kanit-bold">
        <div className="flex items-center text-center lg:text-left md:px-12">
          <div>
            <h1 className="mt-14 text-3xl font-semibold text-yellow-400 text-stroke-black lg:text-8xl">วิชัยการยาง <br />
              <span>VCKRacingShop</span>
            </h1>
            <h2 className="mt-14 text-3xl font-semibold text-cyan-800 dark:text-white lg:text-2xl mb-14 bg-animate shadow-lg">"สินค้าทุกชิ้นเป็นของใหม่ และรับประกันคุณภาพ ของแท้ 100%"</h2>
            <div className="border-2 border-gray-800 rounded-lg p-4 grid-cols-3 flex justify-center space-x-6 shadow-lg">

            <div className="space-y-3 mt-4">
              <a href="#" className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">1. บริการซ่อมแซมรถยนต์</a>
              <ul className="space-y-2 pl-6">
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมเครื่องยนต์</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมช่วงล่าง</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมระบบไฟฟ้ารถยนต์</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมระบบเบรก</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ซ่อมแซมและตรวจสอบระบบไฟฟ้าภายใน</a>
                </li>
              </ul>
            </div>

            <div className="space-y-3 mt-4">
              <a href="#" className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">2. บริการการตรวจเช็คและบำรุงรักษา</a>
              <ul className="space-y-2 pl-6">
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">เปลี่ยนน้ำมันเครื่อง</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ตรวจเช็คระบบเบรกและช่วงล่าง</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ตรวจสอบระบบไฟฟ้า</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">เปลี่ยนไส้กรองอากาศและน้ำมัน</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ตรวจเช็คและเปลี่ยนสายพาน</a>
                </li>
              </ul>
            </div>

            {/* บริการแต่งรถยนต์ */}
            <div className="space-y-3 mt-4">
              <a href="#" className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">3. บริการแต่งรถยนต์</a>
              <ul className="space-y-2 pl-6">
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">แต่งภายนอก (Body Kits)</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">เปลี่ยนล้อและยาง</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ติดตั้งไฟ LED และชุดแต่ง</a>
                </li>
                <li>
                  <a href="#" className="text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300 kanit-light">ติดตั้งกันชนหน้าหลัง</a>
                </li>
              </ul>
              </div>
            </div>

            {/* ปุ่มจองและประเมินราคา */}
            <div className="flex justify-center mt-14 mb-14">
              <Link to="/queue" id="queue" className="px-4 py-3 bg-gray-900 text-gray-200 font-semibold rounded hover:bg-gray-800 text-xl mr-36">
                จองเข้าใช้บริการ
              </Link>
              <Link to="/estimateprice" id="estimateprice" className="mx-4 px-4 py-3 bg-gray-900 text-gray-200 font-semibold rounded hover:bg-gray-800 text-xl">
                ประเมินราคา
              </Link>
            </div>

            <section className="container mx-auto py-8 text-center">
              <h2 className="text-3xl font-extrabold mb-8">อัพเดทผลงานและบริการล่าสุด</h2>
              <p className="text-lg mb-8">คำแนะนำจากทีมงานมืออาชีพในการเพิ่มประสิทธิภาพการขับขี่ของคุณ</p>
    
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Card 1 */}
                <div className="border-2 border-gray-800 p-1 bg-white rounded-lg shadow-lg overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://scontent.fbkk29-6.fna.fbcdn.net/v/t39.30808-6/464913833_27443751995269678_7344376988014795065_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=v7zvUwkdAQIQ7kNvgEAvlUm&_nc_oc=AdgwFyDojSZOjplR3djzyri1YwZGq0MD_hdmz8XNCOt7XGSg6Dw2TD5xEs40LHyDAhI&_nc_zt=23&_nc_ht=scontent.fbkk29-6.fna&_nc_gid=ApX2oD7GKT-y8IUzt6ujtJs&oh=00_AYBjfA4xCcPB36aPyZ9JYWyKSr-L8FX-DtmYrz0fk1naww&oe=67C127A9" alt="Blog 1"/>
                  <div className="p-6"></div>
                </div>

                {/* Card 2 */}
                <div className="border-2 border-gray-800 p-1 bg-white rounded-lg shadow-lg overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://scontent.fbkk29-5.fna.fbcdn.net/v/t1.6435-9/36955971_2161257057279187_4788693882827177984_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=yBdEAuD8vkkQ7kNvgHpNDpE&_nc_oc=Adj1mM9obj5WegO8_4KCEUH4Ld4MZ1i7sq_mU9JWz8CXlI01U2c1vrDrhYvLomox3_I&_nc_zt=23&_nc_ht=scontent.fbkk29-5.fna&_nc_gid=AuS-TC-7zz3U0q-K67N4ir3&oh=00_AYBY_uAW2UscdRuoeEO9CekCiSHVpGElYP-p7F6hS-tz8Q&oe=67E2DF85" alt="Blog 2"/>
                  <div className="p-6"></div>
                </div>

                {/* Card 3 */}
                <div className="border-2 border-gray-800 p-1  bg-white rounded-lg shadow-lg overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://scontent.fbkk29-5.fna.fbcdn.net/v/t39.30808-6/465112299_27443751998603011_2902745570347255929_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=fMW0budsYfwQ7kNvgFDYgnL&_nc_oc=AdgsQiH_kzI-nrV7hvOsfurCsn7rp43uxGLS_H1lPBDlS_bODMmHm_BWAg7MrHAuvLA&_nc_zt=23&_nc_ht=scontent.fbkk29-5.fna&_nc_gid=ATKcYZCQL_lxLNor4TsFW83&oh=00_AYA3hlrvySoR3fbl-ZHEpE_jRd9GDkiHzooYgIRbC7TLtA&oe=67C132AC" alt="Blog 3"/>
                  <div className="p-6"></div>
                </div>
              </div>
            </section>

            <section className="container mx-auto py-16 text-center pb-32">
              <h2 className="text-3xl font-extrabold mb-8">บริการใหม่จากอู่ซ่อมวิชัยการยาง</h2>
              <p className="text-lg mb-8">เคล็ดลับการซ่อมแซมและปรับแต่งรถยนต์อย่างมืออาชีพ เพื่อเพิ่มประสิทธิภาพในการขับขี่และยืดอายุการใช้งานของรถยนต์ของคุณ</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              <img className="w-full h-48 object-cover" src="https://scontent.fbkk29-5.fna.fbcdn.net/v/t39.30808-6/463361165_27270683265909886_7201193132541554585_n.jpg?stp=dst-jpg_s417x417_tt6&_nc_cat=107&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=UiGDaRk_wq0Q7kNvgHwUvCG&_nc_oc=AdgUWFu_LvWaGgRQ6v0VjaWFWgtEoefbhSyEM7Z9z2wQfUDyyYxNDBDmfGDsvocexaA&_nc_zt=23&_nc_ht=scontent.fbkk29-5.fna&_nc_gid=AIePuEk4UOHuS0oTqwqCqK8&oh=00_AYDDEMkEsJ4VSkoywuhnukCIW4V7NHD7Z-xfyhVYUfcD1Q&oe=67C1384A" alt="Blog 1"/>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <p className="text-white font-bold text-xl">อะไหล่เต็มคลัง</p>
              </div>
              <div className="absolute bottom-4 left-4 text-white text-sm">
                <p>Mar 16, 2020 - อะไหล่ยนต์</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              <img className="w-full h-48 object-cover" src="https://scontent.fbkk29-8.fna.fbcdn.net/v/t39.30808-6/462872198_27225489020429311_3456429473128796550_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=geaYRheZApQQ7kNvgFQCN0h&_nc_oc=Adi_N2biQtusUu19e27ts4YS5pLE4gNKSbOvyE2JQRvNWS00J5dr2nInSBpzR5EZ6yU&_nc_zt=23&_nc_ht=scontent.fbkk29-8.fna&_nc_gid=A6bExQYp0XUItvg9dkO9iJK&oh=00_AYDSwM2rqlNjn-eldHuJni_pNsHtbf8cndwVUyr-44Nzzw&oe=67C135B1" alt="Blog 2"/>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <p className="text-white font-bold text-xl">ของแต่งเพรียบพร้อม</p>
              </div>
              <div className="absolute bottom-4 left-4 text-white text-sm">
                <p>Mar 10, 2020 - ของแต่ง</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              <img className="w-full h-48 object-cover" src="https://scontent.fbkk29-4.fna.fbcdn.net/v/t39.30808-6/462707784_27237159855928894_7768421180943786923_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=cf85f3&_nc_ohc=feax-4AnNY8Q7kNvgG6Ea1M&_nc_oc=AdhIhSk2jsLGWFXJ61K6gXjz8q6FN8cON3yx3zSMh5P1pynYbKhiJI6WcRVNiN97QYs&_nc_zt=23&_nc_ht=scontent.fbkk29-4.fna&_nc_gid=A357uAHw8PXR1p6eilufBt-&oh=00_AYBUhTVMR9T2NgmCARizuLCIaB8nFj-_d6Tst0BQLUMVXQ&oe=67C13D2A" alt="Blog 3"/>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <p className="text-white font-bold text-xl">มีล้อหลากหลาย</p>
              </div>
              <div className="absolute bottom-4 left-4 text-white text-sm">
                <p>Feb 12, 2020 - ล้อแม็ก</p>
              </div>
            </div>
            </div>
            </section>
          </div>
        </div>
        <div
          className="hidden lg:block lg:w-1/2"
          style={{clipPath: "polygon(10% 0, 100% 0%, 100% 100%, 5% 100%)",backgroundImage: "url('src/components/image/vckimg.jpg')",}}>
          <div className="h-full bg-black opacity-25"></div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
