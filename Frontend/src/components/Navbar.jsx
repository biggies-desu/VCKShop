import React from "react";
import { NavLink } from "react-router-dom"

function Navbar() {
    return <>
        <nav id="navbar" className="bg-yellow-300 border-black border-0">
            <div id="nav-container" className="max-w-screen-xl flex items-center justify-between mx-auto py-1 px-4">
                <div id="logo" className="flex items-center">
                    <NavLink to="/">
                            <img src="images/LogoNavbar.png" className="h-8" alt="Logo" />
                    </NavLink>
                    </div>
                    <div className="hidden md:flex">
                    <ul className="flex font-medium md:space-x-8">
                        <li className="py-4 px-2 text-gray-700 hover:text-black">
                            <NavLink to="/">หน้าแรก</NavLink>
                        </li>
                        <li className="py-4 px-2 text-gray-700 hover:text-black">
                            <NavLink to="/estimateprice">ประเมินราคาและจองเข้าใช้</NavLink>
                        </li>
                        <li className="py-4 px-2 text-gray-700 hover:text-black">
                            <NavLink to="/aboutus">เกี่ยวกับเรา</NavLink>
                        </li>
                        <li className="py-4 px-2 text-gray-700 hover:text-black">
                            <NavLink to="/login">เข้าสู่ระบบ</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
}

export default Navbar