import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import '../index.css'

function Navbar() {
    //get token
    const token = localStorage.getItem('token')
    let decodeuser = null
    //if have token -> get a data from token
    if(token)
    try {
        decodeuser = jwtDecode(token)
    }
    catch(error)
    {
        console.error("Invalid token", error);
    }

    const handlelogout = () => {
         localStorage.removeItem('token')
         useNavigate('/')
    }
   
    return <>
    <nav className="bg-gray-800">
    <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4">
        <div id="logo" className="flex items-center">
            <NavLink to="/" className="flex items-center">
                <img src="images/LogoNavbar.png" className="h-8 mr-2" alt="Logo" />
            </NavLink>
        </div>
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
            {token ? (
                <>
                <NavLink
                to="/profile"
                className={({ isActive }) =>
                    isActive ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
                }
                >
                สวัสดี, คุณ {decodeuser?.username}
                </NavLink>
                <NavLink
                onClick={handlelogout}
                className={({ isActive }) =>
                    isActive ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
                }
                >
                ออกจากระบบ
                </NavLink>
                </>
            ) : (
                <>
                <NavLink
                to="/login"
                className={({ isActive }) =>
                    isActive ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
                }
                >
                เข้าสู่ระบบ
                </NavLink>
                </>
            )}
            
            
            
        </div>
    </div>
</nav>
    </>
}

export default Navbar