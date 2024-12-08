import axios from "axios";
import React from "react";
function Notify()
{
    function testapi1()
    {
        const date = new Date().toLocaleString('th-TH')
        console.log("testapi1")
        //we need this to be automate
        axios.post('http://localhost:5000/api/linemessage1',
            {
                message: date
            }
        )
        .then((res) =>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return <>
    <div class ='flex flex-col justify-center items-center'>
    <h1 class="text-[1.5vw] mb-4 text-center pt-4">แจ้งเตือนผ่านไลน์</h1>
    <img src="/images/lineqr.png" className="w-64 mx-auto"></img>
    <button onClick={() => testapi1()} className="text-center rounded-full bg-green-400 text-[1vw] py-4 px-4 mt-4 ">test line</button>
    </div>
    
    </>
}

export default Notify