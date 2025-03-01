import axios from "axios";
import React, { useEffect, useState } from "react";

function Account()
{
    const [accountdata, setaccountdata] = useState([])
    const [roledata, setroledata] = useState([])
    const [searchname, setsearchname] = useState('')

    //fetch data
    useEffect(() => {
        fetchdata()
    }, [])

    function fetchdata()
    {
        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/user`), // fetch data
            axios.get(`${import.meta.env.VITE_API_URL}/role`) // fetch role
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

    function rolechange(id, role_id)
    {
        setaccountdata(prevData =>
            prevData.map(user =>
                user.user_id === id ? { ...user, role_id: role_id } : user
            )
        );
        //call api
        axios.post(`${import.meta.env.VITE_API_URL}/updaterole`, {
            user_id: id,
            role_id: role_id
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
                searchname: searchname
            }
        )
        .then((res) => {
            console.log(res)
            setaccountdata(res.data)
        })
        .catch((err) => {
            console.log(err)
            fetchdata()
        })
    }

    function delete_func(user_id)
    {
        axios.delete(`${import.meta.env.VITE_API_URL}/deleteaccount/${user_id}`)
        .then((res)=>{
            console.log(res)
            window.location.reload()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    return <>
    <div className="p-6 bg-gray-100 min-h-screen kanit-regular">
        <div className='flex flex-row justify-center items-center bg-white p-4 shadow-md rounded-lg'>
            <h1 className="text-xl font-semibold text-gray-700">จัดการ Account</h1>
        </div>

        <form className="mt-4 p-4 bg-white shadow-md rounded-lg flex space-x-4 items-center">      
        <input className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="name" type="text" placeholder="Username" required onChange={(e) => setsearchname(e.target.value)}/>
            <button type='button' id="search" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" required onClick={() => search_func()}>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                </svg>
            </button>
        </form>
    <div>
    <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-lg">
            <thead className="text-base text-white bg-blue-500">
                <tr>
                    <th class='text-start px-3 py-2'>Username</th>
                    <th class='text-start px-3 py-2'>Role</th>
                    <th class='text-end px-3 py-2'>ลบบัญชี</th>
                </tr>
            </thead>
        <tbody>
            {accountdata.map((item) => (
                <tr key = {item.user_id} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100">
                    <td className ='text-start px-3 py-2'>{item.user_username}</td>
                    <td className="text-start px-3 py-2">
                        <select className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" value={item.role_id} onChange={(e) => rolechange(item.user_id, e.target.value)}>
                            {roledata.map(role => (
                                <option key={role.Role_ID} value={role.Role_ID}>
                                    {role.Role_Name}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className='text-end px-3 py-2'>
                    <button className="px-6 py-4" type="button" onClick={() => delete_func(item.user_id)}>❌</button>
                    </td>
                </tr>
            ))
            }
        </tbody>
    </table>
    </div>
    </div>
    
    </>
}

export default Account