import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({ room, index }) => {
    return (
        <Link to={`/rooms/${room._id}`} onClick={() => window.scrollTo(0, 0)} key={room._id} className='relative max-w-70 w-full rounded-xl overflow-hidden
            bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] flex flex-col'>

            {/* Fixed height image */}
            <div className='w-full h-48 overflow-hidden'>
                <img src={room.images[0]} alt="room-img" className='w-full h-full object-cover' />
            </div>

            {index % 2 === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800
            font-medium rounded-full'>Best Seller</p>}

            {/* Content fills remaining height */}
            <div className='p-4 pt-5 flex flex-col flex-1'>
                <div className='flex items-center justify-between'>
                    <p className='font-playfair text-xl font-medium text-gray-800'>{room.hotel.name}</p>
                    <div className='flex items-center gap-1'>
                        <img src={assets.starIconFilled} alt="star-icon" /> 4.5
                    </div>
                </div>
                <div className='flex items-center gap-1 text-sm mt-1'>
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span className='truncate'>{room.hotel.address}</span>
                </div>
                <div className='flex items-center justify-between mt-auto pt-4'>
                    <p><span className='text-xl text-gray-800'>₹{room.pricePerNight}</span>/night</p>
                    <button className='px-4 py-2 text-sm font-medium border border-gray-300
                    rounded hover:bg-gray-50 transition-all cursor-pointer'>Book now</button>
                </div>
            </div>
        </Link>
    )
}

export default HotelCard