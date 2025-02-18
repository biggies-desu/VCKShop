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
    const [productimage, setproductimage] = useState(null);
    const [notify, setnotify] = useState(false)
    const [notify_amount, setnotify_amount] = useState()

    const [dropdowncategory, setdropdowncategory] = useState([])
    const [dropdownbrand, setdropdownbrand] = useState([])

    const [dropdownmodel, setdropdownmodel] = useState([])
    const [dropdownyear, setdropdownyear] = useState([])

    const [isModalSuccess, setisModalSuccess] = useState(false);

    //getting data suchas dropdown for category
    useEffect(() => {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdowncategory`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdownbrand`)
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
        axios.post(`${import.meta.env.VITE_API_URL}/getdropdownmodel`,
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
        axios.post(`${import.meta.env.VITE_API_URL}/getdropdownyear`,
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

    function confirmtoadd(event) {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('productname', productname);
        formData.append('productID', productID);
        formData.append('productcatagory', productcatagory);
        formData.append('productamount', productamount);
        formData.append('productprice', productprice);
        formData.append('productbrand', productbrand);
        formData.append('productmodel', productmodel);
        formData.append('productyear', productyear);
        formData.append('productdescription', productdescription);
        formData.append('notify', notify)
        formData.append('notify_amount', notify_amount)
    
        if (productimage) {
            formData.append('productimage', productimage);
        }
    
        axios.post(`${import.meta.env.VITE_API_URL}/addproduct`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            console.log('Upload success:', response.data);
            setisModalSuccess(true);
        })
        .catch((error) => {
            console.error('Upload failed:', error);
        });
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setproductimage(file); // บันทึกไฟล์ที่เลือกลงใน state
            console.log("Selected file:", file);
        } else {
            console.log("No file selected");
        }
        console.log("Event:", e);
        console.log("File:", e.target.files[0]);
    };

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
                    <input value={productamount} type="number" id="add_amount" min="0" onChange={e => setproductamount(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="จำนวน" required/>
                </div>
                <div class='flex flex-col'>
                    <div class='mb-2'>ราคาต่อหน่วย</div>
                    <input value={productprice} type="number" id="add_price" min="0" onChange={e => setproductprice(e.target.value)} class="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ราคาต่อหน่วย" required/>
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
        
        <div class='flex flex-row mx-4 space-x-2'>
            <div class='flex text-[1.2vw] px-2 '>
                <input checked={notify} type="checkbox" id="notify" onChange={e => {setnotify(e.target.checked)}} placeholder="แจ้งเตือนผ่านไลน์" />
                <div class='px-2'>แจ้งเตือนผ่านไลน์</div>
                {notify && (<>
                <div className='flex text-[1.2vw] px-2'>
                    <div className='px-2'>จำนวนอะไหล่ที่ต้องการแจ้งเตือน</div>
                    <input value={notify_amount} className='class="block p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100"' type="number" id="notify_amount" min="0" defaultValue={0} onChange={e => setnotify_amount(e.target.value)} placeholder="จำนวน" />
                    <p className="text-red-500 text-sm mx-2 mt-2">หากตั้งไว้เป็น 0 = แจ้งเตือนตลอด, หากเป็นค่าอื่นจะแจ้งเตือนหากน้อยกว่าจำนวนที่ตั้งไว้</p>
                </div>   
                </>
            )}
            </div>
        </div>


        <div class='flex flex-row mx-4 space-x-2 py-2'>
            <div class='flex flex-col w-full text-[1.2vw] px-2'>
                <div class='mb-2'>คำอธิบาย</div>
                <input value={productdescription} type="text" id="image" onChange={e =>  setproductdescription(e.target.value)} class="block w-full p-6 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
        </div>

        <div class='flex flex-col w-full text-[1.2vw] px-2'>
        <div class='mb-2'>รูปภาพ</div>
            <input type="file" id="image" accept="image/*" onChange={(e) => {const file = e.target.files[0];
            if (file) {
                setproductimage(file); // เก็บไฟล์ลงใน state
                console.log("Selected file:", file.name);
                console.log(e.target.files)
            }
        }} 
        className="block w-full p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" 
    />
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