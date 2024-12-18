import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

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

    const [dropdowncategory, setdropdowncategory] = useState([])
    const [dropdownbrand, setdropdownbrand] = useState([])

    const [dropdownmodel, setdropdownmodel] = useState([])
    const [dropdownyear, setdropdownyear] = useState([])

    const [isModalSuccess, setisModalSuccess] = useState(false);

    //getting data suchas dropdown for category
    useEffect(() => {
        axios.all([
            axios.get('http://localhost:5000/api/getdropdowncategory'),
            axios.get('http://localhost:5000/api/getdropdownbrand')
            ])
            
            .then((res) => {
                setdropdowncategory(res[0].data) // index 0 data from api/getdropdowncategory
                setdropdownbrand(res[1].data) // index 1 data from api/getdropdownbrand
            })
            .catch((err) => {
                console.log(err);
              });
        ;} ,[]);
    
    //run this if productbrand got update
    useEffect(() => {
        if (productbrand) { // Only call if productbrand is set
            getproductmodel();
            }
        }, [productbrand]);

    //run this if productmodel got update
    useEffect(() => {
        if (productmodel) { // Only call if productmodel is set
            getproductyear();
            }
        }, [productmodel]);

    function getproductmodel()
    {
        //console.log(brand);
        axios.post('http://localhost:5000/api/getdropdownmodel',
            {
                brandname: productbrand
            }
        )
        .then((res) => {
            setdropdownmodel(res.data)
        })
        .catch(error=>{
            console.log(error)
        });
    }

    function getproductyear()
    {
        //console.log(brand);
        axios.post('http://localhost:5000/api/getdropdownyear',
            {
                modelname: productmodel
            }
        )
        .then((res) => {
            setdropdownyear(res.data)
        })

        .catch(error=>{
            console.log(error)
        });
    }

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
                setisModalSuccess(true);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function closeSuccessPopup() {
        setisModalSuccess(false);
        setisaddproductmodal(false); // Close add product modal
        window.location.reload(); // Refresh the page
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
                    <select value={productcatagory} type="text" id="add_catagory" onChange={e => setproductcatagory(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ประเภทสินค้า">
                    <option selected value='' disabled>ประเภท</option>
                    {dropdowncategory && dropdowncategory.length > 0 && dropdowncategory.map((item, index) => (
                    <option key={index} value={item.Category_Name}>
                    {item.Category_Name}
                    </option>
                    ))}
                    </select>
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
                <select id="brand" value={productbrand} type="text"  onChange={e => {setproductbrand(e.target.value)}} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ยี่ห้อ">
                <option selected value='' disabled>เลือกยี่ห้อ</option>
                    {dropdownbrand && dropdownbrand.length > 0 && dropdownbrand.map((item, index) => (
                    <option key={index} value={item.SparePart_Brand_Name}>
                    {item.SparePart_Brand_Name}
                    </option>
                    ))}
                </select>
            </div>
            <div class='flex flex-col w-full text-[1.2vw]'>
                <div class='mb-2'>รุ่น</div>
                <select id="model" value={productmodel} type="text" onChange={e =>  setproductmodel(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="รุ่น">
                <option selected value='' disabled>เลือกรุ่น</option>
                    {dropdownmodel && dropdownmodel.length > 0 && dropdownmodel.map((item, index) => (
                    <option key={index} value={item.SparePart_Model_Name}>
                    {item.SparePart_Model_Name}
                    </option>
                    ))}
                    </select>
            </div>
            <div class='flex flex-col w-full text-[1.2vw]'>
                <div class='mb-2'>ปี</div>
                <select id="year" value={productyear} type="text" onChange={e =>  setproductyear(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ปี">
                    <option selected value='' disabled>เลือกปี</option>
                    {dropdownyear && dropdownyear.length > 0 && dropdownyear.map((item, index) => (
                    <option key={index} value={item.SparePart_Model_Year}>
                    {item.SparePart_Model_Year}
                    </option>
                    ))}
                </select>
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
        <button type='button' id='confirm' onClick={(event) => confirmtoadd(event)} class='block rounded mx-2 px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-500 active:bg-green-700 focus:bg-green-500 whitespace-nowrap'>
            เพิ่มรายการสินค้า
        </button>
    </div>

    {isModalSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-lg">
                <h2 className="text-[1.5vw] mb-4">เพิ่มสินค้าเสร็จสิ้น</h2>
                <div className="flex justify-center">
                    <button onClick={closeSuccessPopup} className="block rounded px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-500 active:bg-green-700 focus:bg-green-500">
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    )}
    
    </>
}

export default Modal_Addproduct