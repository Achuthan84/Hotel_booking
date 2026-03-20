import React from 'react'
import NavBar from '../../components/HotelOwner/NavBar'
import SideBar from '../../components/HotelOwner/SideBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className='flex flex-col h-screen'>
            <NavBar />
            <div className='flex pt-16 h-full'>
                <SideBar />
                <div className='ml-16 md:ml-64 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout