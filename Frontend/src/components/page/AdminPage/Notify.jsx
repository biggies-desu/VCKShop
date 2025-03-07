import React from "react";
function Notify()
{
    return <>
    <div className="p-6 bg-gray-100 min-h-screen">
        <div className='kanit-bold flex flex-row justify-center items-center bg-white p-4 shadow-md rounded-lg'>
            <h1 className="max-md:text-lg md:text-4xl text-gray-700">แจ้งเตือนผ่านไลน์</h1>
        </div>
        <div className="mt-6 flex justify-center">
        <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/lineqr.png`}  className="w-64 mx-auto"></img>
        </div>
    </div>
    </>
}

export default Notify