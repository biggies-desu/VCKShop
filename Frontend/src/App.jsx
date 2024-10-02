import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter } from 'react-router-dom'

import './index.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes , Route } from 'react-router-dom'

import Home from './components/page/Home.jsx'
import Queue from './components/page/Queue.jsx'
import Calc from './components/page/Calc.jsx'
import Aboutus from './components/page/Aboutus.jsx'
import Login from './components/page/Login.jsx'

function App() {
  return (<> 
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/queue' element={<Queue/>}/>
      <Route path='/calc' element={<Calc/>}/>
      <Route path='/aboutus' element={<Aboutus/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </BrowserRouter>
    </>

  )
}

export default App
