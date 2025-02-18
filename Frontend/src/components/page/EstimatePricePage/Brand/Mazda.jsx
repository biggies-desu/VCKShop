import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../Navbar.jsx";
import Footer from "../../../Footer.jsx";

function Mazda() {
    const [selectedYear, setSelectedYear] = useState(null); 
    const [selectedModel, setSelectedModel] = useState(null); 
    const [sparepart, setSparePart] = useState([]); 
    const [categoryoption, setCategoryOption] = useState([]); 
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    const Mazda = [
        {   name: "NEW MAZDA2 HATCHBACK", models: [
                { year: "2024", modelId: 49, image: "https://www.checkraka.com/uploaded/logo/1c/1cf72568d30b75245b34ce72e131ed96.webp" },
                { year: "2019", modelId: 50, image: "src/components/image/NEW MAZDA2 HATCHBACK-2019.jpg" },
                { year: "2014", modelId: 51, image: "src/components/image/NEW MAZDA2 HATCHBACK-2014.jpg" },],},
        {   name: "NEW MAZDA2 SEDAN",models: [
                { year: "2024", modelId: 52, image: "https://mazdakaset-nawamin.com/album/product/large/2eb7373ffe0fe77199da74b46bc52155.jpg" },
                { year: "2019", modelId: 53, image: "src/components/image/NEW MAZDA2 SEDAN-2019.jpg" },
                { year: "2014", modelId: 54, image: "src/components/image/NEW MAZDA2 SEDAN-2014.jpg" },],},
        {   name: "NEW MAZDA2 ROOKIE DRIVE",models: [
                { year: "2022", modelId: 55, image: "https://www.mazda.co.th/globalassets/cars/_1_m2_svp/m2_svp_choose_rookie_1.jpg" },
                { year: "2016", modelId: 56, image: "src/components/image/NEW MAZDA2 ROOKIE DRIVE-2016.jpg" },
                { year: "2012", modelId: 57, image: "src/components/image/NEW MAZDA2 ROOKIE DRIVE-2012.jpg" },],},
    ];

    useEffect(() => {
        if (selectedYear && selectedModel) {
            fetchAllData();
        }
    }, [selectedYear, selectedModel]);

    function fetchAllData() {
        const modelId = Mazda.find((car) => car.name === selectedModel)?.models.find((model) => model.year === selectedYear)?.modelId;

        axios.all([
            axios.get(`${import.meta.env.VITE_API_URL}/sparepart?modelId=${modelId}`),
            axios.get(`${import.meta.env.VITE_API_URL}/getdropdowncategory`),
        ])
        .then((response) => {
            setSparePart(response[0].data);
            setCategoryOption(response[1].data);
        });
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

    function sortByCategory(category) {
        const modelId = Mazda.find((car) => car.name === selectedModel)?.models.find((model) => model.year === selectedYear)?.modelId;

        axios.get(`${import.meta.env.VITE_API_URL}/sparepartcategory?modelId=${modelId}&category=${category}`)
        .then((res) => {setSparePart(res.data);});
    }

    const NavigateEstimate = () => {
        navigate("/estimateprice", { state: { cart } });
    };

    return (
        <>
            <Navbar />
            {selectedModel === null ? (
                <>
                    <div className="flex p-4">
                        <div className="flex items-center">
                            <button onClick={() => NavigateEstimate(null)} className="p-2 rounded">
                                <img src="src/components/image/back-icon.png" className="h-10 w-10" alt="ย้อนกลับ"/>
                            </button>
                        </div>
                        <div className="flex p-4 justify-center items-center w-full">
                            <h1 className="text-3xl font-semibold text-center mb-6">ค้นหารถยนต์จากยี่ห้อ Mazda</h1>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                        {Mazda.map((car, index) => (
                            <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedModel(car.name)}>
                                <img src={car.models[0].image} className="rounded-lg h-48 mb-2" alt={`${car.name}`}/>
                                <h1 className="text-2xl font-bold">{car.name}</h1>
                            </div>
                        ))}
                    </div>
                </>
            ) : selectedYear === null ? (
                <>
                <div className="flex p-4">
                    <div className="flex items-center">
                        <button onClick={() => setSelectedModel(null)} className="p-2 rounded">
                            <img src="src/components/image/back-icon.png" className="h-10 w-10" alt="ย้อนกลับ"/>
                        </button>
                    </div>
                    <div className="flex p-4 justify-center items-center w-full">
                        <h1 className="text-3xl font-semibold text-center mb-6">ค้นหารถยนต์ Mazda รุ่น {selectedModel}</h1>
                    </div>
                </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                        {Mazda.find((car) => car.name === selectedModel)?.models.map((model, index) => (
                            <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedYear(model.year)}>
                                <img src={model.image} className="rounded-lg h-48 mb-2" alt={`${selectedModel} ${model.year}`} />
                                <h1 className="text-2xl font-bold">ปี : {model.year}</h1>
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
                            <h1 className="text-3xl font-semibold text-center mb-6">ค้นหาจากรถยี่ห้อ Mazda รุ่น {selectedModel} ({selectedYear})</h1>
                        </div>
                    </div>
                    <p className="flex text-gray-900 text-2xl font-bold px-96 mb-6 text-nowrap">หมวดหมู่</p>
                    <div className="flex justify-center mb-3 space-x-4">
                        <a class="relative">
                            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded-xl bg-black"></span>
                            <button key="0" onClick={fetchAllData} className="fold-bold relative inline-block rounded-xl border-2 border-black bg-white px-5 py-2 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">ทั้งหมด</button>
                        </a>
                            {categoryoption.map((item, index) => (
                                <a class="relative">
                                    <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded-xl bg-black"></span>
                                    <button key={index + 1} onClick={() => sortByCategory(index + 1)}className="fold-bold relative inline-block rounded-xl border-2 border-black bg-white px-5 py-2 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">{item.Category_Name}</button>
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

export default Mazda;
