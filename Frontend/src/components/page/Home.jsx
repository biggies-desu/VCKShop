import React from "react";
import Navbar from "../Navbar.jsx"
import Footer from "../Footer.jsx"
import '../../index.css'

function Home()
{
    event.preventDefault()
    return <>
    <div className="relative bg-orange-200 border-2 border-black">
        <Navbar />
        <div className="flex items-center justify-center m-auto">
            ฺ......
        </div>
        <div className="items-center justify-between flex px-[15%] w-auto">
            <div>
                <div className="text-[2.5vw] kanit-regular">
                    วิชัยการยางVCKRacingShop
                </div>
                <div className="text-[1.5vw] mt-10">
                    รายละเอียด
                </div>
            </div>
            <div>
                <span><img src="src/components/image/vckimg.jpg" class="max-w-[400px] w-full h-auto"></img></span>
            </div>
        </div>
        <div className="items-center flex justify-center text-[2vw] mt-10 mb-5">
            บริการของเรา
        <br/>
        </div>
        <div className="items-center flex justify-center space-x-5 mb-10">
            <span><img src="src/components/image/gal-1.jpg" width="300" height="300"></img></span>
            <span><img src="src/components/image/gal-2.jpg" width="300" height="300"></img></span>
            <span><img src="src/components/image/gal-1.jpg" width="300" height="300"></img></span>
            <span><img src="src/components/image/gal-3.jpg" width="300" height="300"></img></span>
        </div>

    </div>
    <Footer />
    </>
}

export default Home