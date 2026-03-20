import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
    const sideBarLinks = [
        { name: "DashBoard", path: "/owner", icon: assets.dashboardIcon },
        { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
        { name: "List Room", path: "/owner/list-room", icon: assets.listIcon }
    ]
    return (
        <div className='fixed top-0 left-0 md:w-64 w-16 border-r h-full text-base border-gray-400 pt-16 flex flex-col transition-all duration-300 bg-white z-40'>
            {sideBarLinks.map((items, index) => (
                <NavLink to={items.path} key={index} end='/owner'
                    className={({ isActive }) => `flex items-center py-3 px-4 md:px-8 gap-3 ${isActive ? 'border-r-4 bg-blue-600/30 border-blue-600 text-blue-600' : 'hover:bg-gray-300/90 border-white text-gray-700'}`}>
                    <img src={items.icon} alt={items.name} className='min-h-6 min-w-6' />
                    <p className='md:block hidden text-center'>{items.name}</p>
                </NavLink>
            ))}
        </div>
    )
}

export default SideBar