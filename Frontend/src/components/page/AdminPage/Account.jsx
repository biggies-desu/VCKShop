import axios from "axios";
import React, { useEffect, useState } from "react";

function Account()
{
    const [accountdata, setaccountdata] = useState([])
    const [roledata, setroledata] = useState([])
    const [searchname, setsearchname] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // จำนวนรายการที่จะแสดงในแต่ละหน้า
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleteModalOpen, setisDeleteModalOpen] = useState('');
    const [isEditModalOpen, setisEditModalOpen] = useState('');
    const [editProduct, setEditProduct] = useState({});
    const [deleteId, setDeleteId] = useState('');
    const [role, setrole] = useState('')
    const [username, setusername] = useState()
    const [firstname, setfirstname] = useState()
    const [lastname, setlastname] = useState()
    const [telephone, settelephone] = useState()
    const [email, setemail] = useState()
    const [showNotification, setShowNotification] = useState(false);

    //fetch data
    useEffect(() => {
        fetchdata()
    }, [])

    useEffect(() => {
        if (accountdata.length > 0) {
            const totalPages = Math.ceil(accountdata.length / itemsPerPage);
            setTotalPages(totalPages); 
        }
    }, [accountdata, itemsPerPage]);

    const openModal = (User_ID) => {
        setDeleteId(User_ID);
        setisDeleteModalOpen(true);
    };
    
    const closeModal = () => {
        setDeleteId('');
        setisDeleteModalOpen(false);
    };

    function deleteitem(User_ID) {
        openModal(User_ID);
    }

    function openEditModal(item) {
        setEditProduct(item);
        setusername(item.User_Username);
        setfirstname(item.User_Firstname);
        setlastname(item.User_Lastname);
        setemail(item.User_Email);
        settelephone(item.User_Telephone);
        setisEditModalOpen(true);
    }
    
    function closeEditModal() {
        setisEditModalOpen(false);
    }

    function cancelDelete() {
        closeModal();
    }

    function fetchdata()
    {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/user`), // fetch data
            axios.get(`${import.meta.env.VITE_API_URL}/role`), // fetch role
        ])
        
        .then((res) => {
            console.log(res)
            setaccountdata(res[0].data)
            setroledata(res[1].data)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function rolechange(id, Role_ID)
    {
        setaccountdata(prevData =>
            prevData.map(user =>
                user.User_ID === id ? { ...user, Role_ID: Role_ID } : user
            )
        );
        //call api
        axios.post(`${import.meta.env.VITE_API_URL}/updaterole`, {
            User_ID: id,
            Role_ID: Role_ID
        })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
            fetchdata()
        })
    }

    function search_func()
    {
        axios.post(`${import.meta.env.VITE_API_URL}/searchuser`,
            {
                searchname: searchname,
                role: role
            }
        )
        .then((res) => {
            console.log(res)
            setaccountdata(res.data)
            setCurrentPage(1);
        })
        .catch((err) => {
            console.log(err)
            fetchdata()
        })
    }

    function editprofile(e) {
        e.preventDefault();
        setShowNotification(true);
        axios.put(`${import.meta.env.VITE_API_URL}/updateprofile/${editProduct.User_ID}`, {
            firstname: firstname,
            lastname: lastname,
            email: email,
            telephone: telephone
        })
        .then((res) => {
            console.log(res);
            setTimeout(() => {
                setShowNotification(false);
                closeEditModal();
            }, 3000);
        })
        .catch((err) => {
            console.error(err);
        });
    }
    

    function delete_func()
    {
        axios.delete(`${import.meta.env.VITE_API_URL}/deleteaccount/${deleteId}`)
        .then((res)=>{
            console.log(res)
            fetchdata()
            window.location.reload()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const currentQueuedata = accountdata.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const changePage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return <>
    <div className="p-6 bg-gray-100 min-h-screen">
        <div className='kanit-bold flex flex-row justify-center items-center bg-white p-4 shadow-md rounded-lg'>
            <h1 className="max-md:text-lg md:text-4xl text-gray-700">จัดการ Account</h1>
        </div>

        <form className="mt-4 p-4 bg-white shadow-md rounded-lg flex-row md:flex md:space-x-4 items-center">
            <select id="role" className="shadow border rounded-lg w-full md:w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" value={role} placeholder='ประเภทอะไหล่' onChange={(e) => setrole(e.target.value)}>
                <option selected value=''>ทั้งหมด</option>
                {roledata.map((role, index) => (
                    <option key={index} value={role.Role_Name}>
                        {role.Role_Name}
                    </option>
                ))}
            </select> 
            <input className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="name" type="text" placeholder="Username" required onChange={(e) => setsearchname(e.target.value)}/>
            <button type='button' id="search" className="max-md:mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" required onClick={() => search_func()}>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                </svg>
            </button>
        </form>
        <div className="relative overflow-x-auto shadow-md rounded-2xl mt-6">
        <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-lg">
                <thead className="text-sm md:text-base text-white bg-blue-500">
                    <tr>
                        <th className='text-start px-3 py-2'>Username</th>
                        <th className='text-start px-3 py-2'>Role</th>
                        <th className="text-end py-2">แก้ไขข้อมูลผู้ใช้</th>
                        <th className='text-end px-4 py-2'>ลบบัญชี</th>
                    </tr>
                </thead>
            <tbody>
                {currentQueuedata.map((item) => (
                    <tr key = {item.User_ID} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                        <td className ='text-start px-3 py-2'>{item.User_Username}</td>
                        <td className="text-start px-3 py-2">
                            <select className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" value={item.Role_ID} onChange={(e) => rolechange(item.User_ID, e.target.value)}>
                                {roledata.map(role => (
                                    <option key={role.Role_ID} value={role.Role_ID}>
                                        {role.Role_Name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="text-end px-6 py-4">
                            <button className="px-3 py-4" type="button" onClick={() => openEditModal(item)}>✏️</button>
                        </td>
                        <td className='text-end px-3 py-2'>
                            <button className="px-6 py-4" type="button" onClick={() => deleteitem(item.User_ID)}>❌</button>
                        </td>
                    </tr>
                ))
                }
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

    {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
                <h2 className="text-xl font-bold mb-4 text-center">แก้ไขข้อมูลผู้ใช้</h2>
                {showNotification && (
                <div role="alert" className="flex justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-28 rounded-xl border border-gray-100 shadow-2xl bg-white p-4 w-full max-w-md">
                    <div className="flex gap-4">
                        <span className="text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </span>
                        <div className="flex-1">
                            <strong className="block font-medium text-gray-900">Changes saved</strong>
                            <p className="mt-1 text-sm text-gray-700">Your account changes have been saved.</p>
                        </div>
                        <button className="text-gray-500 transition hover:text-gray-600" onClick={() => setShowNotification(false)}>
                            <span className="sr-only">Dismiss popup</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                )}
                <form className="space-y-6">
                    <div className="flex justify-start font-bold">Username</div>
                    <div className="relative">
                    <input value={username} type="text" name="username" id="username" placeholder="๊ชื่อบัญชี" className="w-full bg-gray-200 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300" readOnly></input>
                    <i className="fas fa-user absolute right-3 top-3 text-yellow-900"></i> 
                    </div>             
                    <div className="flex justify-start font-bold">Firstname</div>
                    <div className="relative">
                    <input value={firstname} type="text" name="firstname" id="firstname" placeholder="ชื่อจริง" onChange={e => setfirstname(e.target.value)} class="w-full bg-gray-200 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                    <i className="fas fa-address-card absolute right-3 top-3 text-yellow-900"></i>
                    </div>
                    <div className="flex justify-start font-bold">Lastname</div>
                    <div className="relative">
                    <input value={lastname} type="text" name="lastname" id="lastname" placeholder="นามสกุล" onChange={e => setlastname(e.target.value)} class="w-full bg-gray-200 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                    <i className="fas fa-address-card absolute right-3 top-3 text-yellow-900"></i>
                    </div>
                    <div className="flex justify-start font-bold">Email</div>
                    <div className="relative">
                    <input value={email} type="email" name="email" id="email" placeholder="อีเมล" onChange={e => setemail(e.target.value)} class="w-full bg-gray-200 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                    <i className="fas fa-envelope absolute right-3 top-3 text-yellow-900"></i>
                    </div>
                    <div className="flex justify-start font-bold">Telephone</div>
                    <div className="relative">
                    <input value={telephone} type="tel" name="telephone" id="telephone" placeholder="เบอร์โทรศัพท์"maxlength="10" inputMode="numeric" onChange={e => settelephone(e.target.value.replace(/[^0-9]/g, ''))} class="w-full bg-gray-200 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"></input>
                    <i className="fas fa-phone absolute right-3 top-3 text-yellow-900"></i>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded" onClick={(e) => editprofile(e)}>บันทึก</button>
                        <button className="px-4 py-2 text-gray-700 bg-red-400 hover:bg-red-600 rounded" onClick={closeEditModal}>ยกเลิก</button>
                    </div>
                </form> 
            </div>
        </div>
    )}

    {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                <div class="p-4 md:p-5 text-center">
                    <svg class="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="mt-2 mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">ต้องการลบผู้ใช้งานหรือไม่?</h3>
                    <button onClick={delete_func} data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">ใช่, ยืนยัน</button>
                    <button onClick={cancelDelete} data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">ไม่, ยกเลิก</button>
                </div>
            </div>
        </div>
    )}
    </>
}

export default Account