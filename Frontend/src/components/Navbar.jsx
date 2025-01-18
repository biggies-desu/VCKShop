import React from "react";
import { NavLink } from "react-router-dom"
import '../index.css'

function Navbar() {
    return <>
    <nav className="bg-gray-800">
    <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Left Section: Logo */}
        <div id="logo" className="flex items-center">
            <NavLink to="/" className="flex items-center">
                <img src="images/LogoNavbar.png" className="h-8 mr-2" alt="Logo" />
            </NavLink>
        </div>

        {/* Right Section: Navigation Links */}
        <div className="flex space-x-8">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
                }
            >
                หน้าแรก
            </NavLink>
            <NavLink
                to="/estimateprice"
                className={({ isActive }) =>
                    isActive ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
                }
            >
                ประเมินราคาและจองเข้าใช้
            </NavLink>
            <NavLink
                to="/aboutus"
                className={({ isActive }) =>
                    isActive ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
                }
            >
                เกี่ยวกับเรา
            </NavLink>
            <NavLink
                to="/login"
                className={({ isActive }) =>
                    isActive ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
                }
            >
                เข้าสู่ระบบ
            </NavLink>
        </div>
    </div>
</nav>
    </>
}

export default Navbar