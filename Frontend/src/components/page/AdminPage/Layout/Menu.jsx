import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'


export default function Menu() {
  return (
<aside className="main-sidebar sidebar-dark-primary elevation-4 kanit-regular">
  {/* Sidebar */}
  <div className="sidebar">
    {/* Sidebar Menu */}
    <nav className="flex justify-center items-center">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
        <li className="nav-item menu-open">
          <ul className="nav nav-treeview">
          <li class="nav-header">Dashboard</li>
            <li className="nav-item">
            <NavLink to='dashboard' className="nav-link">
            <i className="far fa-chart-bar nav-icon" style={{ marginRight: "25px" }}/>
            Dashboard
            </NavLink>
            </li>
            <li class="nav-header">Management</li>
            <li className="nav-item">
            <NavLink to='account' className="nav-link">
            <i className="far fa-address-book nav-icon" style={{ marginRight: "25px" }}/>
            Account
            </NavLink>
            </li>
            <li className="nav-item">
            <NavLink to='queue_management' className="nav-link">
            <i className="far fa-check-square nav-icon" style={{ marginRight: "25px" }}/>
            Queue Management
            </NavLink>
            </li>
            <li className="nav-item">
            <NavLink to='warehouse' className="nav-link">
            <i className="fas fa-store-alt nav-icon" style={{ marginRight: "25px" }}/>
            Warehouse
            </NavLink>
            </li>
            <li className="nav-item">
            <NavLink to='warehouse_history' className="nav-link">
            <i className="fas fa-history nav-icon" style={{ marginRight: "25px" }}/>
            Warehouse History
            </NavLink>
            </li>
            <li class="nav-header">Other</li>
            <li className="nav-item">
            <NavLink to='tax' className="nav-link">
            <i className="fas fa-money-bill-wave nav-icon" style={{ marginRight: "25px" }}/>
            Tax
            </NavLink>
            </li>
            <li className="nav-item">
            <NavLink to='Notify' className="nav-link">
            <i className="fab fa-line nav-icon" style={{ marginRight: "25px" }}/>
            Line notify
            </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    {/* /.sidebar-menu */}
  </div>
  {/* /.sidebar */}
</aside>

  )
}
