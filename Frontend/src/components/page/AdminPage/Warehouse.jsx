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
    const [Detail, setDetail] = useState(null)

    const openModal = (id) => {
        setDeleteId(id);
        setisDeleteModalOpen(true);
    };
    
    const closeModal = () => {
        setDeleteId('');
        setisDeleteModalOpen(false);
    };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/allsparepart`)
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
            productnotify: editProduct.SparePart_Notify ? 'true' : 'false',
            productnotify_amount : editProduct.SparePart_NotifyAmount
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
        axios.delete(`${import.meta.env.VITE_API_URL}/deletesparepart/${deleteId}`)
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

    //i moved this section (apidata.map) for debugged purpose
    //{console.log('Image URL:', `http://localhost:5000/uploads/${item.SparePart_Image}`)}{console.log('SparePart_Image:', item.SparePart_Image)}{console.log('Item Structure:', item)}

    return <>
        {!isaddproductmodal && (
            <div className="flex flex-col justify-center">
                <h1 className="text-[1.5vw] mb-4 text-center pt-4">รายการสินค้าคงคลัง</h1>
                <form className="content-start mx-8 my-2">
                    <div className="flex space-x-4 content-center">
                        <input value={search_query} type="search" id="search_query" className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300" placeholder="ค้นหาชื่อ/รหัสสินค้า" onChange={e => setsearch_query(e.target.value)} />
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
                            {apidata.map((item, index) => (
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
            </div>
        )}

        {isEditModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded shadow-lg w-1/2">
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
                        <div className="mb-4">
                            <input checked={editProduct?.SparePart_Notify === true || editProduct?.SparePart_Notify === "true"} type="checkbox" id="notify" onChange={e => setEditProduct({ ...editProduct, SparePart_Notify: e.target.checked})}/>
                            แจ้งเตือนผ่านไลน์
                        </div>
                        {(editProduct?.SparePart_Notify === true || editProduct?.SparePart_Notify === "true") && (<>
                            <div className='flex text-[1.2vw] px-2 py-2'>
                                <p className='px-2 text-sm'>จำนวนอะไหล่ที่ต้องการแจ้งเตือน</p>
                                <input value={editProduct.SparePart_NotifyAmount} className='class="block p-2 text-[1vw] text-gray-900 border border-gray-300 rounded-lg bg-gray-100"' type="number" id="notify_amount" min="0" defaultValue={0} onChange={e => setEditProduct({ ...editProduct, SparePart_NotifyAmount: e.target.value})} placeholder="จำนวน" />
                                <p className="text-red-500 text-sm mx-2 mt-2">หากตั้งไว้เป็น 0 = แจ้งเตือนตลอด, หากเป็นค่าอื่นจะแจ้งเตือนหากน้อยกว่าจำนวนที่ตั้งไว้</p>
                            </div> 
                        </>)}
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
                        <div className="mb-4">
                            <p><strong>รหัสสินค้า:</strong> {Detail.SparePart_ProductID}</p>
                            <p><strong>ชื่อสินค้า:</strong> {Detail.SparePart_Name}</p>
                            <p><strong>รายละเอียดสินค้า:</strong> {Detail.SparePart_Description}</p>
                            <p><strong>จำนวนคงเหลือ:</strong> {Detail.SparePart_Amount}</p>
                            <p><strong>ราคาต่อหน่วย:</strong> {Detail.SparePart_Price}</p>
                            <p><strong>ประเภท:</strong> {Detail.Category_Name}</p>
                            <p><strong>ยี่ห้อ:</strong> {Detail.SparePart_Brand_Name}</p>
                            <p><strong>รถรุ่น:</strong> {Detail.SparePart_Model_Name}</p>
                            <p><strong>ปี:</strong> {Detail.SparePart_Model_Year}</p>
                        </div>
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