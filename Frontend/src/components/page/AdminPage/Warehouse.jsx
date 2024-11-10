import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal_Addproduct from "./Modal_Addproduct.jsx"

function Warehouse()
{
    const [search_query, setsearch_query] = useState("")
    const [apidata, setapidata] = useState([])

    const [isaddproductmodal, setisaddproductmodal] = useState(false)

    useEffect(() => {
        //fetch database as we open warehouse page
        axios.get('http://localhost:5000/api/allsparepart')
            .then((res) => {
                setapidata(res.data)
            })
            .catch((err) => {
                console.log(err);
              });
        ;} ,[]);
    

    function search()
    {
        event.preventDefault()
        console.log("search : ", search_query)
        axios.post('http://localhost:5000/api/searchquery', //post search query
            {
                search_query: search_query
            }
            )
        .then((res) => {    
            console.log(res)
            setapidata(res.data)
        })
        .catch(error=>{
            console.log(error)
        });
    }
    
    function addproduct()
    {
        event.preventDefault()
        console.log("addproduct")
        setisaddproductmodal(true)
    }

    

    function edititem()
    {
        event.preventDefault()
        console.log("edit")
    }

    function deleteitem()
    {
        event.preventDefault()
        console.log("deleteitem")
    }
    //todo
    //ต้องทำ backend? กับ filter make it propoly?

    //console.log(apidata)

    return <>
    {!isaddproductmodal && (<div class="flex flex-col justify-center">
        <h1 className="text-[1.5vw] mb-4 text-center pt-4">รายการสินค้าคงคลัง</h1>
        <form class="content-start mx-8 my-2">      
            <div class="flex space-x-4 content-center">
                <input value={search_query} type="search" id="search_query" class="block w-full p-4 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ค้นหาชื่อ/รหัสสินค้า" onChange={e => setsearch_query(e.target.value)}/>
                <button type='button' id="search" onClick={() => search()}><img src='/images/search-symbol.png' class='h-[2vw] w-[2vw]'></img></button>  
                <button type='button' id="add" onClick={() => addproduct()} class='block rounded mx-4 px-6 py-2 text-[1vw] bg-blue-400 hover:bg-blue-500 active:bg-blue-700 whitespace-nowrap'>เพิ่มสินค้า</button>
            </div>
        </form>
        <div class='flex mx-4 my-4'>
            <button type='button' id='filter_all' class='text-left block rounded mx-2 px-4 py-2 text-gray-700 bg-blue-400 hover:bg-blue-500 focus:bg-blue-500'>ทั้งหมด</button>
            <button type='button' id='filter_wheel' class='text-left block rounded mx-2 px-4 py-2 text-gray-700 bg-blue-400 hover:bg-blue-500 focus:bg-blue-500'>ล้อ</button>
            <button type='button' id='filter_bearings' class='text-left block rounded mx-2 px-4 py-2 text-gray-700 bg-blue-400 hover:bg-blue-500 focus:bg-blue-500'>ลูกปืน</button>
            <button type='button' id='filter_rubber' class='text-left block rounded mx-2 px-4 py-2 text-gray-700 bg-blue-400 hover:bg-blue-500 focus:bg-blue-500'>ยาง</button>
            <button type='button' id='filter_motor' class='text-left block rounded mx-2 px-4 py-2 text-gray-700 bg-blue-400 hover:bg-blue-500 focus:bg-blue-500'>เครื่องยนต์</button>
            <button type='button' id='filter_oil' class='text-left block rounded mx-2 px-4 py-2 text-gray-700 bg-blue-400 hover:bg-blue-500 focus:bg-blue-500'>น้ำมันเครื่อง</button>
            <button type='button' id='filter_etc' class='text-left block rounded mx-2 px-4 py-2 text-gray-700 bg-blue-400 hover:bg-blue-500 focus:bg-blue-500'>อื่น</button>
        </div>

        <div class='relative overflow-x-auto'>
        <table class="w-full text-left text-[1vw] table-auto">
            <thead>
                <tr>
                <th class='text-start px-6 py-2'>รูปภาพ</th>
                <th class='text-start px-3 py-2'>รหัสสินค้า</th>
                <th class='text-start px-3 py-2'>ชื่่อสินค้า</th>
                <th class='text-start px-6 py-2'>ประเภท</th>
                <th class='text-start px-6 py-2'>จำนวนคงเหลือ</th>
                <th class='text-start px-6 py-2'>ราคาต่อหน่วย</th>

                <th class='text-end px-6 py-2'>แก้ไข</th>
                <th class='text-end px-6 py-2'>ลบ</th>
                </tr>
            </thead>
            <tbody>
                {apidata.map((item, index) => (
                    <tr key={index}>
                        <td class='text-start px-3 py-2'>{item.SparePart_Image}</td>
                        <td class='text-start px-3 py-2'>{item.SparePart_ProductID}</td>
                        <td class='text-start px-3 py-2'>{item.SparePart_Name}</td>
                        <td class='text-start px-3 py-2'>{item.SparePart_Type}</td>
                        <td class='text-start px-3 py-2'>{item.SparePart_Amount}</td>
                        <td class='text-start px-3 py-2'>{item.SparePart_Price}</td>
                        
                        <td class='text-end px-2 py-2'onClick={() => edititem()}>
                            <button type = 'button'>
                                <svg class="mr-4 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                </svg>
                            </button>
                        </td>
                        <td class='text-end py-2' onClick={() => deleteitem()}>
                            <button type = 'button'>
                                <svg class="mr-4 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                </svg>
                            </button>  
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </div>)
    }
    {isaddproductmodal && (
            <Modal_Addproduct setisaddproductmodal={setisaddproductmodal}/>
        )}
    </>
}

export default Warehouse