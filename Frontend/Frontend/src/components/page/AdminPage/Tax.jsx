import React, { useEffect, useState } from "react";
import axios from "axios";

function Tax() 
{
    const [taxdata, settaxdata] = useState([]);
    const [detail, setdetail] = useState([]);
    const [search_time, setsearch_time] = useState("");
    const [search_time2, setsearch_time2] = useState("");
    const [isDetailModalOpen, setisDetailModalOpen] = useState(false);
    const [totalprice, settotalprice] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [issearch, setissearch] = useState(false);
    const [vatdropdown, setvatdropdown] = useState([]);
    const [vat, setvat] = useState("");
    const [vatStartMonth, setVatStartMonth] = useState("");
    const [detailBookingDate, setDetailBookingDate] = useState(null);
    const [defaultVat, setDefaultVat] = useState(7); // ค่าเริ่มต้น VAT สำหรับช่วงก่อนเดือนที่กำหนด
    const [bookingDetailsMap, setBookingDetailsMap] = useState({});
    const [bookingDetailItemsMap, setBookingDetailItemsMap] = useState({});


    // const fetchAllDetails = async (data) => {
    //   const newMap = {};
    //   await Promise.all(
    //     data.map(async (item) => {
    //       try {
    //         const res = await axios.get(`${import.meta.env.VITE_API_URL}/gettaxdetail/${item.booking_id}`);
    //         const total = res.data.reduce((sum, i) => sum + i.totalprice, 0);
    //         newMap[item.booking_id] = total;
    //       } catch (error) {
    //         console.error("Error fetching detail for booking_id:", item.booking_id);
    //       }
    //     })
    //   );
    //   setBookingDetailsMap(newMap);
    // };
    const fetchAllDetails = async (data) => {
      const newMap = {};
      const newDetailMap = {};
      await Promise.all(
        data.map(async (item) => {
          try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/gettaxdetail/${item.booking_id}`);
            const total = res.data.reduce((sum, i) => sum + i.totalprice, 0);
            newMap[item.booking_id] = total;
            newDetailMap[item.booking_id] = res.data; // เก็บ detail ไว้ด้วย
          } catch (error) {
            console.error("Error fetching detail for booking_id:", item.booking_id);
          }
        })
      );
      setBookingDetailsMap(newMap);
      setBookingDetailItemsMap(newDetailMap); // 👈 เพิ่ม state ใหม่
    };
    
    const fetchdata = () => {
      axios.all([
        axios.get(`${import.meta.env.VITE_API_URL}/getalltax`),
        axios.get(`${import.meta.env.VITE_API_URL}/getcurrentmonthtotalprice`),
        axios.get(`${import.meta.env.VITE_API_URL}/default_vat`),
    ])
    .then((res) => {
        const taxItems = res[0].data;
        settaxdata(taxItems);
        settotalprice(res[1].data);
        setvatdropdown(res[2].data);

        if (res[2].data.length > 0) {
          const defaultVatItem = res[2].data.find(v => v.Vat_Default === 1);
          const defaultValue = defaultVatItem ? defaultVatItem.Vat_Value : 7;
          setvat(defaultValue);       // VAT สำหรับช่วงหลังเดือนที่กำหนด
          setDefaultVat(defaultValue); // VAT เริ่มต้นสำหรับช่วงก่อนเดือน
        } else {
          setvat(7);
          setDefaultVat(7);
        }            
        const today = new Date();
        const currentYM = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        setVatStartMonth(currentYM);
        fetchAllDetails(taxItems);
    })
    .catch((err) => console.log(err));
    }
    useEffect(() => {
        fetchdata()
    }, []);

    useEffect(() => {
        if (taxdata.length > 0) {
            const totalPages = Math.ceil(taxdata.length / itemsPerPage);
            setTotalPages(totalPages);
        }
    }, [taxdata, itemsPerPage]);

  function clearsearch()
  {
    setsearch_time('')
    setsearch_time2('')
    fetchdata()
  }

  function searchtime() {
    if (search_time) {
        axios.all([
            axios.post(`${import.meta.env.VITE_API_URL}/getsearchtax`, {
                search_time: search_time,
                search_time2: search_time2 || search_time, // กรณี search_time2 ไม่มีค่า ให้ใช้ search_time
            }),
            axios.post(`${import.meta.env.VITE_API_URL}/getselecttotalprice`, {
                search_time: search_time,
                search_time2: search_time2 || search_time,
            }),
        ])
        .then((res) => {
            settaxdata(res[0].data);
            settotalprice(res[1].data);
            setissearch(true);
        })
        .catch((err) => {
            console.log(err);
        });
    }
  }

  function fetchDetail(item) {
    axios
      .get(`${import.meta.env.VITE_API_URL}/gettaxdetail/${item.booking_id}`)
      .then((res) => {
        setdetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function openDetailModal(item) {
    fetchDetail(item);
    setDetailBookingDate(item.booking_date);
    setisDetailModalOpen(true);
  }

  function CloseDetailModal(item) {
    setisDetailModalOpen(false);
  }

  const currentTaxdata = taxdata.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  function calculateTaxWithMonthStart(items, selectedVat, startMonth) {
    const fallbackRate = parseFloat(defaultVat) / 100;
    const selectedRate = parseFloat(selectedVat) / 100;

    let totalTax = 0;

    items.forEach((item) => {
      const date = new Date(item.booking_date);
      const itemYM = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const rate = itemYM >= startMonth ? selectedRate : fallbackRate;
      totalTax += item.totalprice * (rate / (rate + 1));
    });

    return totalTax.toFixed(2);
  }

  return (
  <>
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="kanit-bold flex flex-row justify-center items-center bg-white p-4 shadow-md rounded-lg">
        <h1 className="max-md:text-lg md:text-4xl text-gray-700">คำนวณภาษี</h1>
      </div>

      {taxdata.length > 0 && vatStartMonth && (
        <div className="bg-yellow-400 p-4 rounded-lg shadow-md mt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800">{Number(calculateTaxWithMonthStart(taxdata, vat, vatStartMonth)).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2,})} บาท</h3>
              <p className="text-gray-700">ภาษีช่วงก่อน : {vatStartMonth} ใช้ {defaultVat}% หลังจากนั้นใช้ {vat}%</p>
            </div>
            <div className="text-gray-600">
              <i className="ion ion-stats-bars text-4xl"></i>
            </div>
          </div>
        </div>
      )}

      <form className="mt-4 p-4 bg-white shadow-md rounded-lg items-center">
      <div className="flex flex-col md:flex-row md:space-x-4 md:items-end space-y-2 md:space-y-0">
            <div className="w-full md:w-1/4">
                <label htmlFor="search_time" className="block text-gray-700 text-sm font-medium mb-1">วันที่เริ่มต้น</label>
                
                <input value={search_time} className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="month" type="date" required onChange={(e) => setsearch_time(e.target.value)}/>
            </div>
            <div className="w-full md:w-1/4">
                <label htmlFor="search_time2" className="block text-gray-700 text-sm font-medium mb-1">วันที่สิ้นสุด</label>
                <input value={search_time2} className="shadow border rounded-lg w-full max-md:mt-2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" id="month" type="date" required onChange={(e) => setsearch_time2(e.target.value)}/>
            </div>
            <div className="w-full md:w-1/4">
                <label htmlFor="default_vat" className="block text-gray-700 text-sm font-medium mb-1">VAT ปัจจุบัน(%)</label>
                <select id="default_vat" className="shadow border rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" value={defaultVat}onChange={(e) => setDefaultVat(parseFloat(e.target.value))}>
                {vatdropdown.map((vat, index) => (
                  <option key={index} value={vat.Vat_Value}>
                    {vat.Vat_Value}%
                  </option>
                ))}
                </select>
            </div>
            <div className="w-full md:w-1/4">
                <label htmlFor="vat" className="block text-gray-700 text-sm font-medium mb-1">VAT หลังปรับเปลี่ยน(%)</label>
                <select id="vat" className="shadow border rounded-lg w-full py-2 px-4 max-md:mt-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" value={vat} onChange={(e) => setvat(parseFloat(e.target.value))}>
                {vatdropdown.map((vat, index) => (
                    <option key={index} value={vat.Vat_Value}>
                        {vat.Vat_Value}%
                    </option>
                ))}
                </select>
            </div>
            <div className="w-full md:w-1/4">
                <label htmlFor="month" className="block text-gray-700 text-sm font-medium mb-1">ช่วงที่เริ่มต้นภาษีใหม่</label>
                <input value={vatStartMonth} type="month" className="shadow border rounded-lg w-full py-2 px-4 max-md:mt-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" onChange={(e) => setVatStartMonth(e.target.value)} required/>
            </div>

            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
            <button type="button" onClick={clearsearch}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
            <button type="button" id="search" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition" onClick={() => searchtime()}>
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
            </svg>
            </button>
            </div>
        </div>
      </form>

      <div className='relative overflow-x-auto shadow-md rounded-2xl mt-6'>
        <table className="w-full text-sm text-left text-gray-600 bg-white shadow-md rounded-lg">
          <thead className="text-sm md:text-base text-white bg-blue-500">
            <tr>
              <th className='px-4 py-3'>เลขคิว</th>
              <th className='px-6 py-3'>วันที่จอง</th>
              <th className='px-6 py-3'>เวลา</th>
              <th className='text-center px-6 py-3'>ดูรายละเอียด</th>
              <th className='text-center px-6 py-3'>จำนวนภาษีที่ต้องชำระ</th>
            </tr>
          </thead>
          <tbody>
            {currentTaxdata.map((item, index) => {
              const date = new Date(item.booking_date);
              const itemYM = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              const rate = itemYM >= vatStartMonth ? parseFloat(vat) / 100 : parseFloat(defaultVat) / 100;
              const detailItems = bookingDetailItemsMap[item.booking_id] || [];
              const tax = Number(
                detailItems.reduce((sum, i) => sum + Number((i.totalprice * (rate / (rate + 1))).toFixed(2)), 0).toFixed(2)
              );
              return (
                <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                  <td className='px-4 py-3'>#{item.booking_id}</td>
                  <td className='px-4 py-3'>{new Date(item.booking_date).toLocaleDateString('th-TH')}</td>
                  <td className='px-4 py-3'>{item.booking_time}</td>
                  <td className="text-center px-4 py-3">
                    <button type='button' onClick={() => openDetailModal(item)} className="text-blue-500 hover:text-blue-700">📄รายละเอียด</button>
                  </td>
                  <td className='text-center px-4 py-3'>
                    {tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="flex space-x-5 justify-center font-[sans-serif] p-10">
        <button className="flex items-center justify-center shrink-0 bg-gray-100 w-9 h-9 rounded-md cursor-pointer hover:bg-blue-400" onClick={() => changePage(currentPage > 1 ? currentPage - 1 : 1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-gray-400" viewBox="0 0 55.753 55.753">
            <path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" data-original="#000000" />
          </svg>
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <li key={index} className={`flex items-center justify-center shrink-0 border cursor-pointer text-base font-bold text-gray-800 px-[13px] h-9 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:border-blue-500'}`} onClick={() => changePage(index + 1)}>
            {index + 1}
          </li>
        ))}
        <button className="flex items-center justify-center shrink-0 bg-gray-100 w-9 h-9 rounded-md cursor-pointer hover:bg-blue-400" onClick={() => changePage(currentPage < totalPages ? currentPage + 1 : totalPages)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-gray-400 rotate-180" viewBox="0 0 55.753 55.753">
            <path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" data-original="#000000" />
          </svg>
        </button>
      </ul>

      {isDetailModalOpen && (() => {
        const dateForVat = new Date(detailBookingDate);
        const itemYM = `${dateForVat.getFullYear()}-${String(dateForVat.getMonth() + 1).padStart(2, "0")}`;
        const rate = itemYM >= vatStartMonth ? vat / 100 : 0.07;
        const vatList = detail.map(item => ({
        ...item,
        vatAmount: Number((item.totalprice * (rate / (rate + 1))).toFixed(2)) // ปัดเศษ 2 ตำแหน่ง
        }));
        const totalVat = Number(
          vatList.reduce((sum, item) => sum + item.vatAmount, 0).toFixed(2)
        );        
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4 kanit-bold">
                <h2 className="text-xl text-center w-full">รายการคำนวณภาษี (VAT)</h2>
                <button type='button' onClick={() => CloseDetailModal()}>
                  <svg className="w-6 h-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm md:text-base table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="text-start px-3 py-2">รหัสสินค้า</th>
                      <th className="text-start px-3 py-2">ชื่อสินค้า</th>
                      <th className="text-center px-2 py-2">จำนวนที่ขาย</th>
                      <th className="text-end px-2 py-2">ภาษี (VAT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vatList.length > 0 ? (
                      vatList.map((item, index) => (
                        <tr key={index} className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-100 md:text-lg">
                          <td className="text-start py-4">{item.sparepart_productid}</td>
                          <td className="text-start py-4">{item.sparepart_name}</td>
                          <td className="text-center py-4">{item.booking_sparepart_quantity}</td>
                          <td className="text-end py-4">
                            {item.vatAmount.toLocaleString("en-US", {minimumFractionDigits: 2,maximumFractionDigits: 2,})} บาท
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">ไม่พบข้อมูล</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-gray-100 text-lg">
                      <td colSpan="3" className="text-end px-4 py-3">รวมภาษี (VAT):</td>
                      <td className="text-end px-4 py-3">
                        {totalVat.toLocaleString("en-US", {minimumFractionDigits: 2,maximumFractionDigits: 2,})} บาท
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  </>
  );
}

export default Tax;