import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal_Addproduct from "./Modal_Addproduct.jsx";
import { jwtDecode } from "jwt-decode";

function Warehouse() {
    const [search_query, setsearch_query] = useState("");
    const [apidata, setapidata] = useState([]);
    const [isaddproductmodal, setisaddproductmodal] = useState(false);
    const [isDeleteModalOpen, setisDeleteModalOpen] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState('')
    const [Detail, setDetail] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // จำนวนรายการที่จะแสดงในแต่ละหน้า
    const [totalPages, setTotalPages] = useState(1);
    const [dropdowncategory, setdropdowncategory] = useState([])
    const [category, setcategory] = useState('')

    const token = jwtDecode(localStorage.getItem('token'));

    const openModal = (id) => {
        setDeleteId(id);
        setisDeleteModalOpen(true);
    };
    
    const closeModal = () => {
        setDeleteId('');
        setisDeleteModalOpen(false);
    };

    function fetchdata(){
        console.log(token.user_id)
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/allsparepart`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdowncategory`),
        ])
        
            .then((res) => {
                setapidata(res[0].data)
                setdropdowncategory(res[1].data)
            })
            .catch((err) => {
                console.error("API Error:", err);
            });
    }

    useEffect(() => {
        fetchdata()
        console.log(apidata,dropdowncategory)
    }, []);

    useEffect(() => {
        if (apidata.length > 0) {
            const totalPages = Math.ceil(apidata.length / itemsPerPage);
            setTotalPages(totalPages); 
        }
    }, [apidata, itemsPerPage]);

    // ฟังก์ชันเพื่อแสดงผลข้อมูลในหน้าแต่ละหน้า
    const currentApidata = apidata.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // ฟังก์ชันการเปลี่ยนหน้า
    const changePage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };


    function search(event) {
        event.preventDefault();
        console.log("search : ", search_query);
        console.log("category : ", category);
        axios.post(`${import.meta.env.VITE_API_URL}/searchquery`, {
            search_query: search_query,
            category: category
        })
        .then((res) => {
            console.log(res);
            setapidata(res.data);
            setCurrentPage(1);
        })
        .catch(error => {
            console.log(error);
        });
    }

    function addproduct() {
        event.preventDefault();
        console.log("addproduct");
        setisaddproductmodal(true);
    }

    function openDetailModal(item) {
        setDetail(item);
        setIsDetailModalOpen(true);
    }

    function closeDetailModal() {
        setIsDetailModalOpen(false);
    }

    function openEditModal(item) {
        setEditProduct(item);  // Set the selected item to edit
        setIsEditModalOpen(true);  // Open the modal
    }

    function closeEditModal() {
        setIsEditModalOpen(false);  // Close the modal
    }

    function updateProduct() {
        axios.put(`${import.meta.env.VITE_API_URL}/updatesparepart/${editProduct.SparePart_ID}`, {
            productamount: editProduct.SparePart_Amount,
            productprice: editProduct.SparePart_Price,
            productnotify: editProduct.SparePart_Notify ? 1 : 0,
            productnotify_amount : editProduct.SparePart_NotifyAmount,
            user_id: token.user_id
        })
        .then((res) => {
            // Update the local state after the update is successful
            setapidata(apidata.map(item => item.SparePart_ID === editProduct.SparePart_ID ? editProduct : item));
            setIsEditModalOpen(false);  // Close the modal after update
        })
        .catch((err) => {
            console.log("Error updating product", err);
        });
    }

    function deleteitem(id) {
        openModal(id);
    }

    function confirmDelete() {
        console.log(token.user_id)
        axios.delete(`${import.meta.env.VITE_API_URL}/deletesparepart/${deleteId}?user_id=${token.user_id}`)
            .then((res) => {
                console.log(res)
                closeModal();
                fetchdata()
            })
            .catch(error => {
                console.log(error);
            });
    }

    function cancelDelete() {
        closeModal();
        fetchdata()
    }

    return <>
        {!isaddproductmodal && (
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className='kanit-bold flex flex-row justify-center bg-white p-4 shadow-md rounded-lg'>
                    <h1 className="max-md:text-lg md:text-4xl text-gray-700">คลังสินค้า</h1>
                </div>
                <form className="mt-4 p-4 bg-white shadow-md rounded-lg flex-row md:flex md:space-x-4 items-center">
                <div className="flex flex-col md:flex-row md:items-end md:gap-4 gap-2 w-full">
                <div className="w-full md:w-1/3">
                <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-1">หมวดหมู่สินค้า</label>
                <select id="ีcategory" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text" value={category} placeholder='ประเภทอะไหล่' onChange={(e) => setcategory(e.target.value)}>
                    <option selected value=''>ทั้งหมด</option>
                    {dropdowncategory.map((category, index) => (
                    <option key={index} value={category.Category_Name}>
                        {category.Category_Name}
                    </option>
                    ))}
                </select>
                </div>
                <div className="w-full md:w-2/3">
                <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-1">คำค้นหา</label>
                    <input value={search_query} type="search" id="search_query" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="ค้นหาชื่อ/รหัสสินค้า" onChange={e => setsearch_query(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { search(e); }}}/>
                </div>
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <button type="button" id="search" onClick={search} className="px-6 py-2 bg-blue-500 max-md:mt-2 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap">ค้นหา</button>
                    <button type="button" id="add" onClick={addproduct} className="px-6 py-2 bg-green-500 max-md:mt-2 text-white rounded-lg hover:bg-green-600 whitespace-nowrap">เพิ่มสินค้า</button>
                </div>
                </div>
                </form>
                <div className="relative overflow-auto shadow-md rounded-2xl mt-6">
                    <table className="w-full text-gray-700">
                        <thead className="text-sm md:text-base text-white bg-blue-500">
                            <tr>
                                <th className="px-4 py-3">รูปภาพ</th>
                                <th className="px-4 py-3">รหัสสินค้า</th>
                                <th className="px-4 py-3">ชื่อสินค้า</th>
                                <th className="px-4 py-3">ประเภท</th>
                                <th className="px-4 py-3">จำนวนคงเหลือ</th>
                                <th className="px-4 py-3">ราคาต่อหน่วย</th>
                                <th className="px-4 py-3">รายละเอียด</th>
                                <th className="px-4 py-3">แก้ไข</th>
                                <th className="px-4 py-3">ลบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentApidata.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                                    <td className="px-6 py-3">{item.SparePart_Image ? (
                                        <img src={`${import.meta.env.VITE_API_URL}/uploads/${item.SparePart_Image}`} alt={item.SparePart_Image}  className="h-[50px] w-[50px] object-cover rounded"/>) : ('ไม่มีรูป')}
                                    </td>
                                    <td className="px-6 py-3">{item.SparePart_ProductID}</td>
                                    <td className="px-6 py-3">{item.SparePart_Name}</td>
                                    <td className="px-6 py-3">{item.Category_Name}</td>
                                    <td className="px-6 py-3">{item.SparePart_Amount}</td>
                                    <td className="px-6 py-3 text-end">{Number(item.SparePart_Price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    <td className="px-6 py-3">
                                        <button className="px-6 py-3" type="button" onClick={() => openDetailModal(item)}>📄</button>
                                    </td>
                                    <td className="px-6 py-3">
                                        <button className="px-6 py-3" type="button" onClick={() => openEditModal(item)}>✏️</button>
                                    </td>
                                    <td className="py-3">
                                        <button className="px-6 py-3" type="button" onClick={() => deleteitem(item.SparePart_ID)}>❌</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ul class="flex space-x-5 justify-center font-[sans-serif] p-10">
                    <button className="flex items-center justify-center shrink-0 bg-gray-100 w-9 h-9 rounded-md cursor-pointer hover:bg-blue-400" onClick={() => changePage(currentPage > 1 ? currentPage - 1 : 1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 fill-gray-400" viewBox="0 0 55.753 55.753">
                            <path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" data-original="#000000" />
                        </svg>
                    </button>
                            
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`flex items-center justify-center shrink-0 border cursor-pointer text-base font-bold text-gray-800 px-[13px] h-9 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:border-blue-500'}`} onClick={() => changePage(index + 1)}>
                            {index + 1}
                        </li>
                    ))}
                    <button className="flex items-center justify-center shrink-0 bg-gray-100 w-9 h-9 rounded-md cursor-pointer hover:bg-blue-400" onClick={() => changePage(currentPage < totalPages ? currentPage + 1 : totalPages)}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 fill-gray-400 rotate-180" viewBox="0 0 55.753 55.753">
                            <path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"data-original="#000000" />
                        </svg>
                    </button>
                </ul>
            </div>
        )}

        {isEditModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
                    <h2 className="text-xl font-bold mb-4">แก้ไขสินค้า</h2>
                    <form onSubmit={e => { e.preventDefault(); updateProduct(); }}>
                        <div className="mb-4">
                            <label className="block text-gray-700">จำนวนสินค้า</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                value={editProduct.SparePart_Amount}
                                onKeyDown={(e) => {
                                    if ([".", "e", "-", "+"].includes(e.key)) {
                                    e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                    setEditProduct({ ...editProduct, SparePart_Amount: val });
                                    }
                                }}
                                />
                            </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">ราคาต่อหน่วย</label>
                            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded" value={editProduct.SparePart_Price} onChange={e => setEditProduct({ ...editProduct, SparePart_Price: e.target.value })}/>
                        </div>
                        <div className="mb-4">
                            <input checked={Boolean(editProduct?.SparePart_Notify)} type="checkbox" id="notify" onChange={e => setEditProduct({ ...editProduct, SparePart_Notify: e.target.checked ? 1 : 0})}/>
                            แจ้งเตือนผ่านไลน์
                        </div>
                        {(editProduct?.SparePart_Notify === 1) && (<>
                            <div className='flex text-[1.2vw] px-2 py-2'>
                                <p className='px-2 text-sm'>จำนวนอะไหล่ที่ต้องการแจ้งเตือน</p>
                                <input value={editProduct.SparePart_NotifyAmount} className='class="block p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100"' type="number" id="notify_amount" min="0" defaultValue={0} onChange={e => setEditProduct({ ...editProduct, SparePart_NotifyAmount: parseInt(e.target.value) || 0})} placeholder="จำนวน" />
                                <p className="text-red-500 text-sm mx-2 mt-2">หากตั้งไว้เป็น 0 = แจ้งเตือนตลอด, หากเป็นค่าอื่นจะแจ้งเตือนหากน้อยกว่าจำนวนที่ตั้งไว้</p>
                            </div> 
                        </>)}
                        <div className="flex justify-center space-x-4">
                            <button className="px-4 py-2 text-gray-700 bg-red-400 hover:bg-red-600 rounded" onClick={closeEditModal}>ยกเลิก</button>
                            <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded">บันทึก</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {isDetailModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4 overflow-hidden">
                    <h2 className="text-xl mb-4 kanit-bold">รายละเอียด</h2>
                    <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-2">
                        <form>
                            <div className="mb-4 space-y-2">
                                <p><strong>รหัสสินค้า:</strong> {Detail.SparePart_ProductID}</p>
                                <p><strong>ชื่อสินค้า:</strong> {Detail.SparePart_Name}</p>
                                <p><strong>รายละเอียดสินค้า:</strong> {Detail.SparePart_Description}</p>
                                <p><strong>จำนวนคงเหลือ:</strong> {Detail.SparePart_Amount}</p>
                                <p><strong>ราคาต่อหน่วย:</strong> {Detail.SparePart_Price}</p>
                                <p><strong>ประเภท:</strong> {Detail.Category_Name}</p>
                                <p><strong>รถรุ่น:</strong> {Detail.Model_Details}</p>
                            </div>
                            <div className="flex justify-center space-x-4 mt-4">
                                <button onClick={closeDetailModal} className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded">ตกลง</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}

        {isaddproductmodal && (
            <Modal_Addproduct setisaddproductmodal={setisaddproductmodal} />
        )}

        {isDeleteModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div class="p-4 md:p-5 text-center">
                        <svg class="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 class="mt-2 mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">ต้องการลบสินค้าหรือไม่?</h3>
                        <button onClick={confirmDelete} data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">ใช่, ยืนยัน</button>
                        <button onClick={cancelDelete} data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">ไม่, ยกเลิก</button>
                    </div>
                </div>
            </div>
        )}
    </>
}

export default Warehouse;