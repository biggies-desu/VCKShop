import axios from "axios";
import React, { useState } from "react";

function Modal_Addproduct({setisaddproductmodal})
{
    const [productname, setproductname] = useState()

    const [productID, setproductID] = useState()

    const [productcatagory, setproductcatagory] = useState()
    const [productamount, setproductamount] = useState()
    const [productprice, setproductprice] = useState()

    const [productbrand, setproductbrand] = useState()
    const [productmodel, setproductmodel] = useState()
    const [productyear, setproductyear] = useState()

    const [productdescription, setproductdescription] = useState()
    const [productimage, setproductimage] = useState()

    function confirmtoadd()
    {
        event.preventDefault()
        //for debuging
        console.log("confirmtoadd")
        console.log("name : ",productname)
        axios.post('http://localhost:5000/api/addproduct',
            {
                productname: productname,
                productID: productID,
                productcatagory: productcatagory,
                productamount: productamount,
                productprice: productprice,
                productbrand: productbrand,
                productmodel: productmodel,
                productyear: productyear,
                productdescription: productdescription,
                productimage: productimage
            }
        )
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
        
    }


    return <>
    <div class='flex flex-col text-nowrap'>
        <div class='flex flex-row justify-between'>
            <button className="text-[1.5vw] mb-4 pt-4 px-6 "onClick={() => setisaddproductmodal(false)}>กลับ</button>
            <h1 className="text-[1.5vw] mb-4 pt-4 px-4 ">เพิ่มรายการสินค้า</h1>
            <h1 className="text-[1.5vw] mb-4 pt-4 px-4 "></h1>
        </div>
        
        <div class='flex flex-row mx-4 space-x-2 py-2'>
            <div class='flex flex-col w-full text-[1.2vw] px-2'>
                <div class='mb-2'>ชื่อสินค้า</div>
                <input value={productname} type="text" id="add_name" onChange={e => setproductname(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ชื่อสินค้า" required/>
            </div>
        </div>

        <div class='flex flex-row mx-4 space-x-2 py-2'>
            <div class='flex flex-col w-full text-[1.2vw] px-2'>
                <div class='mb-2'>รหัสสินค้า(ถ้ามี)</div>
                <input value={productID} type="text" id="add_productID" onChange={e => setproductID(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="รหัสสินค้า" />
            </div>
            <div className="flex flex-row w-full text-[1.2vw] mx-4 space-x-2">
                <div class='flex flex-col'>
                    <div class='mb-2'>ประเภทอะไหล่/ชิ้นส่วน</div>
                    <input value={productcatagory} type="text" id="add_catagory" onChange={e => setproductcatagory(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ประเภทสินค้า" />
                </div>
                <div class='flex flex-col'>
                    <div class='mb-2'>จำนวน</div>
                    <input value={productamount} type="number" id="add_amount" onChange={e => setproductamount(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="จำนวน" required/>
                </div>
                <div class='flex flex-col'>
                    <div class='mb-2'>ราคาต่อหน่วย</div>
                    <input value={productprice} type="number" id="add_price" onChange={e => setproductprice(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ราคาต่อหน่วย" required/>
                </div>
            </div>
        </div>

        <div class='flex flex-row px-2 mx-4 space-x-2 py-2'>
            <div class='flex flex-col w-full text-[1.2vw]'>
                <div class='mb-2'>ยี่ห้อ</div>
                <input value={productbrand} type="text" id="brand" onChange={e => setproductbrand(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ยี่ห้อ" />
            </div>
            <div class='flex flex-col w-full text-[1.2vw]'>
                <div class='mb-2'>รุ่น</div>
                <input value={productmodel} type="text" id="model" onChange={e =>  setproductmodel(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="รุ่น" />
            </div>
            <div class='flex flex-col w-full text-[1.2vw]'>
                <div class='mb-2'>ปี</div>
                <input value={productyear} type="text" id="year" onChange={e =>  setproductyear(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ปี" />
            </div>
        </div>

        <div class='flex flex-row mx-4 space-x-2 py-2'>
            <div class='flex flex-col w-full text-[1.2vw] px-2'>
                <div class='mb-2'>คำอธิบาย</div>
                <input value={productdescription} type="text" id="image" onChange={e =>  setproductdescription(e.target.value)} class="block w-full p-6 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
        </div>

        <div class='flex flex-row mx-4 space-x-2 py-2'>
            <div class='flex flex-col w-full text-[1.2vw] px-2'>
                <div class='mb-2'>รูปภาพ</div>
                <input value={productimage} type="file" id="image" onChange={e =>  setproductimage(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="รูป" />
            </div>
        </div>
    </div>
    <div class='flex mx-4 my-4 justify-end'>
        <button type='button' id='confirm' onClick={() => confirmtoadd()} class='block rounded mx-2 px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-500 active:bg-green-700 focus:bg-green-500 whitespace-nowrap'>
            เพิ่มรายการสินค้า
        </button>
    </div>
    
    </>
}

export default Modal_Addproduct