import React, { useState } from 'react'
import Title from '../../components/Title'
import { roomsDummyData } from '../../assets/assets'

const ListRoom = () => {
  const [room, setRoom] = useState(roomsDummyData)

  const toggleAvailability = (index) => {
    const updatedRooms = room.map((item, i) =>
      i === index ? { ...item, isAvailable: !item.isAvailable } : item
    )
    setRoom(updatedRooms)
  }

  return (
    <div>
      <Title align="left" font="outfit" title="Room Listings" subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users." />
      <p className='text-gray-500 mt-8'>All Rooms</p>
      <div className='flex flex-col gap-3 mt-3 md:hidden'>
        {room.map((item, index) => (
          <div key={index} className='border border-gray-300 rounded-lg p-4 text-sm text-gray-700'>
            <div className='flex justify-between items-start mb-2'>
              <div>
                <p className='font-medium text-gray-900 text-base'>{item.roomType}</p>
                <p className='text-gray-500 text-xs mt-1'>{item.amenities.join(', ')}</p>
              </div>
              <p className='font-medium text-gray-800'>₹{item.pricePerNight}<span className='text-xs text-gray-400'>/night</span></p>
            </div>
            <div className='flex items-center justify-between mt-3'>
              <span className={`text-xs px-2 py-1 rounded-full ${item.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </span>
              {/* Toggle */}
              <label className='relative inline-flex items-center cursor-pointer gap-2'>
                <input
                  type="checkbox"
                  className='sr-only peer'
                  checked={item.isAvailable || false}
                  onChange={() => toggleAvailability(index)}
                />
                <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200 relative'>
                  <span className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${item.isAvailable ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
      <div className='hidden md:block w-full text-left border border-gray-400 rounded-lg max-h-96 overflow-y-scroll scroll-smooth [&::-webkit-scrollbar]:hidden mt-3'>
        <table className='w-full'>
          <thead className='bg-gray-300 sticky top-0 z-10'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium whitespace-nowrap'>Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium whitespace-nowrap'>Facility</th>
              <th className='py-3 px-4 text-gray-800 font-medium whitespace-nowrap'>Price/Night</th>
              <th className='py-3 px-4 text-gray-800 font-medium whitespace-nowrap text-center'>Action</th>
            </tr>
          </thead>
          <tbody className='text-md'>
            {room.map((item, index) => (
              <tr key={index} className='hover:bg-gray-50 transition-colors'>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.roomType}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.amenities.join(', ')}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>₹{item.pricePerNight}</td>
                <td className='py-3 px-4 border-t border-gray-300 text-center'>
                  <label className='relative inline-flex items-center cursor-pointer gap-2'>
                    <input
                      type="checkbox"
                      className='sr-only peer'
                      checked={item.isAvailable || false}
                      onChange={() => toggleAvailability(index)}
                    />
                    <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200 relative'>
                      <span className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${item.isAvailable ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </div>
                    <span className={`text-xs ${item.isAvailable ? 'text-green-600' : 'text-red-400'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListRoom