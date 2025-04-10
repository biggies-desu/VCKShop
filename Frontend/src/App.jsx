import { BrowserRouter, Navigate, Outlet } from 'react-router-dom'

import './index.css'

import { Routes , Route } from 'react-router-dom'

import Home from './components/page/Home.jsx'
import Queue from './components/page/Queue.jsx'

import EstimatePrice from './components/page/EstimatePricePage/EstimatePrice.jsx'

import Allcarmodels from './components/page/EstimatePricePage/Allcarmodels.jsx'

import Aboutus from './components/page/Aboutus.jsx'
import Login from './components/page/Login.jsx';
import Profile from './components/page/Profile.jsx'

import Admin from './components/page/AdminPage/Admin.jsx'
import AdminWelcome from './components/page/AdminPage/AdminWelcome.jsx'
import Dashboard from './components/page/AdminPage/Dashboard.jsx'
import Account from './components/page/AdminPage/Account.jsx'
import Queue_Management from './components/page/AdminPage/Queue_Management.jsx'
import Warehouse from './components/page/AdminPage/Warehouse.jsx'
import Warehouse_History from './components/page/AdminPage/Warehouse_History.jsx'
import Tax from './components/page/AdminPage/Tax.jsx'
import Notify from './components/page/AdminPage/Notify.jsx'
import SettingsPage from './components/page/AdminPage/SettingsPage.jsx'
import PasswordChangeLog from './components/page/AdminPage/PasswordChangeLog.jsx'

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
        catch (error){
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

      <Route path='/allcarmodels' element={<Allcarmodels/>}/>

      <Route element={<Protectroute role={[1,2]}/>}>
        <Route path='/queue' element={<Queue/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Route>
    
      <Route path='/aboutus' element={<Aboutus/>}/>
      <Route path='/login' element={<Login/>}/>

      <Route element={<Protectroute role={[1]} />}>
        <Route path='/admin' element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='account' element={<Account />} />
          <Route path='queue_management' element={<Queue_Management />} />
          <Route path='warehouse' element={<Warehouse />} />
          <Route path='warehouse_history' element={<Warehouse_History />} />
          <Route path='tax' element={<Tax />} />
          <Route path='notify' element={<Notify />} />
          <Route path='settingsPage' element={<SettingsPage />} />
          <Route path='passwordlog' element={<PasswordChangeLog />} />
        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>

  )
}

export default App
