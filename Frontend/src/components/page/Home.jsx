import React from "react";
import "./Home.css"
import Navbar from "../Navbar.jsx"
import Footer from "../Footer.jsx"

function Home()
{
    return <>
    <div className="home">
        <Navbar />
        <div className="banner">
            ฺBanner img
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
                <span><img src="src/components/image/vckimg.jpg" width="500" height="300"></img></span>
            </div>
        </div>
        <div className="ourservice">
            บริการของเรา
        <br/>
        
        </div>
        <div className="gal-img">
            <span><img src="src/components/image/gal-1.jpg" width="300" height="300"></img></span>
            <span><img src="src/components/image/gal-1.jpg" width="300" height="300"></img></span>
            <span><img src="src/components/image/gal-1.jpg" width="300" height="300"></img></span>
            <span><img src="src/components/image/gal-1.jpg" width="300" height="300"></img></span>
        </div>

    </div>
    <Footer />
    </>
}

export default Home