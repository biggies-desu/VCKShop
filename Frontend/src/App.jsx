import { BrowserRouter } from 'react-router-dom'

import './index.css'

import { Routes , Route } from 'react-router-dom'

import Home from './components/page/Home.jsx'
import Queue from './components/page/Queue.jsx'
import Calc from './components/page/Calc.jsx'
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

function App() {
  return (<> 
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/queue' element={<Queue/>}/>
      <Route path='/calc' element={<Calc/>}/>
      <Route path='/aboutus' element={<Aboutus/>}/>
      <Route path='/login' element={<Login/>}/>

      <Route path='/admin' element={<Admin/>}>
        <Route index element={<AdminWelcome/>}/>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='account' element={<Account/>}/>
        <Route path='queue_management' element={<Queue_Management/>}/>
        <Route path='warehouse' element={<Warehouse/>}/>
        <Route path='tax' element={<Tax/>}/>
        <Route path='notify' element={<Notify/>}/>
        <Route path='helppage' element={<HelpPage/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
    </>

  )
}

export default App
