import React from 'react'

function Logout_Admin()
{
    localStorage.removeItem('token')
    window.location.replace('/')
}

export default function Header() {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light kanit-regular">
  {/* Left navbar links */}
  <ul className="navbar-nav">
    <li className="nav-item">
      <a className="nav-link" data-widget="pushmenu" href="" role="button"><i className="fas fa-bars" /></a>
    </li>
  </ul>
  {/* Right navbar links */}
  <ul className="navbar-nav ml-auto">
  <button onClick={() => Logout_Admin()} className="px-4 py-2 border-2 border-black rounded-md hover:bg-yellow-400 hover:text-black" id="logout">ออกจากระบบ</button>
  </ul>
</nav>

  )
}
