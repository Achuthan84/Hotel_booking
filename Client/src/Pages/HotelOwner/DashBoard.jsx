import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'

const DashBoard = () => {
  const [dashboardData, setDashBoardData] = useState(dashboardDummyData)
  const [search, setSearch] = useState('')

  const filteredBookings = dashboardData.bookings.filter(item =>
    item.user.username.toLowerCase().includes(search.toLowerCase()) ||
    String(item.userid).includes(search)
  )

  return (
    <div>
      <Title align="left" font="outfit" title="DashBoard" subTitle="Monitor your room listing, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations" />

      {/* Stats Cards */}
      <div className='flex flex-col sm:flex-row gap-4 my-8'>
        {/* total booking */}
        <div className='bg-primary/15 border border-primary/10 rounded flex items-center p-4 pr-8 w-full sm:w-auto'>
          <img src={assets.totalBookingIcon} alt="totalBookingIcon" className='h-10 w-10 object-contain' />
          <div className='flex flex-col ml-4 font-medium'>
            <p className='text-blue-500 text-base md:text-lg'>Total Bookings</p>
            <p className='text-neutral-700 text-sm md:text-base'>{dashboardData.totalBookings}</p>
          </div>
        </div>
        {/* total revenue */}
        <div className='bg-primary/15 border border-primary/10 rounded flex items-center p-4 pr-8 w-full sm:w-auto'>
          <img src={assets.totalRevenueIcon} alt="totalRevenueIcon" className='h-10 w-10 object-contain' />
          <div className='flex flex-col ml-4 font-medium'>
            <p className='text-blue-500 text-base md:text-lg'>Total Revenue</p>
            <p className='text-neutral-700 text-sm md:text-base'>₹ {dashboardData.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Header + Search */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5'>
        <h2 className='text-lg md:text-xl text-blue-950/70 font-medium'>Recent Bookings</h2>
        <div className='flex items-center border border-gray-400 rounded-lg px-3 py-2 bg-white w-full sm:w-48 md:w-64'>
          <img src={assets.searchIcon} alt="search" className='w-4 h-4 mr-2 opacity-60' />
          <input
            type="text"
            placeholder='Search user or UserId'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full text-sm outline-none text-gray-700 placeholder-gray-400'
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className='text-gray-400 hover:text-gray-600 ml-1 text-xs cursor-pointer'
            >✕</button>
          )}
        </div>
      </div>

      {/* Mobile: Card View */}
      <div className='flex flex-col gap-3 md:hidden'>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((items, index) => (
            <div key={index} className='border border-gray-300 rounded-lg p-4 text-sm text-gray-700'>
              <div className='flex justify-between items-center mb-2'>
                <div>
                  <p className='font-medium text-gray-900'>{items.user.username}</p>
                  <p className='text-xs text-gray-400'>#{items.userid}</p>
                </div>
                <button className={`px-3 py-1 text-xs ${items.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-700'} rounded-full`}>
                  {items.isPaid ? "Completed" : "Pending"}
                </button>
              </div>
              <p className='text-gray-500 mb-2 text-xs'>{items.room.roomType}</p>
              <div className='flex justify-between text-xs text-gray-500'>
                <span>In: {new Date(items.checkInDate).toDateString()}</span>
                <span>Out: {new Date(items.checkOutDate).toDateString()}</span>
              </div>
              <p className='mt-2 font-medium text-gray-800'>₹ {items.totalPrice}</p>
            </div>
          ))
        ) : (
          <p className='py-6 text-center text-gray-400 text-sm'>
            No bookings found for "<span className='text-gray-600'>{search}</span>"
          </p>
        )}
      </div>

      {/* Desktop: Table View */}
      <div className='hidden md:block w-full text-left border border-gray-400 rounded-lg max-h-85 overflow-y-scroll scroll-smooth [&::-webkit-scrollbar]:hidden'>
        <table className='w-full'>
          <thead className='bg-gray-300 sticky top-0 z-10'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium text-center whitespace-nowrap'>UserId</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center whitespace-nowrap'>User Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center whitespace-nowrap'>Room Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center whitespace-nowrap'>CheckIn</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center whitespace-nowrap'>CheckOut</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center whitespace-nowrap'>Total Amount</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center whitespace-nowrap'>Payment</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((items, index) => (
                <tr key={index} className='hover:bg-gray-100 cursor-pointer transition-colors'>
                  <td className='py-3 px-4 text-gray-700 border-t text-center border-gray-300'>
                    #{items.userid}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t text-center border-gray-300'>
                    {items.user.username}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t text-center border-gray-300'>
                    {items.room.roomType}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t text-center border-gray-300 whitespace-nowrap'>
                    {new Date(items.checkInDate).toDateString()}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t text-center border-gray-300 whitespace-nowrap'>
                    {new Date(items.checkOutDate).toDateString()}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center whitespace-nowrap'>
                    ₹ {items.totalPrice}
                  </td>
                  <td className='py-3 px-4 border-t text-center border-gray-300'>
                    <button className={`px-3 py-1 text-xs ${items.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-700'} rounded-full mx-auto block`}>
                      {items.isPaid ? "Completed" : "Pending"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className='py-8 text-center text-gray-400 text-sm'>
                  No bookings found for "<span className='text-gray-600'>{search}</span>"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashBoard