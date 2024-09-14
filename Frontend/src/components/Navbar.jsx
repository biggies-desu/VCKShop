import React from "react";
import "../components/Navbar.css"
import { NavLink } from "react-router-dom"

function Navbar() {
    return <>
    <nav className="navbar">
    <div className="container">
        <div> 
            <a href="/"><img src="src/components/image/LogoNavbar.png" alt="VCK RacingShop" className="navlogo"></img></a>
        </div>
        <div className="nav-elements">
            <ul>
                <li id="home">
                    <NavLink to ="/">หน้าแรก</NavLink>
                </li>
                <li id="queue">
                    <NavLink to ="/queue">จองเข้าใช้อู่</NavLink>
                </li>
                <li id="calc">
                    <NavLink to ="/calc">ประเมินราคาอะไหล่พร้อมบริการ</NavLink>
                </li>
                <li id="aboutus">
                    <NavLink to ="/aboutus">เกื่ยวกับเรา</NavLink>
                </li>
                <li id="Login">
                    <NavLink to ="/login">เข้าสู่ระบบ</NavLink>
                </li>
            </ul>
        </div>
    </div>
    </nav>
    </>
}

export default Navbar