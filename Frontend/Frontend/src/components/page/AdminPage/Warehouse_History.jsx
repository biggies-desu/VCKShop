import axios from "axios";
import React, { act, useState } from "react";
import { useEffect } from "react";

function Warehouse_History()
{
    const [logdata, setlogdata] = useState([])
    const [search_time, setsearch_time] = useState('')
    const [search_time2, setsearch_time2] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // จำนวนรายการที่จะแสดงในแต่ละหน้า
    const [totalPages, setTotalPages] = useState(1);
    const [action, setaction] = useState('')
    const [actiondropdown, setactiondropdown] = useState([])
    const [user,setuser] = useState('')
    const [userdropdown, setuserdropdown] = useState([])
    const [Category, setCategory] = useState('')
    const [Categorydropdown, setCategorydropdown] = useState([])
    const [searchname, setsearchname] = useState('')

    useEffect(() => {
        fetchdata()
    }, []);

    const fetchdata = () => {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/warehouselog`),
            axios.get(`${import.meta.env.VITE_API_URL}/getadminuser`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdowncategory`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdownwlaction`)
        ])
        
        .then((res) => {
            setlogdata(res[0].data)
            setuserdropdown(res[1].data)
            setCategorydropdown(res[2].data)
            setactiondropdown(res[3].data)
        })
        .catch((err) => {
            console.log(err)
        });
    }

    useEffect(() => {
        if (logdata.length > 0) {
            const totalPages = Math.ceil(logdata.length / itemsPerPage);
            setTotalPages(totalPages); 
        }
    }, [logdata, itemsPerPage]);

    function clearsearch()
    {
        setsearch_time('')
        setsearch_time2('')
        setsearchname('')
        setaction('')
        setuser('')
        setCategory('')
        fetchdata()
    }

    function searchtime(event) {
        event.preventDefault();
        axios.post(`${import.meta.env.VITE_API_URL}/searchwarehousetime`, 
            {
                search_time: search_time,
                search_time2: search_time2 || search_time,
                action: action || "",
                user_username: user || "",
                category: Category,
                searchname: searchname
            }
        )
        .then((res) => {
            setlogdata(res.data);
            setCurrentPage(1);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const currentLogdata = logdata.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const changePage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    
    return <>
    <div className="p-6 bg-gray-100 min-h-screen">
    <div className='kanit-bold flex flex-row justify-between items-center bg-white p-4 shadow-md rounded-lg'>
        <div></div>
        <h1 className="max-md:text-lg md:text-4xl text-gray-700">ประวัติการนำเข้า</h1>
        <div></div>
    </div>
    <form className="mt-4 p-4 bg-white shadow-md rounded-lg">
    <div className="flex flex-col md:flex-row md:space-x-4 items-start md:items-end">
        <div className="w-full md:w-1/5">
        <label htmlFor="action" className="block text-gray-700 text-sm mb-1">กิจกรรม</label>
        <select id="action" value={action}
            onChange={(e) => setaction(e.target.value)}
            className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">ทั้งหมด</option>
            {actiondropdown.map((action, index) => (
            <option key={index} value={action.WL_Action_Name}>{action.WL_Action_Name}</option>
            ))}
        </select>
        </div>
        <div className="w-full md:w-1/5 max-md:mt-2">
        <label htmlFor="user" className="block text-gray-700 text-sm mb-1">บัญชี</label>
        <select id="user" value={user}
            onChange={(e) => setuser(e.target.value)}
            className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">ทั้งหมด</option>
            {userdropdown.map((user, index) => (
            <option key={index} value={user.user_username}>{user.user_username}</option>
            ))}
        </select>
        </div>
        <div className="w-full md:w-1/5 max-md:mt-2">
        <label htmlFor="date1" className="block text-gray-700 text-sm mb-1">วันที่เริ่มต้น</label>
        <input id="date1" type="date"
            onChange={(e) => setsearch_time(e.target.value)}
            value={search_time}
            className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="w-full md:w-1/5 max-md:mt-2">
        <label htmlFor="date2" className="block text-gray-700 text-sm mb-1">วันที่สิ้นสุด</label>
        <input id="date2" type="date"
            onChange={(e) => setsearch_time2(e.target.value)}
            value={search_time2}
            className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
    </div>
    
    <div className="flex flex-col md:flex-row md:space-x-4 mt-2">
    <div className="w-full md:w-1/3 max-md:mt-2">
        <label className="block text-gray-700 text-sm mb-1">ประเภทอะไหล่</label>
        <select id="category" value={Category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">ทั้งหมด</option>
            {Categorydropdown.map((category, index) => (
            <option key={index} value={category.Category_Name}>{category.Category_Name}</option>
            ))}
        </select>
    </div>
    <div className="w-full md:w-1/3 max-md:mt-2">
        <label className="block text-gray-700 text-sm mb-1">ชื่ออะไหล่</label>
        <input type="text"
        placeholder="ชื่ออะไหล่"
        className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 text-sm leading-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setsearchname(e.target.value)}
        />
    </div>
    <div className="mt-2 md:mt-2 flex items-end">
        <button type="button" onClick={clearsearch}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-blue-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    </div>
    <div className="mt-2 md:mt-2 flex items-end">
        <button type="button" onClick={searchtime}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
            </svg>
        </button>
    </div>
    </div>
    </form> 
    <div className='relative overflow-x-auto shadow-md rounded-2xl mt-6'>
        <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-lg">
            <thead className="text-sm md:text-base text-white bg-blue-500">
                <tr>
                    <th class='text-start px-3 py-2'>วันที่ดำเนินการ</th>
                    <th class='text-start px-3 py-2'>โดย</th>
                    <th class='text-start px-3 py-2'>กิจกรรม</th>
                    <th class='text-end px-6 py-2'>รายละเอียด</th>
                </tr>
            </thead>
        <tbody>
            {
            currentLogdata.map((item, index) => (
                <tr key = {index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                    <td className="text-start px-3 py-2">{new Date(item.WL_Time).toISOString().replace("T", " ").slice(0, 16)}</td>
                    <td class ='text-start px-3 py-2'>{item.user_username}</td>
                    <td class ='text-start px-3 py-2'>{item.WL_Action_Name}</td>
                    <td class ='md:text-end md:px-6 py-2'>{item.WL_Description}</td>
                </tr>
            ))
            }
        </tbody>
    </table>
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
    </div>
    
    </>
}
export default Warehouse_History