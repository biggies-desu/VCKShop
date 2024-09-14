import React from "react";
import "./Home.css"
import Navbar from "../Navbar.jsx"
import "../Navbar.css"
import Footer from "../Footer.jsx"
import "../Footer.css"

function Home()
{
    return <>
    <div className="home">
        <Navbar />
        <div className="banner">
            ฺBanner เด่วค่อยทำ
        </div>
        <div className="home_container">
            <div>
                <div className="title">
                    วิชัยการยางVCKRacingShop
                </div>
                <div className="description">
                    รายละเอียด
                </div>
            </div>
            <div>
                แปะรูป
            </div>
        </div>
        <div className="ourservice">
            บริการของเรา
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            
        </div>
    </div>
    <Footer />
    </>
}

export default Home