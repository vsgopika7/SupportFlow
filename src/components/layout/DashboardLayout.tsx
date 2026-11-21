
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'
import Navbar from './Navbar'

function DashboardLayout() {

  const [isOpen, setIsOpen] = useState(false)
  const closeSidebar = () => {
    setIsOpen(false)
  }
  const toggleSidebar = () => {
    setIsOpen(prev => !prev)
  }
  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isOpen}
        onClose={closeSidebar}
      />
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}
      <div className="main-content">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default DashboardLayout
