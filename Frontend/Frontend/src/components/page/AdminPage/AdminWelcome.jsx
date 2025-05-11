import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
function AdminWelcome()
{
    const token = jwtDecode(localStorage.getItem('token'))
    return <>
    <div classname ='kanit-regular'>ยินดีต้อนรับคุณ {token?.username}</div>
    </>
}

export default AdminWelcome