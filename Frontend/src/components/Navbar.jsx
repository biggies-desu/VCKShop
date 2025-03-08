import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import '../index.css';
import { ChevronDownIcon, UserCircleIcon, InboxArrowDownIcon, PowerIcon } from "@heroicons/react/24/solid"; // สำหรับไอคอน

const profileMenuItems = [
{
    label: "Profile",
    icon: InboxArrowDownIcon,
    },
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // ใช้ useState เพื่อควบคุมเมนูมือถือ
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    // ดึง token จาก localStorage และ decode ข้อมูล user
    const token = localStorage.getItem('token');
    let decodeuser = null;
    if (token) {
        try {
            decodeuser = jwtDecode(token);
        } catch (error) {
            console.error("Invalid token", error);
        }
    }

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.replace('/')
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-gray-800">
            <div className="max-w-screen-xl mx-auto flex px-4 py-4 justify-end md:hidden">
                <button onClick={toggleMenu} type="button" className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400 justify-end items-end" aria-label="toggle menu">
                    {!isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </button>
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} absolute inset-x-0 z-30 w-full pt-12 px-6 py-4 transition-all duration-300 ease-in-out bg-gray-800 dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent md:mt-0 md:p-0 md:top-0 md:relative md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center`}>
                <div id="logo" className="flex justify-end md:px-16">
                    <NavLink to="/" className="flex items-end">
                        <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/LogoNavbar.png`} className="h-8 mr-2" alt="Logo" />
                    </NavLink>
                </div>
                <div className="flex space-x-12 flex-col md:flex-row md:mx-6 md:ml-auto md:items-center items-end font-bold kanit-regular">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-yellow-400 " : "text-white hover:text-yellow-400 hover:scale-125 group"
                        }
                    >
                        หน้าแรก
                        <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-yellow-400 group-hover:w-3/6 group-hover:left-0"></span>
                        <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-yellow-400 group-hover:w-3/6 group-hover:right-0"></span>
                    </NavLink>
                    <NavLink
                        to="/estimateprice"
                        className={({ isActive }) =>
                            isActive ? "text-yellow-400" : "text-white hover:text-yellow-400 hover:scale-125 group"
                        }
                    >
                        ประเมินราคาและจองเข้าใช้
                        <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-yellow-400 group-hover:w-3/6 group-hover:left-0"></span>
                        <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-yellow-400 group-hover:w-3/6 group-hover:right-0"></span>
                    </NavLink>
                    <NavLink
                        to="/aboutus"
                        className={({ isActive }) =>
                            isActive ? "text-yellow-400" : "text-white hover:text-yellow-400 hover:scale-125 group"
                        }
                    >
                        ติดต่อสอบถาม
                        <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-0.5 bg-yellow-400 group-hover:w-3/6 group-hover:left-0"></span>
                        <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-0.5 bg-yellow-400 group-hover:w-3/6 group-hover:right-0"></span>
                    </NavLink>
                    {token ? (
                        <>              
                            <div className="relative">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 text-white">
                                    <img src="data:image/png;base64,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" alt="User Avatar" className="h-8 w-8 rounded-full border border-gray-900 p-0.5"/>
                                    <ChevronDownIcon className={`h-5 w-5 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}/>
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg kanit-regular">
                                        <div className="flex flex-col p-2">
                                        {profileMenuItems.map((item, index) => (
                                            <React.Fragment key={index}>
                                                {item.label === "Profile" ? (
                                                    <div className="flex items-center space-x-3 py-2 px-4 text-sm hover:bg-gray-700 rounded-md">
                                                        <item.icon className="h-5 w-5 text-white" />
                                                        <span>ยินดีต้อนรับ {decodeuser?.username}</span>
                                                    </div>
                                                ) : item.label === "My Profile" ? (
                                                <NavLink
                                                    to="/profile"
                                                    className={({ isActive }) =>
                                                        isActive ? "font-bold text-yellow-400" : "hover:scale-110 hover:text-yellow-400"
                                                    }
                                                >
                                                    <div className="flex items-center space-x-3 py-2 px-4 text-sm hover:bg-gray-700 rounded-md">
                                                        <item.icon className="h-5 w-5 text-white" />
                                                        <span>{item.label}</span>
                                                    </div>
                                                </NavLink>
                                                ) : (
                                                <NavLink
                                                    key={index}
                                                    onClick={item.label === "Sign Out" ? handleLogout : closeMenu}
                                                    className={({ isActive }) =>
                                                        isActive ? "text-red-400 hover:text-yellow-400 hover:scale-110" : "font-bold"
                                                    }
                                                >
                                                    <div className="flex items-center space-x-3 py-2 px-4 text-sm hover:bg-gray-700 rounded-md">
                                                        <item.icon className="h-5 w-5 text-white" />
                                                        <span>{item.label}</span>
                                                    </div>
                                                </NavLink>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-4 items-center kanit-regular">
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
                                }>
                                <button className="px-4 py-2 border border-white rounded-md text-white hover:bg-blue-400 hover:text-black">
                                    Log In
                                </button>
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
