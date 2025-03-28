import React, { useEffect, useState } from "react";
import Navbar from "../Navbar.jsx"
import Footer from "../Footer.jsx"
import axios from "axios";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';

function Queue()
{
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [CarRegistration, setCarRegistration] = useState('');
    const [errorFullName, setErrorFullName] = useState('');
    const [errorPhoneNumber, setErrorPhoneNumber] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorDate, setErrorDate] = useState('');
    const [errorTime, setErrorTime] = useState('');
    const [errorCarRegistration, setErrorCarRegistration] = useState('');
    const [errorModel, setErrorModel] = useState('')
    const [isModalOpen, setIsModalOpen] = useState('');
    const [details, setDetails] = useState(``);
    const [disabledTimes, setDisabledTimes] = useState([]);
    const [province, setprovince] = useState('')
    const [provincedropdown, setprovincedropdown] = useState([])
    const [carOptions, setCarOptions] = useState([]);
    const [carRegisSelected, setCarRegisSelected] = useState(null);
    const [modelOptions, setModelOptions] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [isModalConfirmedOpen, setisModalConfirmOpen] = useState(false); //init ว่าลงผ่านยัง
    const openConfirmedModal = () => setisModalConfirmOpen(true)
    const closeConfirmedModal = () => setisModalConfirmOpen(false)

    const token = localStorage.getItem('token')
    const userid = jwtDecode(token).user_id

    const location = useLocation();
    const { cart, selectedServices, modelId } = location.state || { cart: [], selectedServices: [] };

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);  // กำหนดวันที่ใหม่
        setTime("");    // รีเซ็ตเวลาเมื่อเลือกวันใหม่
    };

    

    const handleTimeChange = (selectedTime) => {
        setTime(selectedTime);
        // ตรวจสอบวันที่และเวลาที่เลือก
        if (date && selectedTime) {
            axios.post(`${import.meta.env.VITE_API_URL}/checkQueue`, { date, time: selectedTime })
                .then((res) => {
                    const { queueCount, isFull } = res.data;
                    // ถ้าเวลานั้นเต็มหรือจองมากกว่า 3 คน จะทำให้เวลานั้นไม่สามารถเลือกได้
                    if (isFull || queueCount >= 3) {
                        setDisabledTimes(prevDisabledTimes => [...prevDisabledTimes, selectedTime]);
                    } else {
                        // หากเวลานั้นไม่เต็มแล้ว ให้ลบออกจาก disabledTimes
                        setDisabledTimes(prevDisabledTimes => prevDisabledTimes.filter(time => time !== selectedTime));
                    }
                    console.log(disabledTimes)
                })
                .catch((err) => console.log(err));
        }
    };

    useEffect(() => {
        if (!modelId) {
          axios.get(`${import.meta.env.VITE_API_URL}/getdropdownmodel`)
            .then((res) => {
              const options = res.data.map((item) => ({
                label: `${item.Brand_Name} ${item.Model_Name} ${item.Model_Year}`,
                value: item.Model_ID,
              }));
              setModelOptions(options);
            })
            .catch(err => console.log(err));
        }
      }, []);

    useEffect(() => {
        const modelidToUse = modelId || 'null'; // ถ้าไม่มี modelId ให้ส่ง 'null'
        axios.get(`${import.meta.env.VITE_API_URL}/getcarregisbyuser/${userid}/${modelidToUse}`)
          .then((res) => {
            const options = res.data.map((item) => ({
              label: `${item.Car_RegisNum}`,
              value: item.Car_RegisNum,
              province: item.Province_Name,
              modelId: item.Model_ID
            }));
            setCarOptions(options);
          })
          .catch(err => console.log(err));
      }, []);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/getdropdownprovince`)
          .then((res) => {
            setprovincedropdown(res.data);
          })
          .catch((err) => console.log(err));
    }, []);
    // for province dropdown
    const provincesoptions = provincedropdown.map((p) => ({
        label: p.Province_Name,
        value: p.Province_Name,
    }));

    useEffect(() => {
        //fetch userid so i can put it in input
        console.log(cart)
        console.log(selectedServices)
        console.log(modelId)
        cart.map(item => console.log(`${item.SparePart_Name} - Quantity: ${item.quantity}`));

            axios.get(`${import.meta.env.VITE_API_URL}/getcurrentprofile/${userid}`)
            .then((res) => {
                const data = res.data[0]
                const fn = `${data.User_Firstname || ''} ${data.User_Lastname || ''}`.trim();
                setFullName(fn);
                setPhoneNumber(data.User_Telephone)
                setEmail(data.User_Email?.trim() || '')
                prevdetail()
            })
            .catch((err) => console.log(err))
            
    if (date) {
        axios.post(`${import.meta.env.VITE_API_URL}/checkQueue`, { date })
            .then((res) => {
                const bookedTimes = res.data; 
                const disabled = [];
    
                // ตรวจสอบว่าเวลาที่เต็มมีหรือไม่
                for (const time in bookedTimes) {
                    if (bookedTimes[time] >= 3) {
                        disabled.push(time);
                    }
                }
                setDisabledTimes(disabled);
                console.log(disabledTimes)
            })
            .catch((err) => console.log(err));
        }
    }, [date]);
    

    const handleSubmit = (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้า

        if (disabledTimes.includes(time)) {
            setErrorTime("เวลานี้เต็มแล้ว กรุณาเลือกเวลาอื่น");
            return;
        }
        console.log(date)
        console.log(time)
        

        if (!fullName || fullName.trim().split(" ").length < 2) {
            setErrorFullName("กรุณากรอกชื่อและนามสกุลให้ครบถ้วน");
            return;
        } else {
            setErrorFullName('');
        }

        if (!phoneNumber) {
            setErrorPhoneNumber("กรุณากรอกเบอร์โทรศัพท์");
        } else if (phoneNumber) {
            setErrorPhoneNumber('');
        }

        // if (!email) {
        //     setErrorEmail("กรุณากรอกอีเมล");
        // } else if (email) {
        //     setErrorEmail('');
        // }
        
        if (!date) {
            setErrorDate("กรุณากรอกวันที่จอง");
        } else if (date) {
            setErrorDate('');
        }

        if (!time) {
            setErrorTime("กรุณากรอกเวลาที่จอง");
        } else if (time) {
            setErrorTime('');
        }

        if (!CarRegistration) {
            setErrorCarRegistration("กรุณากรอกเลขทะเบียนรถ");
        } else if (CarRegistration) {
            setErrorCarRegistration('');
        }

        if (!modelId && !selectedModel) {
            setErrorModel("กรุณาเลือกรุ่นและยี่ห้อของรถ");
        } else if (!selectedModel) {
            setErrorModel('');
        }


        // ตรวจสอบว่าไม่มีข้อผิดพลาดในฟิลด์ทั้งหมดหรือไม่
        if (fullName && phoneNumber && date && time && CarRegistration && (modelId || selectedModel?.value) && province) {
            openModal();
        }
    };

    function prevdetail() {
        let details = [...cart.map(item => `${item.SparePart_Name} (จำนวน : ${item.quantity})`),...selectedServices.map(service => `${service.Service_Name}`)].join("\n").trim();
        setDetails(details.replace(/\n\s*\n/g, '\n'));  // แก้ไขช่องว่างระหว่างบรรทัด
    }

    function submitqueue()
    {
        event.preventDefault()
        closeModal();

        //split fullname to first+last
        const namearray  = fullName.split(" ");
        const firstname = namearray[0]
        const lastname = namearray[1]

        //send data to db
        axios.post(`${import.meta.env.VITE_API_URL}/addqueue`, 
            {
                firstname: firstname,
                lastname: lastname,
                phoneNumber: phoneNumber,
                email: email,
                CarRegistration: CarRegistration,
                date: date,
                time: time,
                details: details,
                userID: userid,
                province: province,
                //post a quantity to this api
                cart: cart.map(item => ({
                    SparePart_ID: item.SparePart_ID,
                    quantity: item.quantity
                })),
                selectedServices: selectedServices.map(item => ({
                    Service_ID: item.Service_ID,
                    Service_Name: item.Service_Name,
                    Service_Price: item.Service_Price,
                })),
                modelId: modelId || selectedModel?.value
            }
        )
        .then((res) =>{
            console.log(res)
            if(res.status === 200)
            {
                openConfirmedModal();
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    function closeconfirmmodal()
    {
        closeConfirmedModal();
        window.location.reload();
    }

    return <>
    <Navbar />
    <div className="bg-gray-100 p-6 shadow-md mx-auto w-full">
    <h1 className="text-3xl font-semibold text-center">เครื่องมือสำหรับการจองเข้าใช้บริการอู่</h1>

    <div className="md:flex">
        <div className="md:w-1/3 p-6">
            <h2 className="text-lg font-semibold mb-4">ระบุวันที่ต้องการจอง</h2>
            <label className="block text-gray-700 mb-2" for="date"> วันที่จอง </label>
            <input className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="date" min={new Date().toISOString().split("T")[0]} onChange={(e) => handleDateChange(e.target.value)}></input>
            {errorDate && <p className="text-red-500 text-sm mt-2">{errorDate}</p>}
        </div>

        <div className="md:w-2/3 p-6">
            <h2 className="text-lg font-semibold mb-4">ระบุเวลาที่ต้องการจอง</h2>
            <label className="block text-gray-700 mb-2" for="time"> เวลา </label>
            <select id="time" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={time} onChange={(e) => handleTimeChange(e.target.value)}>
                <option value="" disabled selected>--:--</option>
                {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(timeSlot => (
                    <option key={timeSlot} value={timeSlot} disabled={disabledTimes.includes(timeSlot)}>
                        {timeSlot} {disabledTimes.includes(timeSlot) ? "(ถูกจองเต็มแล้ว)" : ""}
                    </option>
                ))}
            </select>
            {errorTime && <p className="text-red-500 text-sm mt-2">{errorTime}</p>}
        </div>
    </div>

    <div class="mt-4 bg-white p-6 rounded shadow">
        <h2 class="md:text-[2vw] font-semibold mb-4">รายละเอียดผู้จอง</h2>
            <form class="space-y-8" onSubmit={handleSubmit}>
                <div class="md:flex md:space-x-4">
                    <div class="md:w-1/2">
                        <label class="block text-sm font-normal">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
                        <input type="FullName" class="w-full border border-gray-300 p-2 rounded" placeholder="ชื่อ-นามสกุล" value={fullName} onChange={(e) => setFullName(e.target.value)}></input>
                        {errorFullName && <p className="text-red-500 text-sm mt-2">{errorFullName}</p>}
                    </div>
                    <div class="md:w-1/2">
                        <label class="block text-sm font-normal max-md:mt-5">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
                        <input type="tel" inputMode="numeric" class="w-full border border-gray-300 p-2 rounded" placeholder="เบอร์โทรศัพท์" value={phoneNumber}
                            maxlength="10" onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, ''); 
                                setPhoneNumber(value);
                            }}>
                        </input>
                        {errorPhoneNumber && <p className="text-red-500 text-sm mt-2">{errorPhoneNumber}</p>}
                    </div>
                </div>
                <div class="md:flex md:space-x-4">
                    <div class="md:w-1/4">
                        <label class="block text-sm font-normal max-md:mt-5">อีเมล <span class="text-red-500 text-xs">(ไม่บังคับ)</span></label>
                        <input type="email" class="w-full border border-gray-300 p-2 rounded" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    {!modelId && (
                        <div className="md:w-1/3">
                            <label>เลือกรุ่นรถ</label>
                            <Select options={modelOptions} value={selectedModel}
                            onChange={(option) => setSelectedModel(option)} isDisabled={carRegisSelected && carRegisSelected.modelId}
                            placeholder="เลือกรุ่นรถ..."/>
                            {errorModel && <p className="text-red-500 text-sm mt-2">{errorModel}</p>}
                        </div>
                        )}
                    <div className="md:w-1/5">
                        <label className="block text-sm font-normal max-md:mt-5">
                            เลขทะเบียนรถ <span className="text-red-500 text-xs">*</span>
                        </label>
                        <CreatableSelect
                            options={carOptions}
                            value={carRegisSelected}
                            onChange={(selectedOption) => {
                            setCarRegisSelected(selectedOption);
                            setCarRegistration(selectedOption?.value || "");
                            if (selectedOption?.province) setprovince(selectedOption.province);
                            if (selectedOption?.modelId) {
                                setSelectedModel(modelOptions.find((m) => m.value === selectedOption.modelId));
                            } else {
                                setSelectedModel(null);
                            }
                            }}
                            onCreateOption={(inputValue) => {
                            const newOption = { label: inputValue, value: inputValue };
                            setCarOptions([...carOptions, newOption]);
                            setCarRegisSelected(newOption);
                            setCarRegistration(inputValue);
                            }}
                            isClearable
                            placeholder="เลือกหรือกรอกทะเบียนรถ"
                        />
                        {errorCarRegistration && <p className="text-red-500 text-sm mt-2">{errorCarRegistration}</p>}
                        </div>
                    <div class="md:w-1/5">
                        <label className="block text-sm font-normal max-md:mt-5">จังหวัด</label>
                        <Select options={provincesoptions} value={province ? { label: province, value: province } : null}
                            onChange={(selectedOption) => setprovince(selectedOption ? selectedOption.value : "")}
                            placeholder="เลือกจังหวัด..." isClearable/>
                    </div>
                </div>

                <div class="md:w-2/3 mt-4 md:mt-0">
                    <label className="block text-sm font-normal">รายละเอียด</label>
                    <textarea type="text" id="detailed" class="w-full border border-gray-300 p-2 min-h-10 rounded"
                    rows="4" value={details} onChange={(e) => setDetails(e.target.value)}/>
                </div>
                    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">ยืนยันการจอง</button>
            </form>
        </div>
    </div>

    {isModalOpen && ( //แสดงผล Modal confirm
    <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center px-4">
        <div className="relative mx-auto shadow-xl rounded-md bg-white max-w-md w-full">
            <div className="p-6 pt-0 text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mt-5 mb-4">ข้อมูลการจองของคุณ</h3>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md text-left mb-4">
                    <p className="text-gray-700 mb-2"><strong>ชื่อ-นามสกุล:</strong> {fullName}</p>
                    <p className="text-gray-700 mb-2"><strong>เบอร์โทรศัพท์:</strong> {phoneNumber}</p>
                    <p className="text-gray-700 mb-2"><strong>อีเมล:</strong> {email ? email : "-"}</p>
                    <p className="text-gray-700 mb-2"><strong>วันที่จอง:</strong> {date}</p>
                    <p className="text-gray-700 mb-2"><strong>เวลาที่จอง:</strong> {time}</p>
                    <p className="text-gray-700 mb-2"><strong>เลขทะเบียนรถ:</strong> {CarRegistration}</p>
                    <p className="text-gray-700"><strong>รายละเอียด:</strong> {details}</p>
                </div>
                <button onClick={closeModal} className="text-black font-medium rounded-lg text-base px-4 py-2 mt-4 mr-16">ยกเลิก</button>
                <button onClick={() => submitqueue()} className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 font-medium rounded-lg text-base px-4 py-2 mt-4">ยืนยัน</button>
            </div>
        </div>
    </div>
    )}

    {isModalConfirmedOpen && (
        <div class="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center px-4">
            <div class="relative mx-auto shadow-xl rounded-md bg-white max-w-md w-full">
                <div class="my-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-14 shrink-0 fill-green-500 inline" viewBox="0 0 512 512">
                        <path
                            d="M383.841 171.838c-7.881-8.31-21.02-8.676-29.343-.775L221.987 296.732l-63.204-64.893c-8.005-8.213-21.13-8.393-29.35-.387-8.213 7.998-8.386 21.137-.388 29.35l77.492 79.561a20.687 20.687 0 0 0 14.869 6.275 20.744 20.744 0 0 0 14.288-5.694l147.373-139.762c8.316-7.888 8.668-21.027.774-29.344z"
                            data-original="#000000" />
                        <path
                            d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 470.487c-118.265 0-214.487-96.214-214.487-214.487 0-118.265 96.221-214.487 214.487-214.487 118.272 0 214.487 96.221 214.487 214.487 0 118.272-96.215 214.487-214.487 214.487z"
                            data-original="#000000" />
                    </svg>
                    <h4 class="md:text-[2vw] text-gray-800 font-semibold mt-4">จองคิวเสร็จสิ้น!!</h4>
                    <p class="text-sm text-gray-500 leading-relaxed mt-4 px-2">ลูกค้าสามารถเข้าใช้บริการในวันเวลาที่ทำการจองไว้</p>
                    <div class='justify-center item-center'>
                        <button type="button" onClick={() => closeconfirmmodal()} class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 font-medium rounded-lg text-base px-4 py-2 mt-4">ตกลง</button>
                    </div>
                </div>
            </div>
        </div>
        )
    }
    <Footer />
    </>
}

export default Queue