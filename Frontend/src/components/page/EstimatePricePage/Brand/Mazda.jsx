import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../Navbar.jsx";
import Footer from "../../../Footer.jsx";
import {Card,Typography,List,ListItem,ListItemPrefix,ListItemSuffix,Chip,Accordion,AccordionHeader,AccordionBody} from "@material-tailwind/react";
import {ChevronRightIcon,ChevronDownIcon,XMarkIcon} from "@heroicons/react/24/outline";

function Mazda() {
    const [selectedYear, setSelectedYear] = useState(null); 
    const [selectedModel, setSelectedModel] = useState(null); 
    const [sparepart, setSparePart] = useState([]); 
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const [quantities, setQuantities] = useState([]);
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    const [open, setOpen] = React.useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // จำนวนรายการที่จะแสดงในแต่ละหน้า
    const [totalPages, setTotalPages] = useState(1);
    const [search_query, setSearchQuery] = useState("");
    const toggleMenu = () => setIsOpen(!isOpen);
    const [isOpen, setIsOpen] = useState(false);
    const [categoryTotal, setCategoryTotal] = useState({});
    const [categories, setCategories] = useState([]);
    const totalCategoryAmount = Object.values(categoryTotal).reduce((sum, val) => sum + val, 0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };
        
    const handlePlus = (id, maxAmount) => {
        setQuantities((prev) => {
            const currentQty = prev[id] || 1;
            return {
                ...prev, [id]: currentQty < maxAmount ? currentQty + 1 : maxAmount,
            };
        });
    };
            
    const handleMinus = (id) => {
        setQuantities((prev) => ({
            ...prev,[id]: prev[id] > 1 ? prev[id] - 1 : 1,
        }));
    };

    const Mazda = [
        {   name: "NEW MAZDA2 HATCHBACK", models: [
                { year: "2024", modelId: 73, image: `${import.meta.env.VITE_IMAGE_BASE_URL}/modelId_73.png` },
                { year: "2019", modelId: 74, image: `${import.meta.env.VITE_IMAGE_BASE_URL}/modelId_74.png` },
                { year: "2014", modelId: 75, image: `${import.meta.env.VITE_IMAGE_BASE_URL}/modelId_75.png` },],},
        {   name: "NEW MAZDA2 SEDAN",models: [
                { year: "2024", modelId: 76, image: `${import.meta.env.VITE_IMAGE_BASE_URL}/modelId_76.png` },
                { year: "2019", modelId: 77, image: `${import.meta.env.VITE_IMAGE_BASE_URL}/modelId_77.png` },
                { year: "2014", modelId: 78, image: `${import.meta.env.VITE_IMAGE_BASE_URL}/modelId_78.png` },],},
        {   name: "NEW MAZDA2 ROOKIE DRIVE",models: [
                { year: "2024", modelId: 79, image: `${import.meta.env.VITE_IMAGE_BASE_URL}/modelId_79.png` },
                { year: "2019", modelId: 80, image: `${import.meta.env.VITE_IMAGE_BASE_URL}/modelId_80.png` },
                { year: "2014", modelId: 81, image: `${import.meta.env.VITE_IMAGE_BASE_URL}/modelId_81.png` },],},
    ];

    useEffect(() => {
        if (selectedYear && selectedModel) {
            fetchAllData();
        }
    }, [selectedYear, selectedModel]);
    
     useEffect(() => {
        const totalPages = Math.ceil(sparepart.filter(item => item.SparePart_Amount > 0).length / itemsPerPage);
        setTotalPages(totalPages);
    }, [sparepart, itemsPerPage]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/categories`)
            .then((response) => {
                setCategories(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    useEffect(() => {
        if (selectedModel && selectedYear) {
            const modelId = Mazda.find((car) => car.name === selectedModel)
                ?.models.find((model) => model.year === selectedYear)?.modelId;
    
            if (!modelId) return;
    
            const subcategoryNames = categories.flatMap(category => category.subcategories);
            if (subcategoryNames.length === 0) return;
    
            axios.get(`${import.meta.env.VITE_API_URL}/categorytotal`, {
                params: { modelId, sparePartNames: subcategoryNames.join(",") }
            })
            .then((response) => {
                console.log("Category Totals Response:", response.data);
    
                if (Array.isArray(response.data)) {
                    const subCategoryTotals = response.data.reduce((acc, item) => {
                        const key = item.Sub_Category_Name === "Uncategorized"
                            ? `Uncategorized_${item.Category_ID}`
                            : item.Sub_Category_Name;
                        acc[key] = item.TotalAmount;
                        return acc;
                    }, {});
            
                    // Ensure "Uncategorized" exists even if not in API response
                    if (!subCategoryTotals["Uncategorized"]) {
                        subCategoryTotals["Uncategorized"] = 0;
                    }
            
                    setCategoryTotal(subCategoryTotals);
                    console.log("Updated SubCategory Totals:", subCategoryTotals);
            
                }
            })
            .catch((error) => {
                console.error("Error fetching category totals:", error);
            });
        }
    }, [selectedModel, selectedYear, categories]);
    
    
    function fetchAllData() {
        const modelId = Mazda.find((car) => car.name === selectedModel)?.models.find((model) => model.year === selectedYear)?.modelId;
    
        axios.get(`${import.meta.env.VITE_API_URL}/sparepart?modelId=${modelId}`)
            .then((response) => {
                setSparePart(response.data); 
                setCurrentPage(1);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function AddToCart(val) {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex((item) => item.SparePart_ID === val.SparePart_ID);
            const selectedQty = quantities[val.SparePart_ID] || 1; // ค่าจำนวนที่ผู้ใช้เลือก
    
            if (existingItemIndex !== -1) {
                // ถ้ามีสินค้าชนิดนี้อยู่ในตะกร้าแล้ว ให้เพิ่มจำนวน
                return prevCart.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + selectedQty }
                        : item
                );
            } else {
                // ถ้ายังไม่มีในตะกร้า เพิ่มใหม่
                return [...prevCart, { ...val, quantity: selectedQty }];
            }
        });
    
        setQuantities((prev) => ({
            ...prev,
            [val.SparePart_ID]: 1,
        }));
    }

    function sortByCategory(category, keyword) {
        const modelId = Mazda.find((car) => car.name === selectedModel)?.models.find((model) => model.year === selectedYear)?.modelId;
    
        axios.get(`${import.meta.env.VITE_API_URL}/sparepartcategory?modelId=${modelId}&category=${category}`)
            .then((res) => {
                const filteredData = res.data.filter(item => item.SparePart_Name.includes(keyword));
                setSparePart(filteredData);
                setCurrentPage(1);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const search = (event) => {
        event.preventDefault();
        if (search_query.trim() === "") return; // ถ้าไม่มีคำค้นหาก็ไม่ต้องส่ง

        console.log("search : ", search_query); // ตรวจสอบคำค้นหาใน console

        axios.post(`${import.meta.env.VITE_API_URL}/searchquery`, { search_query })
            .then((res) => {
                console.log(res.data);
                setSparePart(res.data);
                setCurrentPage(1);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const NavigateEstimate = () => {
        navigate("/estimateprice", { state: { cart } });
    };

    // ฟังก์ชันเพื่อแสดงผลข้อมูลในหน้าแต่ละหน้า
    const filteredSpareParts = Array.isArray(sparepart) ? sparepart.filter(item => item.SparePart_Amount > 0): [];
    const currentSpareParts = filteredSpareParts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // ฟังก์ชันการเปลี่ยนหน้า
    const changePage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <>
            <Navbar />
            {selectedModel === null ? (
                <>
                <div className="bg-orange-100 pb-60">
                    <div className="flex p-4 ">
                        <div className="flex items-center">
                            <button onClick={() => NavigateEstimate(null)} className="p-2 rounded">
                                <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/back-icon.png`} className="h-10 w-10" alt="ย้อนกลับ"/>
                            </button>
                        </div>
                        <div className="flex p-4 justify-center items-center w-full">
                            <h1 className="text-3xl font-semibold text-center mb-6">ค้นหารถยนต์จากยี่ห้อ Mazda</h1>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                        {Mazda.map((car, index) => (
                            <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedModel(car.name)}>
                                <img src={car.models[0].image} className="rounded-lg h-48 mb-2" alt={`${car.name}`}/>
                                <h1 className="text-2xl font-bold">{car.name}</h1>
                            </div>
                        ))}
                    </div>
                </div>
                </>
            ) : selectedYear === null ? (
                <>
                <div className="bg-orange-100 pb-96">
                <div className="flex p-4">
                    <div className="flex items-center">
                        <button onClick={() => setSelectedModel(null)} className="p-2 rounded">
                            <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/back-icon.png`} className="h-10 w-10" alt="ย้อนกลับ"/>
                        </button>
                    </div>
                    <div className="flex p-4 justify-center items-center w-full">
                        <h1 className="text-3xl font-semibold text-center mb-6">ค้นหารถยนต์ Mazda รุ่น {selectedModel}</h1>
                    </div>
                </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                        {Mazda.find((car) => car.name === selectedModel)?.models.map((model, index) => (
                            <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedYear(model.year)}>
                                <img src={model.image} className="rounded-lg h-48 mb-2" alt={`${selectedModel} ${model.year}`} />
                                <h1 className="text-2xl font-bold">ปี : {model.year}</h1>
                            </div>
                        ))}
                    </div>
                </div>
                </>
            ) : (
                <div className="bg-orange-100 mx-auto py-10">
                    <div className="flex p-4">
                        <div className="flex items-center">
                            <button onClick={() => setSelectedYear(null)} className="p-2 rounded">
                                <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/back-icon.png`} className="h-10 w-10" alt="ย้อนกลับ"/>
                            </button>
                        </div>
                        <div className="flex p-4 justify-center items-center w-full">
                            <h1 className="text-3xl font-semibold text-center mb-6">ค้นหาจากรถยี่ห้อ Mazda รุ่น {selectedModel} ({selectedYear})</h1>
                        </div>
                    </div>
                    <div className="lg:flex lg:space-x-8 -my-5">
                        <div className="z-40 flex items-start mx-10 lg:hidden justify-end flex-col sm:flex-row max-sm:mt-20 max-sm:justify-center max-sm:items-center">
                            <button variant="text" size="lg" onClick={toggleMenu}>
                                {isOpen ? (
                                    <div className="h-8 w-8 stroke-2" />
                                ) : (
                                    <button className="h-8 w-36 stroke-2 rounded-full border-2 border-gray-400 bg-white flex items-center justify-center">ตัวกรอง
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                        </svg>
                                    </button>
                                )}
                            </button>
                        </div>
                        <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden absolute inset-x-0 h-full w-full max-w-[20rem] z-30 px-6 py-4 transition-all duration-300 ease-in-out lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:w-auto lg:translate-x-0 lg:items-center`}>
                            <div className="fixed z-[9999] pointer-events-auto bg-white box-border w-full shadow-2xl shadow-blue-gray-900/10 top-0 left-0"
                                style={{ maxWidth: "300px", height: "100vh", transform: "none" }}>
                                <div className="flex justify-end mr-3 mt-3">
                                    {isOpen && (
                                        <button onClick={toggleMenu}>
                                            <XMarkIcon className="h-8 w-8 stroke-2" />
                                        </button>
                                    )}
                                </div>
                                <Card className="bg-white opacity-80 h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                    <div className="mb-2 flex items-center gap-4 p-4">
                                        <img src="https://docs.material-tailwind.com/img/logo-ct-dark.png" alt="brand" className="h-8 w-8" />
                                        <Typography variant="h5" color="blue-gray">Category</Typography>
                                    </div>
                                    <div className="relative p-2">
                                        <input value={search_query} type="text" id="search" className="peer w-full px-4 py-2 text-base bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder=" " onChange={e => setSearchQuery(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { search(e); } }} />
                                        <label className="absolute left-4 -top-4 text-gray-400 opacity-80 text-base transition-all duration-100 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-15px] peer-focus:text-sm peer-focus:text-blue-500">Search...</label>
                                        <svg id="search" onClick={search} className="absolute right-4 top-1/2 transform -translate-y-1/2 size-6"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                    </div>
                                    <List>
                                        <ListItem className="hover:text-yellow-800 hover:scale-110">
                                            <div onClick={fetchAllData}>สินค้าทั้งหมด</div>
                                            <ListItemSuffix>
                                                <Chip value={`[${totalCategoryAmount}]`} size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                                            </ListItemSuffix>
                                        </ListItem>
                                        {categories.map((category, index) => (
                                            <Accordion key={category.id} open={open === index + 1} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`} />}>
                                                <ListItem className="hover:text-yellow-800 hover:scale-110">
                                                    <AccordionHeader className="text-base font-normal" onClick={() => handleOpen(index + 1)}>
                                                        <ListItemPrefix className="hover:text-yellow-800 hover:scale-110">
                                                            <img src={category.icon} className="h-5 w-5" />
                                                        </ListItemPrefix>
                                                        <Typography color="blue-gray" className="mr-auto font-normal">
                                                            {category.name}
                                                        </Typography>
                                                    </AccordionHeader>
                                                </ListItem>
                                                <AccordionBody className="py-1">
                                                    <List>
                                                        <ListItem className="hover:text-yellow-800 hover:scale-110" onClick={() => sortByCategory(category.categoryId, "")}>
                                                            <ListItemPrefix>
                                                                <ChevronRightIcon className="h-3 w-5 ml-3" />
                                                            </ListItemPrefix>
                                                            {category.name}ทุกยี่ห้อ
                                                            <Chip value={`[${category.subcategories.reduce((total, sub) => total + (categoryTotal[sub] || 0), 0) + (categoryTotal[`Uncategorized_${category.categoryId}`] || 0)}]`} size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                                                        </ListItem>
                                                        {category.subcategories.map((sub, i) => (
                                                            <ListItem className="hover:text-yellow-800 hover:scale-110" key={i} onClick={() => sortByCategory(category.categoryId, sub)}>
                                                                <ListItemPrefix>
                                                                    <ChevronRightIcon className="h-3 w-5 ml-3" />
                                                                </ListItemPrefix>
                                                                {sub}
                                                                <Chip value={`[${categoryTotal[sub] || 0}]`} size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </AccordionBody>
                                            </Accordion>
                                        ))}
                                    </List>
                                </Card>
                            </div>
                        </div>
                        <div className="lg:flex hidden">
                            <Card className="bg-white opacity-80 h-fit w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
                                <div className="mb-2 flex items-center gap-4 p-4">
                                    <img src="https://docs.material-tailwind.com/img/logo-ct-dark.png" alt="brand" className="h-8 w-8" />
                                    <Typography variant="h5" color="blue-gray">Category</Typography>
                                </div>
                                <div className="relative p-2">
                                    <input value={search_query} type="text" id="search" className="peer w-full px-4 py-2 text-base bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder=" " onChange={e => setSearchQuery(e.target.value)} onKeyPress={(e) => {if (e.key === 'Enter') {search(e);}}}></input>
                                    <label className="absolute left-4 -top-4 text-gray-400 opacity-80 text-base transition-all duration-100 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-[-15px] peer-focus:text-sm peer-focus:text-blue-500">Search...</label>
                                    <svg id="search" onClick={search} className="absolute right-4 top-1/2 transform -translate-y-1/2 size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </div>
                                <List>
                                    <ListItem className="hover:text-yellow-800 hover:scale-110">
                                        <div onClick={fetchAllData}>สินค้าทั้งหมด</div>
                                        <ListItemSuffix>
                                            <Chip value={`[${totalCategoryAmount}]`} size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                                        </ListItemSuffix>
                                    </ListItem>
                                    {categories.map((category, index) => (
                                        <Accordion key={category.id} open={open === index + 1} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}/>}>
                                            <ListItem className="hover:text-yellow-800 hover:scale-110">
                                                <AccordionHeader className="text-base font-normal" onClick={() => handleOpen(index + 1)}>
                                                    <ListItemPrefix className="hover:text-yellow-800 hover:scale-110">
                                                        <img src={category.icon} className="h-5 w-5"/>
                                                    </ListItemPrefix>
                                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                                        {category.name}
                                                    </Typography>
                                                </AccordionHeader>
                                            </ListItem>
                                            <AccordionBody className="py-1">
                                                <List>
                                                    <ListItem className="hover:text-yellow-800 hover:scale-110" onClick={() => sortByCategory(category.categoryId, "")}>
                                                        <ListItemPrefix>
                                                            <ChevronRightIcon className="h-3 w-5 ml-3"/>
                                                        </ListItemPrefix>
                                                        {category.name}ทุกยี่ห้อ
                                                        <Chip value={`[${category.subcategories.reduce((total, sub) => total + (categoryTotal[sub] || 0), 0) +(categoryTotal[`Uncategorized_${category.categoryId}`] || 0)}]`} size="sm" variant="ghost" color="blue-gray" className="rounded-full"/></ListItem>
                                                    {category.subcategories.map((sub, i) => (
                                                        <ListItem className="hover:text-yellow-800 hover:scale-110" key={i} onClick={() => sortByCategory(category.categoryId, sub)}>
                                                            <ListItemPrefix>
                                                                <ChevronRightIcon className="h-3 w-5 ml-3"/>
                                                            </ListItemPrefix>
                                                            {sub}
                                                            <Chip value={`[${categoryTotal[sub] || 0}]`} size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </AccordionBody>
                                        </Accordion>
                                    ))}
                                </List>
                            </Card>
                        </div>
                        <div className="flex container px-6 py-10">
                            <div class="absolute z-10 -mt-20 flex flex-wrap gap-6 w-fit max-sm:-mt-36">
                                <a class="relative">
                                    <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                                    <button onClick={NavigateEstimate} className="flex fold-bold relative h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg> 
                                            สินค้าในตะกร้า : {totalQuantity} ชิ้น
                                    </button>
                                </a>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 content-start">
                                {currentSpareParts.map((val) => (
                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 flex flex-col">
                                        <span>
                                            <img src={`${import.meta.env.VITE_API_URL}/uploads/${val.SparePart_Image}`} alt={val.SparePart_Name} className="w-full h-56 object-cover"/>
                                        </span>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h2 className="text-xl font-bold text-gray-800 mb-2">{val.SparePart_Name}</h2>
                                                <p className="text-gray-400 text-sm mb-4">รหัสสินค้า {val.SparePart_ProductID}</p>
                                                <p className="text-cyan-400 mb-3">{val.SparePart_Description}</p>
                                            <div className="flex justify-between items-center mb-6">
                                                <p className="text-red-500 text-lg font-semibold">* {Number(val.SparePart_Price).toLocaleString('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2})} บาท</p>
                                                <p className="text-sm text-gray-500">คงเหลือ: {val.SparePart_Amount} ชิ้น</p>
                                            </div>
                                            <div className="flex flex-col mt-auto">
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-500" onClick={() => handleMinus(val.SparePart_ID)}>-</button>
                                                        <input className="border text-center w-16 p-2 rounded" type="number" min="1" max={val.SparePart_Amount} value={quantities[val.SparePart_ID] || 1} onChange={(e) => {const newQty = parseInt(e.target.value) || 1;const finalQty = newQty > val.SparePart_Amount ? val.SparePart_Amount : newQty;setQuantities((prev) => ({...prev,[val.SparePart_ID]: finalQty,}));}}/>
                                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-500" onClick={() => handlePlus(val.SparePart_ID, val.SparePart_Amount)}>+</button>
                                                </div>
                                                <button className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => AddToCart(val)}>เพิ่มไปยังตะกร้า</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> 
                    </div>
                    <ul class="flex space-x-5 justify-center font-[sans-serif]">
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
            )}
            <Footer />
        </>
    );
}
export default Mazda;