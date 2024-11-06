import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'


function Admin_Layout()
{
    return<>
        <div>
            <div id="navbar" class="bg-yellow-300 border-black border">
                <div id="logo" class="flex flex-wrap items-center justify-between space-x-3 rtl:space-x-reverse p-5">
                <img src="images/LogoNavbar.png" class="h-8" alt="Logo" />
                <ul>
                    <li id="logout" class="text-[1.5vw] text-gray-500 hover:text-black list-none" aria-current="page">
                        <NavLink to ='/'>Logout</NavLink>
                    </li>
                 </ul>
            </div>
         </div>
         <div class="flex flex-row">
        <div id ="sidebar"class="bg-blue-100 w-full h-screen min-w-[250px] max-w-[15%] border-black border container">
            <div class="flex flex-col pt-5 px-6">
                <NavLink to ='dashboard'>
                    <div class="rounded-lg block py-3 px-4 md:text-xl sm:text-base hover:bg-blue-300 active:bg-blue-500" value="1">
                        Dashboard
                    </div>
                </NavLink>
                <div class=" mx-4 mt-2 mb-2 border-slate-400 border "></div>
                <NavLink to ='account'>
                    <div class="rounded-lg block py-3 px-4 md:text-xl sm:text-base hover:bg-blue-300 active:bg-blue-500" value="2">
                        Account
                    </div>
                </NavLink>
                <NavLink to ='queue_management'>
                    <div class="rounded-lg block py-3 px-4 md:text-xl sm:text-base hover:bg-blue-300 active:bg-blue-500" value="3">
                        Queue Management
                    </div>
                </NavLink>
                <NavLink to ='warehouse'>
                    <div class="rounded-lg block py-3 px-4 md:text-xl sm:text-base hover:bg-blue-300 active:bg-blue-500" value="4">
                        Warehouse
                    </div>
                </NavLink>
                <div class=" mx-4 mt-2 mb-2 border-slate-400 border "></div>
                <NavLink to ='tax'>
                    <div class="rounded-lg block py-3 px-4 md:text-xl sm:text-base hover:bg-blue-300 active:bg-blue-500" value="5">
                        Tax
                    </div>
                </NavLink>
                <NavLink to ='notify'>
                    <div class="rounded-lg block py-3 px-4 md:text-xl sm:text-base hover:bg-blue-300 active:bg-blue-500" value="6">
                        Notify
                    </div>
                </NavLink>
                <NavLink to ='helppage'>
                    <div class="rounded-lg block py-3 px-4 md:text-xl sm:text-base hover:bg-blue-300 active:bg-blue-500" value="7">
                        Help
                    </div>
                </NavLink>
            </div>
        </div>

        <div id="content"class="bg-gray-200 w-full">{<Outlet/>}</div>

        </div>
        </div>
    </>
}

export default Admin_Layout