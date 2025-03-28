import React, { useState } from "react";
import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

import Header from './Layout/Header'
import Menu from './Layout/Menu'
import Content from './Layout/Content'


function Admin() {
    return (
      <div className="wrapper">
        <Header />
        <Menu />
        <Content />
      </div>
    );
  }
export default Admin