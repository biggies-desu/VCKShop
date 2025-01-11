import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../Navbar.jsx";
import Footer from "../../..//Footer.jsx";

function City() {
    const [selectedYear, setSelectedYear] = useState(null); 
    const [sparepart, setSparePart] = useState([]); 
    const [categoryoption, setcategoryoption] = useState([]); 
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    const cityModels = [
        {
            year: "2024",
            modelId: 1,
            image: "src/components/image/City-2024.jpg",
        },
        {
            year: "2019",
            modelId: 2,
            image: "src/components/image/City-2019.jpg",
        },
        {
            year: "2014",
            modelId: 3,
            image: "src/components/image/City-2014.jpg",
        },
    ];

    useEffect(() => {
        if (selectedYear) {
            fetchalldata();
        }
    }, [selectedYear]);

    function fetchalldata() {
        const modelId = cityModels.find((model) => model.year === selectedYear)?.modelId;

        axios.all([
            axios.get(`http://localhost:5000/sparepart?modelId=${modelId}`),
            axios.get(`http://localhost:5000/api/getdropdowncategory`),
        ])
        .then((response) => {
            setSparePart(response[0].data);
            setcategoryoption(response[1].data)
            console.log(response)
        })
    }


    function AddToCart(val) {
        setCart((prevCart) => {
            const exists = prevCart.some((cartItem) => cartItem.SparePart_ID === val.SparePart_ID);
            if (!exists) {
                return [...prevCart, val];
            }
            return prevCart;
        });
    }

    function sortbycategory(category) {
        const modelId = cityModels.find((model) => model.year === selectedYear)?.modelId; 

        axios.get(`http://localhost:5000/sparepartcategory?modelId=${modelId}&category=${category}`)
        .then((res) => { setSparePart(res.data)
        console.log(res)})
    }

    const NavigateEstimate = () => {
        navigate("/estimateprice", { state: { cart } });
    };

    return (
        <>
            <Navbar />
            {selectedYear === null ? (
                <>
                <div className="flex p-4">
                    <div className="flex items-center">
                        <Link to="/estimateprice">
                            <button class="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group border-2 border-black" type="button">
                                <div class="bg-green-400 rounded-xl h-11 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[180px] z-10 duration-500"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                                        <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000"></path>
                                        <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000"></path>
                                    </svg>
                                </div>
                                <p class="translate-x-2">Go Back</p>
                            </button>
                        </Link>
                    </div>
                    <div className="flex p-4 justify-center items-center w-full">
                        <h1 className="text-3xl font-semibold text-center mb-6">ค้นหาจากรถยี่ห้อ Honda รุ่น City</h1>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-4">
                    {cityModels.map((model, index) => (
                        <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedYear(model.year)}>
                            <img src={model.image} className="rounded-lg h-48 mb-2" alt={`Honda City ${model.year}`}/>
                            <h2 className="text-2xl font-bold">ปี : {model.year}</h2>
                        </div>
                    ))}
                </div>
            </>
            ) : (
                <div className="container mx-auto px-4 pb-96">
                    <div className="flex p-4">
                        <div className="flex items-center">
                            <button onClick={() => setSelectedYear(null)} className="p-2 rounded">
                                <img src="src/components/image/back-icon.png" className="h-10 w-10" alt="ย้อนกลับ"/>
                            </button>
                        </div>
                        <div className="flex p-4 justify-center items-center w-full">
                            <h1 className="text-3xl font-semibold text-center mb-6">ค้นหาจากรถยี่ห้อ Honda รุ่น City ({selectedYear})</h1>
                        </div>
                    </div>
                    <div className="flex justify-center mb-3 space-x-4">
                        <a class="relative">
                            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded-xl bg-black"></span>
                            <button key="0" onClick={fetchalldata} className="fold-bold relative inline-block rounded-xl border-2 border-black bg-white px-5 py-2 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">ทั้งหมด</button>
                        </a>
                            {categoryoption.map((item, index) => (
                                <a class="relative">
                                    <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded-xl bg-black"></span>
                                    <button key={index + 1} onClick={() => sortbycategory(index + 1)}className="fold-bold relative inline-block rounded-xl border-2 border-black bg-white px-5 py-2 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">{item.Category_Name}</button>
                                </a>
                            ))}
                    </div>
                    <div class="flex flex-wrap gap-6">
                        <a class="relative">
                            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                            <button onClick={NavigateEstimate} class="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">ดูผลการประเมินราคา ({cart.length} รายการ)</button>
                        </a>
                    </div>
                    <div className="grid lg:grid-cols-4 gap-4 m-10">
                        {sparepart.map((val) => (
                            <div className="bg-white p-4 rounded shadow">
                            <span>
                                <img src={`http://localhost:5000/uploads/${val.SparePart_Image}`} alt={val.SparePart_Name} width="200" height="100" />
                            </span>
                            <h2 className="text-lg font-bold">{val.SparePart_Name}</h2>
                            <p className="text-gray-400 mb-3">รหัสสินค้า {val.SparePart_ProductID}</p>
                            <p className="text-cyan-400 mb-3">{val.SparePart_Description}</p>
                            <div className="flex items-center text-red-500">
                                <span>*</span><p className="text-gray-700 ml-1">{val.SparePart_Price} บาท</p>
                            </div>
                            <button className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => AddToCart(val)}>เพิ่มไปยังตะกร้า</button>
                        </div>
                        ))}
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default City;