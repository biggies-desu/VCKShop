import { BrowserRouter, Navigate, Outlet } from 'react-router-dom'

import './index.css'

import { Routes , Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

import Home from './components/page/Home.jsx'
import Queue from './components/page/Queue.jsx'

import EstimatePrice from './components/page/EstimatePricePage/EstimatePrice.jsx'
import Ford from './components/page/EstimatePricePage/Brand/Ford.jsx'
import Honda from './components/page/EstimatePricePage/Brand/Honda.jsx'
import Mazda from './components/page/EstimatePricePage/Brand/Mazda.jsx'
import Mitsubishi from './components/page/EstimatePricePage/Brand/Mitsubishi.jsx'
import Nissan from './components/page/EstimatePricePage/Brand/Nissan.jsx'
import Susuki from './components/page/EstimatePricePage/Brand/Suzuki.jsx'
import Toyota from './components/page/EstimatePricePage/Brand/Toyota.jsx'

import Aboutus from './components/page/Aboutus.jsx'
import Login from './components/page/Login.jsx'

import Admin from './components/page/AdminPage/Admin.jsx'
import AdminWelcome from './components/page/AdminPage/AdminWelcome.jsx'
import Dashboard from './components/page/AdminPage/Dashboard.jsx'
import Account from './components/page/AdminPage/Account.jsx'
import Queue_Management from './components/page/AdminPage/Queue_Management.jsx'
import Warehouse from './components/page/AdminPage/Warehouse.jsx'
import Tax from './components/page/AdminPage/Tax.jsx'
import Notify from './components/page/AdminPage/Notify.jsx'
import HelpPage from './components/page/AdminPage/HelpPage.jsx'

import {jwtDecode} from "jwt-decode";
import { useState, useEffect } from 'react'

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => { //check if person login --> if not clear token --> login again
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodeuser = jwtDecode(token)
        setUser(decodeuser);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  //debug
  useEffect(() => {
    if (user) {
      console.log("User state updated (outside effect):", user); // Logs when state updates
    }
  }, [user]);

  const Protectroute = ({ role }) => {
    const token = localStorage.getItem('token');
    if(token) //if have token, check role
      {
        try {
          if (role.includes((jwtDecode(token).role)))
          {
            return <Outlet /> //if role match, render component
          }
        }
        catch {
          //
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
        }
      }
      //no role match redirect to login page
    localStorage.removeItem('token');
    return <Navigate to='/login' replace />;
    }
  ;
  
  return (<> 
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/estimateprice' element={<EstimatePrice/>}/>

      <Route path='/Ford' element={<Ford/>}/>
      <Route path='/Honda' element={<Honda/>}/>
      <Route path='/Mazda' element={<Mazda/>}/>
      <Route path='/Mitsubishi' element={<Mitsubishi/>}/>
      <Route path='/Nissan' element={<Nissan/>}/>
      <Route path='/Suzuki' element={<Susuki/>}/>
      <Route path='/Toyota' element={<Toyota/>}/>

      <Route element={<Protectroute role={['Customer']} />}>
        <Route path='/queue' element={<Queue/>}/>
      </Route>
    
      <Route path='/aboutus' element={<Aboutus/>}/>
      <Route path='/login' element={<Login/>}/>

      <Route element={<Protectroute role={['Admin']} />}>
        <Route path='/admin' element={<Admin />}>
          <Route index element={<AdminWelcome />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='account' element={<Account />} />
          <Route path='queue_management' element={<Queue_Management />} />
          <Route path='warehouse' element={<Warehouse />} />
          <Route path='tax' element={<Tax />} />
          <Route path='notify' element={<Notify />} />
          <Route path='helppage' element={<HelpPage />} />
        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>

  )
}

export default App
