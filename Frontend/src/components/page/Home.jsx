import React from "react";
import "./Home.css"
import Navbar from "../Navbar.jsx"
import Footer from "../Footer.jsx"

function Home()
{
    return <>
    <div className="relative bg-orange-200 border-2 border-black">
        <Navbar />
        <div className="flex items-center justify-center m-auto">
            ฺ......
        </div>
        <div className="items-center justify-between flex px-[15%] ">
            <div>
                <div className="text-5xl">
                    วิชัยการยางVCKRacingShop
                </div>
                <div className="text-3xl mt-10">
                    รายละเอียด
                </div>
            </div>
            <div>
                <span><img src="src/components/image/vckimg.jpg" width="500" height="300"></img></span>
            </div>
        </div>
        <div className="items-center flex justify-center text-3xl mt-10 mb-5">
            บริการของเรา
        <br/>
        </div>
        <div className="items-center flex justify-center space-x-5 mb-10">
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