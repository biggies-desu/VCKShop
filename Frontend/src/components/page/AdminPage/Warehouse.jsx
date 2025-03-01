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
    const [itemsPerPage] = useState(6); // จำนวนรายการที่จะแสดงในแต่ละหน้า
    const [totalPages, setTotalPages] = useState(1);

    const token = jwtDecode(localStorage.getItem('token'));

    const openModal = (id) => {
        setDeleteId(id);
        setisDeleteModalOpen(true);
    };
    
    const closeModal = () => {
        setDeleteId('');
        setisDeleteModalOpen(false);
    };

    useEffect(() => {
        console.log(token.user_id)
        axios.get(`${import.meta.env.VITE_API_URL}/allsparepart`)
            .then((res) => {
                console.log("API Response:", res.data);
                setapidata(res.data);
            })
            .catch((err) => {
                console.error("API Error:", err);
            });
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
        axios.post(`${import.meta.env.VITE_API_URL}/searchquery`, {
            search_query: search_query
        })
        .then((res) => {
            console.log(res);
            setapidata(res.data);
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
        axios.delete(`${import.meta.env.VITE_API_URL}/deletesparepart/${deleteId}`,{
            headers: { "user_id": token.user_id }
            })
            .then((res) => {
                closeModal();
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    function cancelDelete() {
        closeModal();
    }

    return <>
        {!isaddproductmodal && (
            <div className="p-6 bg-gray-100 min-h-screen kanit-regular">
                <div className='flex flex-row justify-center items-center bg-white p-4 shadow-md rounded-lg'>
                    <h1 className="text-xl font-semibold text-gray-700">คลังสินค้า</h1>
                </div>
                <form className="mx-8 my-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 content-center">
                        <input value={search_query} type="search" id="search_query" className="w-full sm:flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300" placeholder="ค้นหาชื่อ/รหัสสินค้า" onChange={e => setsearch_query(e.target.value)} />
                        <button type="button" id="search" onClick={search} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">ค้นหา</button>
                        <button type="button" id="add" onClick={addproduct} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">เพิ่มสินค้า</button>
                    </div>
                </form>
                <div className="relative overflow-auto shadow-md rounded-2xl">
                    <table className="w-full text-gray-700">
                        <thead className="text-base text-white bg-blue-500">
                            <tr>
                                <th className="px-4 py-2">รูปภาพ</th>
                                <th className="px-4 py-2">รหัสสินค้า</th>
                                <th className="px-4 py-2">ชื่อสินค้า</th>
                                <th className="px-4 py-2">ประเภท</th>
                                <th className="px-4 py-2">จำนวนคงเหลือ</th>
                                <th className="px-4 py-2">ราคาต่อหน่วย</th>
                                <th className="px-4 py-2">รายละเอียด</th>
                                <th className="px-4 py-2">แก้ไข</th>
                                <th className="px-4 py-2">ลบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentApidata.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100">
                                    <td className="px-6 py-4">{item.SparePart_Image ? (
                                        <img src={`${import.meta.env.VITE_API_URL}/uploads/${item.SparePart_Image}`} alt={item.SparePart_Image}  className="h-[50px] w-[50px] object-cover rounded"/>) : ('ไม่มีรูป')}
                                    </td>
                                    <td className="px-6 py-4">{item.SparePart_ProductID}</td>
                                    <td className="px-6 py-4">{item.SparePart_Name}</td>
                                    <td className="px-6 py-4">{item.Category_Name}</td>
                                    <td className="px-6 py-4">{item.SparePart_Amount}</td>
                                    <td className="px-6 py-4">{item.SparePart_Price}</td>
                                    <td className="px-6 py-4">
                                        <button className="px-6 py-4" type="button" onClick={() => openDetailModal(item)}>📄</button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="px-6 py-4" type="button" onClick={() => openEditModal(item)}>✏️</button>
                                    </td>
                                    <td className="py-4">
                                        <button className="px-6 py-4" type="button" onClick={() => deleteitem(item.SparePart_ID)}>❌</button>
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
                            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded" value={editProduct.SparePart_Amount} onChange={e => setEditProduct({ ...editProduct, SparePart_Amount: e.target.value })}/>
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
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
                    <h2 className="text-xl font-bold mb-4">รายละเอียด</h2>
                    <form>
                        <div className="mb-4">
                            <p><strong>รหัสสินค้า:</strong> {Detail.SparePart_ProductID}</p>
                            <p><strong>ชื่อสินค้า:</strong> {Detail.SparePart_Name}</p>
                            <p><strong>รายละเอียดสินค้า:</strong> {Detail.SparePart_Description}</p>
                            <p><strong>จำนวนคงเหลือ:</strong> {Detail.SparePart_Amount}</p>
                            <p><strong>ราคาต่อหน่วย:</strong> {Detail.SparePart_Price}</p>
                            <p><strong>ประเภท:</strong> {Detail.Category_Name}</p>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button onClick={closeDetailModal} className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded">ตกลง</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {isaddproductmodal && (
            <Modal_Addproduct setisaddproductmodal={setisaddproductmodal} />
        )}

        {isDeleteModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
                    <h2 className="text-xl font-bold mb-4">ต้องการลบสินค้าหรือไม่</h2>
                    <div className="flex space-x-4 items-center justify-center">
                        <button onClick={cancelDelete} className="block rounded px-4 py-2 text-gray-700 bg-red-400 hover:bg-red-600 active:bg-red-700">ยกเลิก</button>
                        <button onClick={confirmDelete} className="block rounded px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 active:bg-green-700">ยืนยัน</button>
                    </div>
                </div>
            </div>
        )}
    </>
}

export default Warehouse;