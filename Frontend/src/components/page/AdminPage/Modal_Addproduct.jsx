import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function Modal_Addproduct({ setisaddproductmodal }) {
    const [productname, setproductname] = useState()

    const [productID, setproductID] = useState()

    const [productcatagory, setproductcatagory] = useState()
    const [productamount, setproductamount] = useState()
    const [productprice, setproductprice] = useState()

    const [productdescription, setproductdescription] = useState()
    const [productimage, setproductimage] = useState(null);
    const [notify, setnotify] = useState(false)
    const [notify_amount, setnotify_amount] = useState()

    const [dropdowncategory, setdropdowncategory] = useState([])
    const [dropdownbrand, setdropdownbrand] = useState([])

    const [dropdownmodel, setdropdownmodel] = useState([])
    const [dropdownyear, setdropdownyear] = useState([])

    const [isModalSuccess, setisModalSuccess] = useState(false);

    const [selectedbrand, setselectedbrand] = useState([]);
    const [selectedmodel, setselectedmodel] = useState([]);
    const [selectedyear, setselectedyear] = useState([]);

    const [isActiveBrand, setIsActiveBrand] = useState(false);
    const [isActiveModel, setIsActiveModel] = useState(false);
    const [isActiveYear, setIsActiveYear] = useState(false);

    const toggleActiveBrand = () => setIsActiveBrand(!isActiveBrand);
    const toggleActiveModel = () => setIsActiveModel(!isActiveModel);
    const toggleActiveYear = () => setIsActiveYear(!isActiveYear);

    //getting data suchas dropdown for category
    useEffect(() => {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdowncategory`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdownbrand`)
        ])

            .then((res) => {
                setdropdowncategory(res[0].data) // index 0 data from api/getdropdowncategory
                setdropdownbrand(res[1].data || []) // index 1 data from api/getdropdownbrand
            })
            .catch((err) => {
                console.log(err);
            });
        ;
    }, []);

    //run this if productbrand got update
    useEffect(() => {
        if (selectedbrand.length > 0) { // Only call if productbrand is set
            //console.log(brand);
            axios.post(`${import.meta.env.VITE_API_URL}/getdropdownmodel`,
                {
                    brandname: selectedbrand
                }
            )
                .then((res) => {
                    console.log(res.data)
                    setdropdownmodel(res.data)
                })
                .catch(error => {
                    console.log(error)
                });
        }
        else
        {
            setdropdownmodel([])
        }
    }, [selectedbrand]);

    //run this if productyear got update
    useEffect(() => {
        if (selectedbrand.length > 0 && selectedmodel.length > 0) { // Only call if productbrand is set
            //console.log(brand);
            axios.post(`${import.meta.env.VITE_API_URL}/getdropdownyear`,
                {
                    modelname: selectedmodel
                }
            )
                .then((res) => {
                    setdropdownyear(res.data)
                })
                .catch(error => {
                    console.log(error)
                });
        }
        else
        {
            setdropdownyear([])
        }
    }, [selectedmodel]);

    const toggleBrand = (brand) => {
        setselectedbrand((prev) =>
          prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
        console.log(selectedbrand)
    };

    const toggleModel = (brand) => {
        setselectedmodel((prev) =>
          prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
        console.log(selectedmodel)
    };

    const toggleYear = (brand) => {
        setselectedyear((prev) =>
          prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
        console.log(selectedyear)
    };
    
    const selectAll = (type, dropdown, selected, setSelected) => {
        const allItems = dropdown.map(item => 
            type === "brand" ? item.SparePart_Brand_Name :
            type === "model" ? item.SparePart_Model_Name :
            item.SparePart_Model_ID
        );
        
        const newSelection = selected.length === allItems.length ? [] : allItems;
        setSelected(newSelection);
    };

    const selectAllBrands = () => selectAll("brand", dropdownbrand, selectedbrand, setselectedbrand);
    const selectAllModels = () => selectAll("model", dropdownmodel, selectedmodel, setselectedmodel);
    const selectAllYears = () => selectAll("year", dropdownyear, selectedyear, setselectedyear);

    function confirmtoadd(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('productname', productname);
        formData.append('productID', productID);
        formData.append('productcatagory', productcatagory);
        formData.append('productamount', productamount);
        formData.append('productprice', productprice);
        formData.append('productbrand', selectedbrand);
        formData.append('productmodel', selectedmodel);
        formData.append('productmodelid', selectedyear); //this is get from year
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

    function closeSuccessPopup() {
        setisModalSuccess(false);
        setisaddproductmodal(false); // Close add product modal
        window.location.reload(); // Refresh the page
    }


    return <>
        <div class='flex flex-col text-nowrap md:p-6 bg-white shadow-md rounded-lg'>
            <div class='kanit-bold flex flex-row justify-between items-center bg-white p-4 shadow-md rounded-lg'>
                <button className="p-2 rounded" onClick={() => setisaddproductmodal(false)}>
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
                </svg>
                </button>
                <h1 className="max-md:text-lg md:text-4xl text-gray-700">เพิ่มรายการสินค้า</h1>
                <h1></h1>
            </div>

            <div class='flex flex-row mx-4 space-x-2 py-2 md:py-5 my-6'>
                <div class='flex flex-col w-full md:text-2xl px-2'>
                    <div class='mb-2 kanit-medium'>ชื่อสินค้า</div>
                    <input value={productname} type="text" id="add_name" onChange={e => setproductname(e.target.value)} class="block w-full p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ชื่อสินค้า" required />
                </div>
            </div>

            <div class='md:flex flex-row mx-4 space-x-2 max-md:py-2 '>
                <div class='flex flex-col w-full md:text-2xl px-2'>
                    <div class='mb-2 kanit-medium'>รหัสสินค้า(ถ้ามี)</div>
                    <input value={productID} type="text" id="add_productID" onChange={e => setproductID(e.target.value)} class="block w-full p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="รหัสสินค้า" />
                </div>
                <div className="md:flex flex-row w-full md:text-2xl md:mx-4 md:space-x-2 max-md:py-2">
                    <div class='flex flex-col xl:px-3'>
                        <div class='mb-2 kanit-medium'>ประเภทอะไหล่/ชิ้นส่วน</div>
                        <select value={productcatagory} type="text" id="add_catagory" onChange={e => setproductcatagory(e.target.value)} class="block max-md:p-2 md:p-3 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ประเภทสินค้า">
                            <option selected value='' disabled>ประเภท</option>
                            {dropdowncategory && dropdowncategory.length > 0 && dropdowncategory.map((item, index) => (
                                <option key={index} value={item.Category_Name}>
                                    {item.Category_Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div class='flex flex-col max-md:py-2 xl:px-3'>
                        <div class='mb-2 kanit-medium'>จำนวน</div>
                        <input value={productamount} type="number" id="add_amount" min="0" onChange={e => setproductamount(e.target.value)} class="block w-full p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="จำนวน" required />
                    </div>
                    <div class='flex flex-col max-md:py-2'>
                        <div class='mb-2 kanit-medium'>ราคาต่อหน่วย</div>
                        <input value={productprice} type="number" id="add_price" min="0" onChange={e => setproductprice(e.target.value)} class="block w-full p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ราคาต่อหน่วย" required />
                    </div>
                </div>
            </div>
            <div className="max-w-fit p-6 space-y-4 mx-2"> {/*bg-white rounded-xl shadow-md */}
                <h2 className="md:text-2xl text-gray-800 kanit-medium">เลือกยี่ห้อและรุ่นรถ</h2>

                <div className="grid xl:grid-cols-3 xl:gap-6 kanit-medium">
                    <div className="max-w-3xl mx-auto md:py-2">
                        <h2 className="md:text-2xl text-gray-800 mb-4">ยี่ห้อรถ</h2>
                        <button onClick={() => {toggleActiveBrand();selectAllBrands();}} className={isActiveBrand  ? "mb-3 px-4 py-2 bg-blue-800 text-white rounded-lg hover:scale-105" : "mb-3 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 hover:scale-105"}>
                            {selectedbrand.length === dropdownbrand.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
                        </button>
                        <div className="flex flex-wrap gap-3">
                            {dropdownbrand?.map((item) => (
                                <button key={item.SparePart_Brand_ID} onClick={() => toggleBrand(item.SparePart_Brand_Name)} className={`px-4 py-2 rounded-full border ${selectedbrand.includes(item.SparePart_Brand_Name)? "bg-blue-500 text-white border-blue-500": "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-200"} transition duration-300`}>
                                    {item.SparePart_Brand_Name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="max-w-3xl md:mx-auto md:p-6">
                        {dropdownmodel?.length > 0 && (
                            <div>
                                <h2 className="md:text-2xl text-gray-800 mb-4">รุ่นรถ</h2>
                                <button onClick={() => {toggleActiveModel();selectAllModels();}} className={isActiveModel  ? "mb-3 px-4 py-2 bg-blue-800 text-white rounded-lg hover:scale-105" : "mb-3 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 hover:scale-105"}>
                                    {selectedmodel.length === dropdownmodel.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
                                </button>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-3">
                            {dropdownmodel?.map((item) => (
                                <button key={item.SparePart_Model_Name} onClick={() => toggleModel(item.SparePart_Model_Name)} className={`px-4 py-2 rounded-full border ${selectedmodel.includes(item.SparePart_Model_Name)? "bg-blue-500 text-white border-blue-500": "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-200"} transition duration-300`}>
                                    {item.SparePart_Brand_Name} {item.SparePart_Model_Name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="max-w-3xl xl:mx-auto md:p-6">
                        {dropdownyear?.length > 0 && (
                            <div>
                                <h2 className="md:text-2xl text-gray-800 mb-4">ปีรถ</h2>
                                <button onClick={() => {toggleActiveYear();selectAllYears();}} className={isActiveYear  ? "mb-3 px-4 py-2 bg-blue-800 text-white rounded-lg hover:scale-105" : "mb-3 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 hover:scale-105"}>
                                    {selectedyear.length === dropdownyear.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
                                </button>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-3">
                            {dropdownyear?.map((item) => (
                                <button key={item.SparePart_Model_ID} onClick={() => toggleYear(item.SparePart_Model_ID)} className={`px-4 py-2 rounded-full border ${selectedyear.includes(item.SparePart_Model_ID) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-200"} transition duration-300`}>
                                    {item.SparePart_Model_Name} {item.SparePart_Model_Year}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div class='flex flex-row mx-4 space-x-2'>
                <div class='md:flex md:text-2xl px-2 kanit-medium'>
                    <input checked={notify} type="checkbox" id="notify" onChange={e => { setnotify(e.target.checked) }} placeholder="แจ้งเตือนผ่านไลน์" />
                    <div class='px-2'>แจ้งเตือนผ่านไลน์</div>
                    {notify && (<>
                        <div className='xl:flex md:text-2xl md:px-2'>
                            <div className='px-2 max-md:py-3'>จำนวนอะไหล่ที่ต้องการแจ้งเตือน</div>
                            <input value={notify_amount} className='class="block p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-100"' type="number" id="notify_amount" min="0" defaultValue={0} onChange={e => setnotify_amount(e.target.value)} placeholder="จำนวน" />
                            <div className="2xl:flex py-3">
                                <p className="text-red-500 text-sm mx-2 mt-2">หากตั้งไว้เป็น 0 = แจ้งเตือนตลอด,</p>
                                <p className="text-red-500 text-sm mx-2 mt-2">หากเป็นค่าอื่นจะแจ้งเตือนหากน้อยกว่าจำนวนที่ตั้งไว้</p>
                            </div>
                        </div>
                    </>
                    )}
                </div>
            </div>


            <div class='flex flex-row mx-4 space-x-2 py-2'>
                <div class='flex flex-col w-full md:text-2xl px-2'>
                    <div class='mb-2 kanit-medium'>คำอธิบาย</div>
                    <input value={productdescription} type="text" id="image" onChange={e => setproductdescription(e.target.value)} class="block w-full p-6 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-100" />
                </div>
            </div>
            <div class='flex flex-row mx-4 space-x-2 py-2'>
                <div class='flex flex-col w-full md:text-2xl px-2'>
                    <div class='mb-2 kanit-medium'>รูปภาพ</div>
                    <input type="file" id="image" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setproductimage(file); // เก็บไฟล์ลงใน state
                            console.log("Selected file:", file.name);
                            console.log(e.target.files)
                        }
                    }}
                        className="block w-full p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-100"
                    />
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
                    <h2 className="md:text-2xl mb-4">เพิ่มสินค้าเสร็จสิ้น</h2>
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
