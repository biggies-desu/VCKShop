import React from "react";
import Navbar from "../../../Navbar.jsx";
import Footer from "../../../Footer.jsx";
import { Link } from "react-router-dom";

function City() {
    return <>
    <Navbar />
    <div class="flex p-4">
        <div class="flex items-center">
            <Link to="/estimateprice">
                <button className="p-2 rounded">
                    <img src="src/components/image/back-icon.png" className="h-10 w-10"/>
                </button>
            </Link>
        </div>
        <div class="flex p-4 justify-center items-center w-full">
            <h1 class="text-3xl font-semibold mb-6 text-center">ค้นหาจากรถยี่ห้อ Honda รุ่น City</h1>
        </div>
    </div>

    <div class="grid grid-cols-3 gap-4 p-4">
        <div class="flex justify-center items-center">
            <Link to="/City2024">
                <img src="src/components/image/City-2024.jpg" class="rounded-lg h-48 cursor-pointer" alt="รถยนต์ 1" />
            </Link>
        </div>
        <div class="flex justify-center items-center">
            <Link to="/City2019">
                <img src="src/components/image/City-2019.jpg" class="rounded-lg h-48 cursor-pointer" alt="รถยนต์ 1" />
            </Link>
        </div>
        <div class="flex justify-center items-center">
            <Link to="/City2014">
                <img src="src/components/image/City-2014.jpg" class="rounded-lg h-48 cursor-pointer" alt="รถยนต์ 1" />
            </Link>
        </div>
        <h2 class="text-2xl font-bold text-center mt-2">ปี : 2024</h2>
        <h2 class="text-2xl font-bold text-center mt-2">ปี : 2019</h2>
        <h2 class="text-2xl font-bold text-center mt-2">ปี : 2014</h2>
    </div>
    <Footer />
    </>
    
}

export default City;
