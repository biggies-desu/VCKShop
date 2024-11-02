import React from "react";
import { NavLink } from "react-router-dom"

function Navbar() {
    return <>
    <nav id="navbar" class="bg-yellow-300 border-black border-0">
    <div id ="nav-container" class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-5">
        <div id="logo" class="flex items-center space-x-3 rtl:space-x-reverse">
            <NavLink to ="/">
                <img src="src/components/image/LogoNavbar.png" class="h-8" alt="Logo" />
            </NavLink>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
        <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-yellow-300 md:space-x-12 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
            <li id="home"class="block py-3 px-5 md:p-0 text-gray-500 bg-yellow-300 rounded hover:text-black text-xl" aria-current="page">
                <NavLink to ='/'>หน้าแรก</NavLink>
            </li>
            <li id="queue"class="block py-3 px-3 md:p-0 text-gray-500 bg-yellow-300 rounded hover:text-black text-xl" aria-current="page">
                <NavLink to ='/queue'>จองเข้าใช้บริการอู่</NavLink>
            </li>
            <li id="calc"class="block py-3 px-3 md:p-0 text-gray-500 bg-yellow-300 rounded hover:text-black text-xl" aria-current="page">
                <NavLink to ='/calc'>ประเมินราคาอะไหล่</NavLink>
            </li>
            <li id="aboutus"class="block py-3 px-3 md:p-0 text-gray-500 bg-yellow-300 rounded hover:text-black text-xl" aria-current="page">
                <NavLink to ='/aboutus'>เกี่ยวกับเรา</NavLink>
            </li>
            <li id="login"class="block py-3 px-3 md:p-0 text-gray-500 bg-yellow-300 rounded hover:text-black text-xl" aria-current="page">
                <NavLink to ='/login'>เข้าสู่ระบบ</NavLink>
            </li>
        </ul>
        </div>
    </div>
    </nav>
    </>
}

export default Navbar