import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import FileUploadModal from '../FileUploadModal/FileUploadModal'
import logo from '../../images/logo.png'
import '@fortawesome/fontawesome-free/css/all.css'
import './Navbar.css'

function Navbar({ onFileDataUpload }) {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleFileUploadClick = () => {
    setShowModal(true)
  }
  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleFileUpload = (fileData) => {
    onFileDataUpload(fileData.productName)
  }

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div>
      <nav>
        <div className='navbar-left'>
            <NavLink to='/dashboard'>
              <img src={logo} alt='Logo' />
            </NavLink>
        </div>
        <div className='navbar-right'>
          <ul>
            <li>
              <NavLink to='/dashboard'>Dashboard</NavLink>
            </li>
            <li>
              <a onClick={handleFileUploadClick} style={{ cursor: 'pointer' }}>
                File Upload
              </a>
            </li>
            <li>
              <NavLink to='/graphsPanel'>Forecast</NavLink>
            </li>
            <li>
              <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
              </a>
            </li>
            <li>
              <a>
                <i className='fa fa-user'></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
      {showModal && (
        <FileUploadModal
          onClose={handleCloseModal}
          onFileUpload={handleFileUpload}
        />
      )}
    </div>
  )
}

export default Navbar
