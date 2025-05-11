import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

export default function Content() {
  return (
    <div className="content-wrapper">
        <div id="content">{<Outlet/>}</div>
</div>

  )
}
