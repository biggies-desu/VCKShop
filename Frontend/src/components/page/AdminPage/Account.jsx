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
    const [isHistoryModalOpen, setisHistoryModalOpen] = useState('');
    const [ischangepassModalOpen, setischangepassModalOpen] = useState('')
    const [historydata, sethistorydata] = useState([])
    const [cardropdown, setcardropdown] = useState([])
    const [editProduct, setEditProduct] = useState({});
    const [deleteId, setDeleteId] = useState('');
    const [role, setrole] = useState('')
    const [username, setusername] = useState()
    const [firstname, setfirstname] = useState()
    const [lastname, setlastname] = useState()
    const [telephone, settelephone] = useState()
    const [email, setemail] = useState()
    const [showNotification, setShowNotification] = useState(false);
    const [carregis,setcarregis] = useState('')

    const [newpassword, setnewpassword] = useState()
    const [confirmnewpassword, setconfirmnewpassword] = useState()
    const [changepassuserid, setchangepassuserid] = useState('')


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

    function openHistoryModal(item) {
        setEditProduct(item);
        setcarregis('');
        setisHistoryModalOpen(true);
    
        axios.get(`${import.meta.env.VITE_API_URL}/cardropdown/${item.User_ID}`)
            .then((res) => {
                setcardropdown(res.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        console.log(carregis)
        if (isHistoryModalOpen && editProduct.User_ID) {
            axios.post(`${import.meta.env.VITE_API_URL}/bookinghistory/${editProduct.User_ID}`, {
                carID: carregis,
            })
            .then((res) => {
                sethistorydata(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
        }
    }, [carregis, isHistoryModalOpen, editProduct.User_ID]);


    function closeHistoryModel()
    {
        setisHistoryModalOpen(false)
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

    function openchangepassModal(item) {
        setchangepassuserid(item.User_ID);
        setnewpassword('');
        setconfirmnewpassword('');
        setischangepassModalOpen(true);
    }

    function closechangepassModel()
    {
        setischangepassModalOpen(false)
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
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function changepassword(event)
    {
        event.preventDefault();
        const ispasswordvalid = validatepassword()
        if(!ispasswordvalid)
        {
            return; //exit funtion due invalid username or password
        }
        setShowNotification(true);
        axios.post(`${import.meta.env.VITE_API_URL}/changepassword/${changepassuserid}`,
        {
            newpassword: newpassword,
            confirmnewpassword: confirmnewpassword,
            role: 1

        })
        .then((res)=>{
            if(res.status === 200){
                console.log(res);
                setTimeout(() => {
                setShowNotification(false);
                closechangepassModel();
            }, 3000);
            }
        })
        .catch((err) => {
            console.log(err)
            if(err.response.data.message === 'Something went wrong')
            {
                document.getElementById("errchangepass").innerHTML = "Something went wrong!";
            }
            if(err.response.data.message === 'Passwords do not match')
            {
                document.getElementById("errchangepass").innerHTML = "Passwords do not match!";
            }
            if(err.response.data.message === 'Old password is incorrect')
            {
                document.getElementById("errchangepass").innerHTML = "Old password is incorrect!";
            }
        })
    }

    function validatepassword(){
        const regex = /^(?=.*\d).{8,}$/;
        if (!regex.test(newpassword)){
            document.getElementById("errchangepass").innerHTML = "Must contain at least one number and at least 8 or more characters";
            return false
        }
        if (confirmnewpassword !== newpassword)
        {
            document.getElementById("errchangepass").innerHTML = "Password is not match";
            return false
        }
        else{
            document.getElementById("errchangepass").innerHTML = "";
            return true
        }
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
        <div className="flex flex-col md:flex-row md:items-end md:gap-4 gap-2 w-full">
        <div className="w-full md:w-1/3">
        <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-1">Role</label>
            <select id="role" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" value={role} placeholder='ประเภทอะไหล่' onChange={(e) => setrole(e.target.value)}>
                <option selected value=''>ทั้งหมด</option>
                {roledata.map((role, index) => (
                    <option key={index} value={role.Role_Name}>
                        {role.Role_Name}
                    </option>
                ))}
            </select>
        </div>
        <div className="w-full md:w-2/3">
        <label htmlFor="search" className="block text-gray-700 text-sm font-medium mb-1">คำค้นหา</label>
            <input className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="search" type="text" placeholder="คำค้นหา (ชื่่อ, Username, ทะเบียนรถ)" required onChange={(e) => setsearchname(e.target.value)}/>
        </div>
            <button type='button' id="search_func" className="max-md:mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" required onClick={() => search_func()}>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                </svg>
            </button>
        </div>
        </form>
        <div className="relative overflow-x-auto shadow-md rounded-2xl mt-6">
        <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-lg">
                <thead className="text-sm md:text-base text-white bg-blue-500">
                    <tr>
                        <th className='text-start px-3 py-3'>Username</th>
                        <th className='text-start px-3 py-3'>Role</th>
                        <th className="text-end py-3">ประวัติจองคิว</th>
                        <th className="text-end py-3">แก้ไขข้อมูลผู้ใช้</th>
                        <th className="text-end py-3">เปลื่ยนรหัสผ่าน</th>
                        <th className='text-end px-4 py-3'>ลบบัญชี</th>
                    </tr>
                </thead>
            <tbody>
                {currentQueuedata.map((item) => (
                    <tr key = {item.User_ID} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                        <td className ='text-start px-3 py-3'>{item.User_Username}</td>
                        <td className="text-start px-3 py-3">
                            <select className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" value={item.Role_ID} onChange={(e) => rolechange(item.User_ID, e.target.value)}>
                                {roledata.map(role => (
                                    <option key={role.Role_ID} value={role.Role_ID}>
                                        {role.Role_Name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="text-end px-6 py-3">
                            <button className="px-3 py-3" type="button" onClick={() => openHistoryModal(item)}>📜</button>
                        </td>
                        <td className="text-end px-6 py-3">
                            <button className="px-3 py-3" type="button" onClick={() => openEditModal(item)}>✏️</button>
                        </td>
                        <td className="text-end px-6 py-3">
                            <button className="px-3 py-3" type="button" onClick={() => openchangepassModal(item)}>🔓</button>
                        </td>
                        <td className='text-end px-3 py-2'>
                            <button className="px-6 py-3" type="button" onClick={() => deleteitem(item.User_ID)}>❌</button>
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
                <form className="space-y-3">
                    <div className="flex justify-start font-bold">Username</div>
                    <div className="relative">
                    <input value={username} type="text" name="username" id="username" placeholder="๊ชื่อบัญชี" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" readOnly></input>
                    </div>             
                    <div className="flex justify-start font-bold">Firstname</div>
                    <div className="relative">
                    <input value={firstname} type="text" name="firstname" id="firstname" placeholder="ชื่อจริง" onChange={e => setfirstname(e.target.value)} class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                    </div>
                    <div className="flex justify-start font-bold">Lastname</div>
                    <div className="relative">
                    <input value={lastname} type="text" name="lastname" id="lastname" placeholder="นามสกุล" onChange={e => setlastname(e.target.value)} class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                    </div>
                    <div className="flex justify-start font-bold">Email</div>
                    <div className="relative">
                    <input value={email} type="email" name="email" id="email" placeholder="อีเมล" onChange={e => setemail(e.target.value)} class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                    </div>
                    <div className="flex justify-start font-bold">Telephone</div>
                    <div className="relative">
                    <input value={telephone} type="tel" name="telephone" id="telephone" placeholder="เบอร์โทรศัพท์"maxlength="10" inputMode="numeric" onChange={e => settelephone(e.target.value.replace(/[^0-9]/g, ''))} class="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button className="px-4 py-2 text-gray-700 bg-red-400 hover:bg-red-600 rounded" onClick={closeEditModal}>ยกเลิก</button>
                        <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded" onClick={(e) => editprofile(e)}>บันทึก</button>
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

    {isHistoryModalOpen && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-3xl mx-4 max-h-[75vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-center">ประวัติจองคิว</h2>
                <div onClick={() => closeHistoryModel()}><button type ='button'>
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
                </button></div>
                </div>
                <label htmlFor="car_regis" className="block text-gray-700 text-sm font-medium mb-1">ทะเบียนรถ</label>
                <select id="carregis" value={carregis} onChange={(e) => setcarregis(e.target.value)}
                        className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">ทั้งหมด</option>
                            {cardropdown.map((car, index) => (
                            <option key={index} value={car.Car_ID}>{car.Car_RegisNum} {car.Province_Name}</option>
                        ))}
                    </select>
                <div className="relative overflow-x-auto mt-4">
                <table className="w-full text-sm md:text-base table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="text-start px-3 py-2">วันที่/เวลา</th>
                            <th className="text-start px-3 py-2">รุ่นรถ</th>
                            <th className="text-start px-6 py-2">ทะเบียนรถ</th>
                            <th className="text-end px-2 py-2">รายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historydata.map((item,index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100">
                                <td className="text-start py-3">{new Date(item.Booking_Date).toLocaleDateString('th-TH')} {item.Booking_Time}</td>
                                <td className="text-start py-3">{item.Brand_Name} {item.Model_Name} {item.Model_Year}</td>
                                <td className="text-end py-3">{item.Car_RegisNum} {item.Province_Name}</td>
                                <td className="text-end py-3">{item.Booking_Description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
        )}

    {ischangepassModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
                <h2 className="text-xl font-bold mb-4 text-center">เปลื่ยนรหัสผ่าน</h2>
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
                            <p className="mt-1 text-sm text-gray-700">Password changes have been saved.</p>
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
                    <form className="space-y-3">
                    <div className="flex justify-start font-bold">รหัสผ่านใหม่</div>
                    <div className="relative">
                        <input value={newpassword} onChange={e => setnewpassword(e.target.value)} type="password" required pattern="^(?=.*\d).{8,}$" name="newpassword" id="newpassword" placeholder="รหัสผ่านใหม่" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                    </div>             
                    <div className="flex justify-start font-bold">ยืนยันรหัสผ่านใหม่</div>
                    <div className="relative">
                        <input value={confirmnewpassword} onChange={e => setconfirmnewpassword(e.target.value)} type="password" required pattern="^(?=.*\d).{8,}$" name="confirmnewpassword" id="confirmnewpassword" placeholder="ยืนยันรหัสผ่านใหม่" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"></input>
                    </div>
                    <div class="text-red-600 mt-3" id="errchangepass"></div>
                    <div className="flex justify-center space-x-4">
                        <button className="px-4 py-2 text-gray-700 bg-red-400 hover:bg-red-600 rounded" onClick={closechangepassModel}>ยกเลิก</button>
                        <button className="px-4 py-2 text-gray-700 bg-green-400 hover:bg-green-600 rounded" onClick={(e) => changepassword(e)}>บันทึก</button>
                    </div>
                </form> 
                </div>
            </div>
        )}

    </>
}

export default Account