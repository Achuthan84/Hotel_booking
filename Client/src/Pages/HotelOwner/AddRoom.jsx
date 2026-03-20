import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'

const AddRoom = () => {
  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
  const [input, setInput] = useState({
    roomType: '',
    pricePerNight: '0',
    amenities: {
      'Free Wifi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false,
    }
  })

  return (
    <form>
      <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, enhance the user booking experience' />
      {/* Upload Images */}
      <p className='text-gray-800 mt-10'>Images</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImages${key}`} key={key}>
            <img
              className='h-20 sm:h-24 w-full sm:w-36 object-cover cursor-pointer border border-gray-500 rounded-sm'
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
              alt=""/>
            <input
              type="file"
              accept='image/*'
              id={`roomImages${key}`}
              hidden
              onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}
            />
          </label>
        ))}
      </div>

      {/* Room Type + Price */}
      <div className='w-full flex flex-col sm:flex-row sm:gap-4 mt-4'>
        <div className='w-full sm:max-w-48'>
          <p className='text-gray-800 mt-4'>Room Type</p>
          <select
            value={input.roomType}
            onChange={(e) => setInput({ ...input, roomType: e.target.value })}
            className='border opacity-70 border-gray-500 mt-1 rounded p-2 w-full'
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suit">Family Suit</option>
          </select>
        </div>
        <div className='w-full sm:w-auto'>
          <p className='mt-4 text-gray-800'>Price <span className='text-xs'>/Night</span></p>
          <input
            type="number"
            placeholder='0'
            className='border border-gray-500 mt-1 rounded p-2 w-full sm:w-24'
         
            onChange={(e) => setInput({ ...input, pricePerNight: e.target.value })}
            value={input.pricePerNight}
          />
        </div>
      </div>

      {/* Amenities */}
      <p className='text-gray-800 mt-4'>Amenities</p>
      <div className='flex flex-wrap gap-x-6 gap-y-2 mt-1 text-gray-700 max-w-sm'>
        {Object.keys(input.amenities).map((amenity, index) => (
          <div key={index} className='flex items-center gap-2'>
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={input.amenities[amenity]}
              onChange={() => setInput({ ...input, amenities: { ...input.amenities, [amenity]: !input.amenities[amenity] } })}
            />
            <label htmlFor={`amenities${index + 1}`} className='cursor-pointer text-l'>{amenity}</label>
          </div>
        ))}
      </div>
      <button className='bg-primary text-white px-8 py-2 rounded mt-8 mb-5 cursor-pointer w-full sm:w-auto'>
        Add Room
      </button>
    </form>
  )
}

export default AddRoom