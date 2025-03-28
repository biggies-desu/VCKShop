import React, { useState, useEffect } from "react";
import axios from "axios";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("ModelBrand_Name");
  const [isModalSuccess, setisModalSuccess] = useState(false);
  const [isModalWarning, setisModalWarning] = useState(false);
  const [dropdowntechnician, setdropdowntechnician] = useState([])
  const [dropdowncategory, setdropdowncategory] = useState([])
  const [dropdownservice, setdropdownservice] = useState([])
  const [dropdownstatus, setdropdownstatus] = useState([])
  const [dropdownsubcategory, setdropdownsubcategory] = useState([])
  const [dropdownmodel, setdropdownmodel] = useState([])
  const [dropdownbrand, setdropdownbrand] = useState([])
  const [dropdowndefaultvat, setdropdowndefaultvat] = useState([])
  const [category, setcategory] = useState('')
  const [brand, setbrand] = useState('')
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTechnicianName, setnewTechnicianName] = useState("");
  const [newServiceName, setnewServiceName] = useState("");
  const [newServicePrice, setnewServicePrice] = useState("");
  const [newStatusName, setnewStatusName] = useState("");
  const [newSubCategoryName, setnewSubCategoryName] = useState("");
  const [newModelName, setnewModelName] = useState("");
  const [newBrandName, setnewBrandName] = useState("");
  const [newModelYear, setnewModelYear] = useState("");
  const [newVat_Value, setnewVat_Value] = useState("");
  const [modelImageFile, setModelImageFile] = useState("");
  const [editTechnicianId, setEditTechnicianId] = useState("");
  const [editTechnicianName, setEditTechnicianName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editStatusId, setEditStatusId] = useState("");
  const [editStatusName, setEditStatusName] = useState("");
  const [editSubCategoryId, setEditSubCategoryId] = useState("");
  const [editSubCategoryName, setEditSubCategoryName] = useState("");
  const [editServiceId, setEditServiceId] = useState("");
  const [editServiceName, setEditServiceName] = useState("");
  const [editServicePrice, setEditServicePrice] = useState("");
  const [editBrandId, setEditBrandId] = useState("");
  const [editModelId, setEditModelId] = useState("");
  const [editModelName, setEditModelName] = useState("");
  const [editModelYear, setEditModelYear] = useState("");
  const [editVat_ID, seteditVat_ID] = useState("");
  const [editVat_Value, seteditVat_Value] = useState("");
  const [deleteType, setDeleteType] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // จำนวนรายการที่จะแสดงในแต่ละหน้า
  const [totalPages, setTotalPages] = useState(1);
  const [dropdownModelName, setDropdownModelName] = useState([]);
  //cronjob
  const [newHour, setNewHour] = useState('8');
  const [newMinute, setNewMinute] = useState('0');
  const [newDays, setNewDays] = useState(['*']);
  const [cronList, setCronList] = useState([]);

  function fetchdata(){
    axios.all([
      axios.get(`${import.meta.env.VITE_API_URL}/getdropdowncategory`),
      axios.get(`${import.meta.env.VITE_API_URL}/getdropdowntechnician`),
      axios.get(`${import.meta.env.VITE_API_URL}/getdropdownservice`),
      axios.get(`${import.meta.env.VITE_API_URL}/getdropdownquetestatus`),
      axios.get(`${import.meta.env.VITE_API_URL}/getdropdownsubcategory`),
      axios.get(`${import.meta.env.VITE_API_URL}/getdropdownmodel`),
      axios.get(`${import.meta.env.VITE_API_URL}/getdropdownbrand`),
      axios.get(`${import.meta.env.VITE_API_URL}/get-cronlist`),
      axios.get(`${import.meta.env.VITE_API_URL}/getdropdowndefaultvat`)
    ])
    .then(([res1, res2, res3, res4, res5, res6, res7, res8, res9]) => {
      console.log("Category Response:", res1.data);
      console.log("Technician Response:", res2.data);
      console.log("Service Response:", res3.data);
      console.log("Service Response:", res4.data);
      console.log("subcategory Response:", res5.data);
      console.log("Model Response:", res6.data);
      console.log("Brand Response:", res7.data);
      console.log("cron", res8.data);
      console.log("VAT Response:", res9.data);
      setdropdowncategory(res1.data);
      setdropdowntechnician(res2.data);
      setdropdownservice(res3.data);
      setdropdownstatus(res4.data);
      setdropdownsubcategory(res5.data);
      setdropdownmodel(res6.data);
      setdropdownbrand(res7.data);
      setCronList(res8.data.cronList)
      setdropdowndefaultvat(res9.data);
    })
    .catch((err) => {
      console.error("API Error:", err);
    });
  }
  
  const paginateData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };
  
  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    const dataMap = {
      Technician_Name: dropdowntechnician,
      Category_Name: dropdowncategory,
      Status_Name: dropdownstatus,
      Sub_Category_Name: dropdownsubcategory,
      Service_Name: dropdownservice,
      ModelBrand_Name: dropdownmodel,
      Vat_Value: dropdowndefaultvat,
    };
  
    const currentData = dataMap[activeTab] || [];
    const pages = Math.ceil(currentData.length / itemsPerPage);
  
    setTotalPages(pages > 0 ? pages : 1);
    setCurrentPage(1);
  }, [activeTab,dropdowntechnician,dropdowncategory,dropdownstatus,dropdownsubcategory,dropdownservice,dropdownmodel,dropdowndefaultvat]);
  
  useEffect(() => {
    fetchdata()
  }, []);

  useEffect(() => {
    if (editBrandId) {
      axios.get(`${import.meta.env.VITE_API_URL}/getdropdownmodelname/${editBrandId}`)
        .then(res => setDropdownModelName(res.data))
        .catch(err => console.error("Fetch Model_Name Error:", err));
    }
  }, [editBrandId]);

  const handleAddBrandModel = () => {
    const brandToUse = brand === "other" ? newBrandName : dropdownbrand.find(b => b.Brand_ID == brand)?.Brand_Name;
  
    if (!brandToUse || !newModelName || !newModelYear || !modelImageFile) {
      setisModalWarning(true);
      return;
    }
  
    const formData = new FormData();
    formData.append("Brand_Name", brandToUse);
    formData.append("Model_Name", newModelName);
    formData.append("Model_Year", newModelYear);
    formData.append("Model_Image", modelImageFile);
  
    axios.post(`${import.meta.env.VITE_API_URL}/insertbrandmodel`, formData)
      .then((res) => {
        setisModalSuccess(true);
        setnewBrandName("");
        setnewModelName("");
        setnewModelYear("");
        setModelImageFile(null);
      })
      .catch((err) => {
        console.error("Insert BrandModel Error:", err);
        console.log(err)
      });
  };
  
  const handleAddCategory = () => {
    if (!newCategoryName) {
      setisModalWarning(true);
      return;
    }
    axios.post(`${import.meta.env.VITE_API_URL}/insertcategory`, {
      Category_Name: newCategoryName
    })
    .then((res) => {
      setisModalSuccess(true);
      setNewCategoryName("");
    })
    .catch((err) => {
      console.error("Insert Category Error:", err);
      console.log(err)
    });
  };

  const handleAddTechnician = () => {
    if (!newTechnicianName) {
      setisModalWarning(true);
      return;
    }
    axios.post(`${import.meta.env.VITE_API_URL}/inserttechnician`, {
      Technician_Name: newTechnicianName
    })
    .then((res) => {
      setisModalSuccess(true);
      setnewTechnicianName("");
    })
    .catch((err) => {
      console.error("Insert Technician Error:", err);
      console.log(err)
    });
  };

  const handleAddService = () => {
    if (!newServiceName || !newServicePrice) {
      setisModalWarning(true);
      return;
    }
    axios.post(`${import.meta.env.VITE_API_URL}/insertservice`, {
      Service_Name: newServiceName,
      Service_Price: parseFloat(newServicePrice)
    })
    .then((res) => {
      setisModalSuccess(true);
      setnewServiceName("");
      setnewServicePrice("");
    })
    .catch((err) => {
      console.error("Insert Service Error:", err);
      console.log(err)
    });
  }

  const handleAddStatus = () => {
    if (!newStatusName) {
      setisModalWarning(true);
      return;
    }
    axios.post(`${import.meta.env.VITE_API_URL}/insertstatus`, {
      Booking_Status_Name: newStatusName,
    })
    .then((res) => {
      setisModalSuccess(true);
      setnewStatusName("");
    })
    .catch((err) => {
      console.error("Insert Status Error:", err);
      console.log(err)
    });
  }

  const handleAddSubCategory = () => {
    if (!newSubCategoryName || !category) {
      setisModalWarning(true);
      return;
    }
  
    axios.post(`${import.meta.env.VITE_API_URL}/insertsubcategory`, {
      Sub_Category_Name: newSubCategoryName,
      Category_ID: category,
    })
    .then((res) => {
      setisModalSuccess(true);
      setnewSubCategoryName("");
      setcategory("");
    })
    .catch((err) => {
      console.error("Insert Sub_Category Error:", err);
      console.log(err)
    });
  };

  const handleAddVat = () => {
    if (!newVat_Value) {
      setisModalWarning(true);
      return;
    }
    axios.post(`${import.meta.env.VITE_API_URL}/insertdefaultvat`, {
      Vat_Value: newVat_Value,
    })
    .then((res) => {
      setisModalSuccess(true);
      setnewVat_Value("");
    })
    .catch((err) => {
      console.error("Insert Vat Error:", err);
      console.log(err)
    });
  };

  const handleUpdateTechnician = () => {
    if (!editTechnicianName || !editTechnicianId) return;
    axios.put(`${import.meta.env.VITE_API_URL}/updatetechnician/${editTechnicianId}`, {
      Technician_Name: editTechnicianName
    }).then(() => {
      setisModalSuccess(true);
      setEditTechnicianId("");
      setEditTechnicianName("");
    }).catch(err => {
      console.error("Update Technician Error:", err);
      console.log(err)
    });
  };

  const handleUpdateCategory = () => {
    if (!editCategoryName || !editCategoryId) return;
    axios.put(`${import.meta.env.VITE_API_URL}/updatecategory/${editCategoryId}`, {
      Category_Name: editCategoryName
    }).then(() => {
      setisModalSuccess(true);                                                                  
      setEditCategoryId("");
      setEditCategoryName("");
    }).catch(err => {
      console.error("Update Category Error:", err);
      console.log(err)
    });
  };

  const handleUpdateStatus = () => {
    if (!editStatusName || !editStatusId) return;
    axios.put(`${import.meta.env.VITE_API_URL}/updatestatus/${editStatusId}`, {
      Booking_Status_Name: editStatusName
    }).then(() => {
      setisModalSuccess(true);                                                                  
      setEditStatusId("");
      setEditStatusName("");
    }).catch(err => {
      console.error("Update Status Error:", err);
      console.log(err)
    });
  };

  const handleUpdateService = () => {
    if (!editServiceName || !editServicePrice || !editServiceId) return;
    axios.put(`${import.meta.env.VITE_API_URL}/updateservice/${editServiceId}`, {
      Service_Name: editServiceName,
      Service_Price: editServicePrice
    }).then(() => {
      setisModalSuccess(true);                                                                  
      setEditServiceId("");
      setEditServiceName("");
      setEditServicePrice("");
    }).catch(err => {
      console.error("Update Service Error:", err);
      console.log(err)
    });
  };

  const handleUpdateSubCategory = () => {
    if (!editSubCategoryName || !editCategoryId || !editSubCategoryId) return;
    axios.put(`${import.meta.env.VITE_API_URL}/updatesubcategory/${editSubCategoryId}`, {
      Sub_Category_Name: editSubCategoryName,
      Category_ID: editCategoryId
    }).then(() => {
      setisModalSuccess(true);                                                                  
      setEditSubCategoryId("");
      setEditSubCategoryName("");
      setEditCategoryId("");
    }).catch(err => {
      console.error("Update Service Error:", err);
      console.log(err)
    });
  };

  const handleUpdateModel = () => {
    if (!editBrandId || !editModelName || !editModelYear || !editModelId) return;
    axios.put(`${import.meta.env.VITE_API_URL}/updatebrandmodel/${editModelId}`, {
      Brand_ID: editBrandId,
      Model_Name: editModelName,
      Model_Year: editModelYear
    }).then(() => {
      setisModalSuccess(true);                                                                  
      setEditModelId("");
      setEditBrandId("");
      setEditModelName("");
      setEditModelYear("");
    }).catch(err => {
      console.error("Update Model Error:", err);
      console.log(err)
    });
  };

  const handleUpdateVat = () => {
    if (!editVat_Value || !editVat_ID) return;
    axios.put(`${import.meta.env.VITE_API_URL}/updatedefaultvat/${editVat_ID}`, {
      Vat_Value: editVat_Value
    }).then(() => {
      setisModalSuccess(true);
      seteditVat_ID("");
      seteditVat_Value("");
    }).catch(err => {
      console.error("Update Vat Error:", err);
      console.log(err)
    });
  };

  function convertToUTC(hour) {
    let utcHour = parseInt(hour, 10) - 7;
    if (utcHour < 0) utcHour += 24;
    return utcHour.toString();
  }

  const handleAddCron = () => {
    const cronExpression = `${newMinute} ${convertToUTC(newHour)} * * ${newDays}`;
    axios.post(`${import.meta.env.VITE_API_URL}/add-cron`, { cron_expression: cronExpression })
      .then(() => {
        setisModalSuccess(true);
        fetchdata();
      })
      .catch((err) => {
        console.error("Add cron error:", err);
      });
  };

  const handleDeleteCron = (id) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/delete-cron/${id}`)
      .then(() => fetchdata())
      .catch((err) => console.error("Delete cron error:", err));
  };
  
  function formatCronExpression(cronExpr) {
    const [minute, hours, , , days] = cronExpr.split(" ");
    const hourList = hours.split(",").map(h => {
      let localHour = parseInt(h, 10) + 7; // UTC+7
      if (localHour >= 24) localHour -= 24;
      return localHour.toString().padStart(2, "0");
    });
    const minuteStr = minute.padStart(2, "0");
  
    const timeList = hourList.map(h => `${h}:${minuteStr}`);
    const dayStr = days === "*" ? "ทุกวัน" :
                   days === "1-5" ? "จันทร์-ศุกร์" :
                   days === "0,6" ? "เสาร์-อาทิตย์" :
                   days === "0" ? "อาทิตย์" :
                   days === "1" ? "จันทร์" :
                   days === "2" ? "อังคาร" :
                   days === "3" ? "พุธ" :
                   days === "4" ? "พฤหัส" :
                   days === "5" ? "ศุกร์" :
                   days === "6" ? "เสาร์" :
                   `วัน ${days}`;
    return `เวลาแจ้งเตือน: ${timeList.join(", ")} ${dayStr}`;
  }
  
  const handleConfirmDelete = () => {
    if (deleteType === "category") {
      axios.delete(`${import.meta.env.VITE_API_URL}/deletecategory/${deleteId}`)
        .then(() => {
          fetchdata();
          cancelDelete();
        })
        .catch(err => console.error("Delete Category Error:", err));
    } else if (deleteType === "technician") {
      axios.delete(`${import.meta.env.VITE_API_URL}/deletetechnician/${deleteId}`)
        .then(() => {
          fetchdata();
          cancelDelete();
        })
        .catch(err => console.error("Delete Technician Error:", err));
    } else if (deleteType === "service") {
      axios.delete(`${import.meta.env.VITE_API_URL}/deleteservice/${deleteId}`)
        .then(() => {
          fetchdata();
          cancelDelete();
        })
        .catch(err => console.error("Delete Service Error:", err));
    } else if (deleteType === "status") {
      axios.delete(`${import.meta.env.VITE_API_URL}/deletestatus/${deleteId}`)
        .then(() => {
          fetchdata();
          cancelDelete();
        })
        .catch(err => console.error("Delete status Error:", err));
    } else if (deleteType === "subcategory") {
      axios.delete(`${import.meta.env.VITE_API_URL}/deletesubcategory/${deleteId}`)
        .then(() => {
          fetchdata();
          cancelDelete();
        })
        .catch(err => console.error("Delete subcategory Error:", err));
    } else if (deleteType === "model") {
      axios.delete(`${import.meta.env.VITE_API_URL}/deletebrandmodel/${deleteId}`)
        .then(() => {
          fetchdata();
          cancelDelete();
        })
        .catch(err => console.error("Delete model Error:", err));
    } else if (deleteType === "vat") {
      axios.delete(`${import.meta.env.VITE_API_URL}/deletedefaultvat/${deleteId}`)
        .then(() => {
          fetchdata();
          cancelDelete();
        })
        .catch(err => console.error("Delete vat Error:", err));
    }
  };  

  const handleClickDeleteCategory = (id) => {
    setDeleteType("category");
    setDeleteId(id);
  };

  const handleClickDeleteTechnician = (id) => {
    setDeleteType("technician");
    setDeleteId(id);
  };

  const handleClickDeleteService = (id) => {
    setDeleteType("service");
    setDeleteId(id);
  };

  const handleClickDeleteStatus = (id) => {
    setDeleteType("status");
    setDeleteId(id);
  };

  const handleClickDeleteSubCategory = (id) => {
    setDeleteType("subcategory");
    setDeleteId(id);
  };

  const handleClickDeleteModel = (id) => {
    setDeleteType("model");
    setDeleteId(id);
  };

  const cancelDelete = () => {
    setDeleteId();
  };
  
  function closeSuccessPopup() {
    setisModalSuccess(false);
    fetchdata();
}

  function closeWarningPopup() {
    setisModalWarning(false);
  }
  
  return (
  <>
    <div className="p-6 bg-gray-100">
      <div className='kanit-bold flex flex-row justify-center items-center bg-white p-4 shadow-md rounded-lg'>
        <h1 className="max-md:text-lg md:text-4xl text-gray-700">การตั้งค่า</h1>
      </div>
    </div>

    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex space-x-4 border-b pb-2">
        <button onClick={() => setActiveTab("ModelBrand_Name")} className={`px-4 py-2 rounded ${activeTab === "ModelBrand_Name" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>เพิ่มยี่ห้อ/รุ่นรถ</button>
        <button onClick={() => setActiveTab("Status_Name")} className={`px-4 py-2 rounded ${activeTab === "Status_Name" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>เพิ่มสถานะ</button>
        <button onClick={() => setActiveTab("Technician_Name")} className={`px-4 py-2 rounded ${activeTab === "Technician_Name" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>เพิ่มชื่อช่าง</button>
        <button onClick={() => setActiveTab("Category_Name")} className={`px-4 py-2 rounded ${activeTab === "Category_Name" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>เพิ่มประเภทอะไหล่</button>
        <button onClick={() => setActiveTab("Sub_Category_Name")} className={`px-4 py-2 rounded ${activeTab === "Sub_Category_Name" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>เพิ่มหมวดหมู่ย่อยของประเภทอะไหล่</button>
        <button onClick={() => setActiveTab("Service_Name")} className={`px-4 py-2 rounded ${activeTab === "Service_Name" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>เพิ่มประเภทการบริการ</button>
        <button onClick={() => setActiveTab("Cron_Settings")} className={`px-4 py-2 rounded ${activeTab === "Cron_Settings" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>ตั้งค่าเวลาแจ้งเตือน</button>
        <button onClick={() => setActiveTab("VAT_Name")} className={`px-4 py-2 rounded ${activeTab === "VAT_Name" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>เพิ่มจำนวนภาษี</button>
      </div>

      {activeTab === "ModelBrand_Name" && (
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block font-medium">ประเภทของยี่ห้อรถ</label>
            <select id="brand" className="border rounded-lg w-full md:w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400" value={brand} onChange={(e) => setbrand(e.target.value)}>
              <option value="" disabled>-- เลือกยี่ห้อรถ --</option>
              {dropdownbrand.map((brandItem, index) => (
                <option key={index} value={brandItem.Brand_ID}>
                  {brandItem.Brand_Name}
                </option>
              ))}
              <option value="other">อื่นๆ / เพิ่มยี่ห้อใหม่</option>
            </select>
          </div>
          {brand === "other" && (
            <div className="mb-4">
              <label className="block font-medium">ชื่อยี่ห้อรถใหม่</label>
              <input className="w-full px-4 py-2 border rounded" placeholder="กรอกชื่อยี่ห้อรถใหม่" value={newBrandName} onChange={(e) => setnewBrandName(e.target.value)}/>
            </div>
          )}
          <div className="mb-4">
            <label className="block font-medium">ชื่อรุ่นรถ</label>
            <input className="w-full px-4 py-2 border rounded" placeholder="กรอกชื่อรุ่นรถที่ต้องการเพิ่ม" value={newModelName} onChange={(e) => setnewModelName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block font-medium">ปีรถ</label>
            <input className="w-full px-4 py-2 border rounded" placeholder="กรอกปีรถ เช่น 2024" value={newModelYear} onChange={(e) => setnewModelYear(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block font-medium">เลือกรูปรถ</label>
            <input type="file" accept="image/*" onChange={(e) => setModelImageFile(e.target.files[0])} className="w-full px-4 py-2 border rounded" />
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAddBrandModel}>บันทึกการตั้งค่า</button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">รายการยี่ห้อ/รุ่นรถรถ</h3>
            <ul className="space-y-2">
              {paginateData(dropdownmodel).map((mod) => {
                return editModelId && editModelId === mod.Model_ID ? (
                  <li key={mod.Model_ID} className="grid grid-cols-4 items-center border p-2 rounded">
                    <span className="col-span-1">
                      <select className="border px-2 py-1 rounded w-full" value={editBrandId} onChange={(e) => setEditBrandId(e.target.value)}>
                        <option value="" disabled>-- เลือกยี่ห้อรถ --</option>
                        {dropdownbrand.map((brand) => (
                          <option key={brand.Brand_ID} value={brand.Brand_ID}>
                            {brand.Brand_Name}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span className="col-span-1">
                    <select className="border px-2 py-1 rounded w-full" value={editModelName} onChange={(e) => setEditModelName(e.target.value)}>
                        <option value="" disabled>-- เลือกรุ่นรถ --</option>
                        {dropdownModelName.map((model) => (
                          <option key={model.Model_Name_ID} value={model.Model_Name}>
                            {model.Model_Name}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span className="col-span-1">
                      <input type="text" className="border px-2 py-1 rounded w-full" value={editModelYear} onChange={(e) => setEditModelYear(e.target.value)}/>
                    </span>
                    <div className="col-span-1 text-right space-x-4">
                      <button onClick={handleUpdateModel} className="text-green-600 hover:text-green-800">บันทึก</button>
                      <button onClick={() => { setEditModelId(""); setEditBrandId(""); setEditModelName(""); setEditModelYear(""); }} className="text-gray-600 hover:text-gray-800">ยกเลิก</button>
                    </div>
                  </li>
                ) : (
                  <li key={mod.Model_ID} className="flex justify-between items-center border p-2 rounded">
                      <span>{mod.Brand_Name} {mod.Model_Name} {mod.Model_Year}</span>
                      <div className="flex space-x-6">
                        <button onClick={() => { setEditModelId(mod.Model_ID); setEditBrandId(mod.Brand_ID); setEditModelName(mod.Model_Name); setEditModelYear(mod.Model_Year);}} className="text-blue-600 hover:text-blue-800">แก้ไข</button>
                        <button onClick={() => handleClickDeleteModel(mod.Model_ID)} className="text-red-600 hover:text-red-800">ลบ</button>
                      </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Status_Name" && (
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block font-medium">ชื่อสถานะ</label>
            <input className="w-full px-4 py-2 border rounded" placeholder="กรอกชื่อสถานะที่ต้องการเพิ่ม" value={newStatusName} onChange={(e) => setnewStatusName(e.target.value)}/>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAddStatus}>บันทึกการตั้งค่า</button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">รายการสถานะ</h3>
            <ul className="space-y-2">
              {paginateData(dropdownstatus).map((sta) => {
                return editStatusId && editStatusId === sta.Booking_Status_ID ? (
                  <li key={sta.Booking_Status_ID} className="flex justify-between items-center border p-2 rounded">
                    <span>
                      <input type="text" className="border px-2 py-1 rounded" value={editStatusName} onChange={(e) => setEditStatusName(e.target.value)}/>
                    </span>
                    <div className="flex space-x-6">
                      <button onClick={handleUpdateStatus} className="text-green-600 hover:text-green-800">บันทึก</button>
                      <button onClick={() => { setEditStatusId(""); setEditStatusName(""); }} className="text-gray-600 hover:text-gray-800">ยกเลิก</button>
                    </div>
                  </li>
                ) : (
                  <li key={sta.Booking_Status_ID} className="flex justify-between items-center border p-2 rounded">
                    <span>{sta.Booking_Status_Name}</span>
                    <div className="flex space-x-6">
                      <button onClick={() => { setEditStatusId(sta.Booking_Status_ID); setEditStatusName(sta.Booking_Status_Name); }} className="text-blue-600 hover:text-blue-800">แก้ไข</button>
                      <button onClick={() => handleClickDeleteStatus(sta.Booking_Status_ID)} className="text-red-600 hover:text-red-800">ลบ</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Technician_Name" && (
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block font-medium">ชื่อช่าง</label>
            <input className="w-full px-4 py-2 border rounded" placeholder="กรอกชื่อช่างที่ต้องการเพิ่ม" value={newTechnicianName} onChange={(e) => setnewTechnicianName(e.target.value)}/>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAddTechnician}>บันทึกการตั้งค่า</button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">รายการช่าง</h3>
            <ul className="space-y-2">
              {paginateData(dropdowntechnician).map((tech) => {
                return editTechnicianId && editTechnicianId === tech.Technician_ID ? (
                  <li key={tech.Technician_ID} className="flex justify-between items-center border p-2 rounded">
                    <span>
                      <input type="text" className="border px-2 py-1 rounded" value={editTechnicianName} onChange={(e) => setEditTechnicianName(e.target.value)}/>
                    </span>
                    <div className="flex space-x-6">
                      <button onClick={handleUpdateTechnician} className="text-green-600 hover:text-green-800">บันทึก</button>
                      <button onClick={() => { setEditTechnicianId(""); setEditTechnicianName(""); }} className="text-gray-600 hover:text-gray-800">ยกเลิก</button>
                    </div>
                  </li>
                ) : (
                  <li key={tech.Technician_ID} className="flex justify-between items-center border p-2 rounded">
                    <span>{tech.Technician_Name}</span>
                    <div className="flex space-x-6">
                      <button onClick={() => { setEditTechnicianId(tech.Technician_ID); setEditTechnicianName(tech.Technician_Name); }} className="text-blue-600 hover:text-blue-800">แก้ไข</button>
                      <button onClick={() => handleClickDeleteTechnician(tech.Technician_ID)} className="text-red-600 hover:text-red-800">ลบ</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Category_Name" && (
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block font-medium">ชื่อประเภทของอะไหล่</label>
            <input className="w-full px-4 py-2 border rounded" placeholder="กรอกชื่อประเภทของอะไหล่" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}/>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAddCategory}>บันทึกการตั้งค่า</button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">รายการประเภทอะไหล่</h3>
            <ul className="space-y-2">
              {paginateData(dropdowncategory).map((cat) => {
                return editCategoryId && editCategoryId === cat.Category_ID ? (
                  <li key={cat.Category_ID} className="flex justify-between items-center border p-2 rounded">
                    <span>
                      <input type="text" className="border px-2 py-1 rounded" value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)}/>
                    </span>
                    <div className="flex space-x-6">
                      <button onClick={handleUpdateCategory} className="text-green-600 hover:text-green-800">บันทึก</button>
                      <button onClick={() => { setEditCategoryId(""); setEditCategoryName(""); }} className="text-gray-600 hover:text-gray-800">ยกเลิก</button>
                    </div>
                  </li>
                ) : (
                  <li key={cat.Category_ID} className="flex justify-between items-center border p-2 rounded">
                    <span>{cat.Category_Name}</span>
                    <div className="flex space-x-6">
                      <button onClick={() => { setEditCategoryId(cat.Category_ID); setEditCategoryName(cat.Category_Name); }} className="text-blue-600 hover:text-blue-800">แก้ไข</button>
                      <button onClick={() => handleClickDeleteCategory(cat.Category_ID)} className="text-red-600 hover:text-red-800">ลบ</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Sub_Category_Name" && (
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block font-medium">รุ่นของอะไหล่ที่ต้องการเพิ่ม</label>
            <input className="w-full px-4 py-2 border rounded" placeholder="กรอกรุ่นของอะไหล่ที่ต้องการเพิ่ม" value={newSubCategoryName} onChange={(e) => setnewSubCategoryName(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label className="block font-medium">ประเภทของอะไหล่</label>
            <select id="category" className="border rounded-lg w-full md:w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text" value={category} placeholder='ประเภทอะไหล่' onChange={(e) => setcategory(e.target.value)}>
                <option value="" disabled>-- เลือกประเภทของอะไหล่ --</option>
                {dropdowncategory.map((category, index) => (
                  <option key={index} value={category.Category_ID}>
                      {category.Category_Name}
                  </option>
                ))}
            </select>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAddSubCategory}>บันทึกการตั้งค่า</button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">รายการรุ่นของอะไหล่</h3>
            <ul className="space-y-2">
              {paginateData(dropdownsubcategory).map((subcat) => {
                return editSubCategoryId && editSubCategoryId === subcat.Sub_Category_ID ? (
                  <li key={subcat.Sub_Category_ID} className="grid grid-cols-3 items-center border p-2 rounded">
                    <span className="col-span-1">
                      <input type="text" className="border px-2 py-1 rounded w-full" value={editSubCategoryName} onChange={(e) => setEditSubCategoryName(e.target.value)}/>
                    </span>
                    <span className="col-span-1">
                      <select className="border px-2 py-1 rounded w-full" value={editCategoryId} onChange={(e) => setEditCategoryId(e.target.value)}>
                        <option value="" disabled>-- เลือกประเภทของอะไหล่ --</option>
                        {dropdowncategory.map((cat) => (
                          <option key={cat.Category_ID} value={cat.Category_ID}>
                            {cat.Category_Name}
                          </option>
                        ))}
                      </select>
                    </span>
                    <div className="col-span-1 text-right space-x-4">
                      <button onClick={handleUpdateSubCategory} className="text-green-600 hover:text-green-800">บันทึก</button>
                      <button onClick={() => { setEditSubCategoryId(""); setEditSubCategoryName(""); setEditCategoryId(""); }} className="text-gray-600 hover:text-gray-800">ยกเลิก</button>
                    </div>
                  </li>
                ) : (
                  <li key={subcat.Sub_Category_ID} className="grid grid-cols-3 items-center border p-2 rounded">
                    <div className="col-span-1">{subcat.Sub_Category_Name}</div>
                    <div className="col-span-1 text-right">ประเภทของอะไหล่ : {subcat.Category_Name}</div>
                    <div className="col-span-1 text-right space-x-4">
                      <button onClick={() => { setEditSubCategoryId(subcat.Sub_Category_ID); setEditSubCategoryName(subcat.Sub_Category_Name); setEditCategoryId(subcat.Category_ID);}} className="text-blue-600 hover:text-blue-800">แก้ไข</button>
                      <button onClick={() => handleClickDeleteSubCategory(subcat.Sub_Category_ID)} className="text-red-600 hover:text-red-800">ลบ</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Service_Name" && (
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block font-medium">ชื่อประเภทการบริการ</label>
            <input className="w-full px-4 py-2 border rounded" placeholder="กรอกชื่อประเภทการบริการที่ต้องการเพิ่ม" value={newServiceName} onChange={(e) => setnewServiceName(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label className="block font-medium">ราคาประเภทการบริการ</label>
            <input className="w-full px-4 py-2 border rounded" placeholder="กรอกราคาประเภทการบริการที่ต้องการเพิ่ม" value={newServicePrice} onChange={(e) => setnewServicePrice(e.target.value)}/>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAddService}>บันทึกการตั้งค่า</button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">รายการประเภทการบริการ</h3>
            <ul className="space-y-2">
              {paginateData(dropdownservice).map((ser) => {
                return editServiceId && editServiceId === ser.Service_ID ? (
                  <li key={ser.Service_ID} className="grid grid-cols-3 items-center border p-2 rounded">
                    <span className="col-span-1">
                      <input type="text" className="border px-2 py-1 rounded w-full" value={editServiceName} onChange={(e) => setEditServiceName(e.target.value)}/>
                    </span>
                    <span className="col-span-1">
                      <input type="number" className="border px-2 py-1 rounded w-full" value={editServicePrice} onChange={(e) => setEditServicePrice(e.target.value)}/>
                    </span>
                    <div className="col-span-1 text-right space-x-4">
                      <button onClick={handleUpdateService} className="text-green-600 hover:text-green-800">บันทึก</button>
                      <button onClick={() => { setEditServiceId(""); setEditServiceName(""); setEditServicePrice(""); }} className="text-gray-600 hover:text-gray-800">ยกเลิก</button>
                    </div>
                  </li>
                ) : (
                  <li key={ser.Service_ID} className="grid grid-cols-3 items-center border p-2 rounded">
                    <div className="col-span-1">{ser.Service_Name}</div>
                    <div className="col-span-1 text-right">ราคา : {Number(ser.Service_Price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div className="col-span-1 text-right space-x-4">
                      <button onClick={() => { setEditServiceId(ser.Service_ID); setEditServiceName(ser.Service_Name); setEditServicePrice(ser.Service_Price);}} className="text-blue-600 hover:text-blue-800">แก้ไข</button>
                      <button onClick={() => handleClickDeleteService(ser.Service_ID)} className="text-red-600 hover:text-red-800">ลบ</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Cron_Settings" && (
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-medium">เวลา</label>
              <input
                  type="time" className="w-full border p-2 rounded"
                  value={`${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`}
                  onChange={(e) => {const [hour, minute] = e.target.value.split(':');
                    setNewHour(hour);
                    setNewMinute(minute);
                  }}
                />
            </div>
            <div>
              <label className="block font-medium">วัน</label>
              <select className="w-full border p-2 rounded" value={newDays} onChange={(e) => setNewDays(e.target.value)}>
                <option value="*">ทุกวัน</option>
                <option value="1-5">จันทร์-ศุกร์</option>
                <option value="0,6">เสาร์-อาทิตย์</option>
                <option value="1">จันทร์</option>
                <option value="2">อังคาร</option>
                <option value="3">พุธ</option>
                <option value="4">พฤหัส</option>
                <option value="5">ศุกร์</option>
                <option value="6">เสาร์</option>
                <option value="0">อาทิตย์</option>
              </select>
            </div>
          </div>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddCron}>เพิ่มเวลาแจ้งเตือน</button>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">รายการเวลาแจ้งเตือน</h3>
            <ul className="space-y-2">
            {cronList.map((cron, idx) => (
                <li key={cron.Cron_ID} className="grid grid-cols-3 items-center border p-2 rounded">
                  <div className="col-span-2">{formatCronExpression(cron.Cron_expression)}</div>
                  <div className="col-span-1 text-right space-x-3">
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteCron(cron.Cron_ID)}>ลบ</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {activeTab === "VAT_Name" && (
        <div className="p-6 border rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block font-medium">จำนวนภาษี</label>
            <input className="w-full px-4 py-2 border rounded" placeholder="กรอกจำนวนภาษีที่ต้องการเพิ่ม" value={newVat_Value} onChange={(e) => setnewVat_Value(e.target.value)}/>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAddVat}>บันทึกการตั้งค่า</button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">รายการจำนวนภาษี</h3>
            <ul className="space-y-2">
              {paginateData(dropdowndefaultvat).map((vat) => {
                return editVat_ID && editVat_ID === vat.Vat_ID ? (
                  <li key={vat.Vat_ID} className="flex justify-between items-center border p-2 rounded">
                    <span>
                      <input type="text" className="border px-2 py-1 rounded" value={editVat_Value} onChange={(e) => seteditVat_Value(e.target.value)}/>
                    </span>
                    <div className="flex space-x-6">
                      <button onClick={handleUpdateVat} className="text-green-600 hover:text-green-800">บันทึก</button>
                      <button onClick={() => { seteditVat_ID(""); seteditVat_Value(""); }} className="text-gray-600 hover:text-gray-800">ยกเลิก</button>
                    </div>
                  </li>
                ) : (
                  <li key={vat.Vat_ID} className="flex justify-between items-center border p-2 rounded">
                    <span>{vat.Vat_Value}%</span>
                    <div className="flex space-x-6">
                      <button onClick={() => { seteditVat_ID(vat.Vat_ID); seteditVat_Value(vat.Vat_Value); }} className="text-blue-600 hover:text-blue-800">แก้ไข</button>
                      <button onClick={() => handleClickDeleteVat(vat.Vat_ID)} className="text-red-600 hover:text-red-800">ลบ</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

        
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

    {isModalSuccess && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="relative p-8 text-center bg-white max-w-xl w-full rounded-xl shadow-xl dark:bg-gray-800">
            <button onClick={closeSuccessPopup} type="button" class="text-gray-400 absolute top-4 right-4 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg p-2 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
            <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 p-4 flex items-center justify-center mx-auto mb-3">
                <svg aria-hidden="true" class="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
            </div>
            <p class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-700">เพิ่มข้อมูลสำเร็จเสร็จสิ้น</p>
            <button onClick={closeSuccessPopup} type="button" className="bg-blue-400 py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-900">
              ตกลง
            </button>
        </div>
      </div>
    )}

    {isModalWarning && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative p-8 text-center bg-white max-w-xl w-full rounded-xl shadow-xl dark:bg-gray-800">
          <button onClick={closeWarningPopup} type="button" className="text-gray-400 absolute top-4 right-4 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg p-2 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 p-4 flex items-center justify-center mx-auto mb-3">
            <svg fill="none" viewBox="0 0 24 24" className="w-12 h-12 text-red-600" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-700">กรุณากรอกข้อมูลให้ครบถ้วน</p>
          <button onClick={closeWarningPopup} type="button" className="bg-red-500 py-3 px-6 text-base font-medium text-white rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800">
            ตกลง
          </button>
        </div>
      </div>
    )}

    {deleteId && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 kanit-regular">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="p-4 md:p-5 text-center">
            <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 className="mt-2 mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">ต้องการลบหรือไม่?</h3>
            <button onClick={handleConfirmDelete} className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
              ใช่, ยืนยัน
            </button>
            <button onClick={cancelDelete} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700">
              ไม่, ยกเลิก
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}

export default SettingsPage;
