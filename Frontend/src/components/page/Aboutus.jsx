import React from "react";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

function AboutUs() {
  return (
    <>
    <Navbar />
        <section className="text-gray-600 body-font relative kanit-regular">
        <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          {/* แผนที่ */}
            <div className="lg:w-1/2 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden flex items-end justify-start relative">
                <iframe className="w-full h-[700px] object-cover" title="map"src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247794.69523511943!2d100.03556679453122!3d13.970976199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e28c0784a586bf%3A0x9f5688451e16e72c!2z4Lin4Li04LiK4Lix4Lii4LiB4Liy4Lij4Lii4Liy4LiHdmNrc2hvcOC4reC4ueC5iOC5g-C4q-C4oeC5iA!5e0!3m2!1sth!2sth!4v1721076138569!5m2!1sth!2sth" alt="Location Map"/>
            </div>
            <div className="bg-white flex flex-wrap py-6 rounded shadow-md absolute mt-96 ml-20 lg:w-1/4 md:w-1/4 sm:w-1/4">
                <div className="lg:w-1/2 px-6">
                    <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
                    <p className="mt-1">วิชัยการยางVCKShop ถนน บางกรวย - กรุงเทพ ตำบลไทรน้อย อำเภอไทรน้อย นนทบุรี 11150
                    </p>
                </div>
                <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                    <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                    <a className="text-indigo-500 leading-relaxed">viosza@hotmail.com</a>
                    <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                    <p className="leading-relaxed">083-012-3675</p>
                </div>
            </div>
            <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
                <h2 className="text-gray-900 mb-1 title-font font-bold text-3xl">ติดต่อเรา</h2>
                <form>
                    <div className="relative mb-4">
                        <label htmlFor="name" className="leading-7 text-sm text-gray-600">ชื่อ</label>
                        <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-600">อีเมลตอบกลับ</label>
                        <input type="email"id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="message" className="leading-7 text-sm text-gray-600">ข้อความ</label>
                        <textarea id="message" name="message" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                    </div>
                    <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                        ส่งอีเมลเลย!
                    </button>
                </form>
            </div>
        </div>
        </section>
    <Footer />
    </>
  );
}

export default AboutUs;
