import React from 'react'

function Logout_Admin()
{
    localStorage.removeItem('token')
    window.location.replace('/')
}

export default function Header() {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
  {/* Left navbar links */}
  <ul className="navbar-nav">
    <li className="nav-item">
      <a className="nav-link" data-widget="pushmenu" href="" role="button"><i className="fas fa-bars" /></a>
    </li>
  </ul>
  {/* Right navbar links */}
  <ul className="navbar-nav ml-auto">
  <button onClick={() => Logout_Admin()} id="logout">ออกจากระบบ</button>
  </ul>
</nav>

  )
}
