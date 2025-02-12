import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal_Addproduct from "./Modal_Addproduct.jsx";

function Warehouse() {
    const [search_query, setsearch_query] = useState("");
    const [apidata, setapidata] = useState([]);
    const [isaddproductmodal, setisaddproductmodal] = useState(false);
    const [isDeleteModalOpen, setisDeleteModalOpen] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState('')
    const [editDetail, setEditDetail] = useState(null)

    const openModal = (id) => {
        setDeleteId(id);
        setisDeleteModalOpen(true);
    };
    
    const closeModal = () => {
        setDeleteId('');
        setisDeleteModalOpen(false);
    };

    useEffect(() => {
        axios.get('http://localhost:5000/allsparepart')
            .then((res) => {
                console.log("API Response:", res.data);
                setapidata(res.data);
            })
            .catch((err) => {
                console.error("API Error:", err);
            });
    }, []);

    function search(event) {
        event.preventDefault();
        console.log("search : ", search_query);
        axios.post('http://localhost:5000/searchquery', {
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
        setEditDetail(item);
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
        axios.put(`http://localhost:5000/updatesparepart/${editProduct.SparePart_ID}`, {
            productamount: editProduct.SparePart_Amount,
            productprice: editProduct.SparePart_Price,
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
        axios.delete(`http://localhost:5000/deletesparepart/${deleteId}`)
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
            <div className="flex flex-col justify-center">
                <h1 className="text-[1.5vw] mb-4 text-center pt-4">รายการสินค้าคงคลัง</h1>
                <form className="content-start mx-8 my-2">
                    <div className="flex space-x-4 content-center">
                        <input value={search_query} type="search" id="search_query" className="block w-full p-4 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100" placeholder="ค้นหาชื่อ/รหัสสินค้า" onChange={e => setsearch_query(e.target.value)} />
                        <button type="button" id="search" onClick={search}><img src='/images/search-symbol.png' className='h-[2vw] w-[2vw]' /></button>
                        <button type="button" id="add" onClick={addproduct} className="block rounded mx-4 px-6 py-2 text-[1vw] bg-blue-400 hover:bg-blue-500 active:bg-blue-700 whitespace-nowrap">เพิ่มสินค้า</button>
                    </div>
                </form>
                <div className="relative overflow-auto shadow-md rounded-2xl">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-base text-gray-700 bg-gray-400">
                            <tr>
                                <th className="px-6 py-3">รูปภาพ</th>
                                <th className="px-6 py-3">รหัสสินค้า</th>
                                <th className="px-6 py-3">ชื่อสินค้า</th>
                                <th className="px-6 py-3">ประเภท</th>
                                <th className="px-6 py-3">จำนวนคงเหลือ</th>
                                <th className="px-6 py-3">ราคาต่อหน่วย</th>
                                <th className="px-6 py-3">รายละเอียด</th>
                                <th className="px-6 py-3">แก้ไข</th>
                                <th className="px-6 py-3">ลบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apidata.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-100 border-b-2">
                                    <td className="px-6 py-4">{console.log('Image URL:', `http://localhost:5000/uploads/${item.SparePart_Image}`)}{console.log('SparePart_Image:', item.SparePart_Image)}{console.log('Item Structure:', item)}{item.SparePart_Image ? (
                                        <img src={`http://localhost:5000/uploads/${item.SparePart_Image}`} alt={item.SparePart_Image}  className="h-[50px] w-[50px] object-cover rounded"/>) : ('ไม่มีรูป')}
                                    </td>
                                    <td className="px-6 py-4">{item.SparePart_ProductID}</td>
                                    <td className="px-6 py-4">{item.SparePart_Name}</td>
                                    <td className="px-6 py-4">{item.Category_Name}</td>
                                    <td className="px-6 py-4">{item.SparePart_Amount}</td>
                                    <td className="px-6 py-4">{item.SparePart_Price}</td>
                                    <td className="px-6 py-4">
                                        <button className="px-6 py-4" type="button" onClick={() => openDetailModal(item)}>
                                            <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="gray" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6"/>
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="px-6 py-4" type="button" onClick={() => openEditModal(item)}>
                                            <svg className="mr-4 w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                            </svg>  
                                        </button>
                                    </td>
                                    <td className="py-4">
                                        <button className="px-6 py-4" type="button" onClick={() => deleteitem(item.SparePart_ID)}>
                                            <svg className="mr-4 w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="red" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {isEditModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded shadow-lg w-1/3">
                    <h2 className="text-[1.5vw] mb-4">แก้ไขสินค้า</h2>
                    <form onSubmit={e => { e.preventDefault(); updateProduct(); }}>
                        <div className="mb-4">
                            <label className="block text-gray-700">จำนวนสินค้า</label>
                            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded" value={editProduct.SparePart_Amount} onChange={e => setEditProduct({ ...editProduct, SparePart_Amount: e.target.value })}/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">ราคาต่อหน่วย</label>
                            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded" value={editProduct.SparePart_Price} onChange={e => setEditProduct({ ...editProduct, SparePart_Price: e.target.value })}/>
                        </div>
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 text-gray-700 bg-red-400 hover:bg-red-600 rounded" onClick={closeEditModal}>ยกเลิก</button>
                            <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded">บันทึก</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {isDetailModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded shadow-lg w-1/3">
                    <h2 className="text-[1.5vw] mb-4">รายละเอียด</h2>
                    <form>
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded">ตกลง</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {isaddproductmodal && (
            <Modal_Addproduct setisaddproductmodal={setisaddproductmodal} />
        )}

        {isDeleteModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded shadow-lg">
                    <h2 className="text-[1.5vw] mb-4">ต้องการลบสินค้าหรือไม่</h2>
                    <div className="flex space-x-20 items-center justify-center">
                        <button onClick={cancelDelete} className="block rounded px-4 py-2 text-gray-700 bg-red-400 hover:bg-red-600 active:bg-red-700">ยกเลิก</button>
                        <button onClick={confirmDelete} className="block rounded px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 active:bg-green-700">ยืนยัน</button>
                    </div>
                </div>
            </div>
        )}
    </>
}

export default Warehouse;