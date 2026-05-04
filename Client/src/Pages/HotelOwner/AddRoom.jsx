import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const AddRoom = () => {
  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
  const [loading, setLoading] = useState(false)
  const { axios, getToken } = useAppContext();

  const [input, setInput] = useState({
    roomType: '',
    pricePerNight: '0',
    amenities: {
      'Free WiFi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false,
    }
  })

  const imageCount = Object.values(images).filter(img => img).length;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (
      !input.roomType?.trim() ||
      !input.pricePerNight ||
      !Object.values(input.amenities).some(val => val) ||
      imageCount !== 4
    ) {
      toast.error("Please fill all details correctly");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('roomType', input.roomType);
      formData.append('pricePerNight', input.pricePerNight);
      const amenities = Object.keys(input.amenities).filter(key => input.amenities[key]);
      formData.append('amenities', JSON.stringify(amenities));
      Object.keys(images).forEach((key) => {
        images[key] && formData.append('images', images[key])
      })

      const token = await getToken()
      const { data } = await axios.post('/api/rooms/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success(data.message)
        setInput({
          roomType: '',
          pricePerNight: '0',
          amenities: {
            'Free WiFi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false,
          }
        })
        setImages({ 1: null, 2: null, 3: null, 4: null })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to add room")
    } finally {
      setLoading(false)
    }
  }

  // Amenity icons map
  const amenityIcons = {
    'Free WiFi': '📶',
    'Free Breakfast': '🍳',
    'Room Service': '🛎️',
    'Mountain View': '🏔️',
    'Pool Access': '🏊',
  }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes progress {
          0% { width: 0% }
          100% { width: 100% }
        }
      `}</style>

      {/* Top progress bar when loading */}
      {loading && (
        <div className='fixed top-0 left-0 right-0 z-50 h-0.5 bg-gray-100'>
          <div className='h-full bg-primary animate-[progress_2s_ease-in-out_infinite]' />
        </div>
      )}

      <form onSubmit={onSubmitHandler} className={`transition-opacity duration-300 ${loading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        <Title
          align='left'
          font='outfit'
          title='Add Room'
          subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, enhance the user booking experience'
        />

        {/* ── Image Upload ── */}
        <div className='mt-10'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-gray-800 font-medium'>Room Images</p>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
              imageCount === 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {imageCount}/4 uploaded
            </span>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {Object.keys(images).map((key) => (
              <label
                htmlFor={`roomImages${key}`}
                key={key}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200
                  ${images[key]
                    ? 'border-emerald-400 shadow-sm'
                    : 'border-dashed border-gray-200 hover:border-primary/50 bg-gray-50'
                  }`}
              >
                {images[key] ? (
                  <>
                    <img
                      className='h-28 w-full object-cover'
                      src={URL.createObjectURL(images[key])}
                      alt=''
                    />
                    {/* Overlay on hover */}
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <p className='text-white text-xs font-medium'>Change</p>
                    </div>
                    {/* Checkmark badge */}
                    <span className='absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center'>
                      <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                      </svg>
                    </span>
                  </>
                ) : (
                  <div className='h-28 flex flex-col items-center justify-center gap-1.5'>
                    <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                      <svg className='w-4 h-4 text-gray-400 group-hover:text-primary transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                      </svg>
                    </div>
                    <p className='text-xs text-gray-400 group-hover:text-primary transition-colors'>Photo {key}</p>
                  </div>
                )}
                <input
                  type='file'
                  accept='image/*'
                  id={`roomImages${key}`}
                  hidden
                  onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}
                />
              </label>
            ))}
          </div>
        </div>

        {/* ── Room Type + Price ── */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8'>
          <div>
            <p className='text-gray-700 text-sm font-medium mb-1.5'>Room Type</p>
            <select
              value={input.roomType}
              onChange={(e) => setInput({ ...input, roomType: e.target.value })}
              className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'
            >
              <option value=''>Select Room Type</option>
              <option value='Single Bed'>Single Bed</option>
              <option value='Double Bed'>Double Bed</option>
              <option value='Luxury Room'>Luxury Room</option>
              <option value='Family Suite'>Family Suite</option>
            </select>
          </div>

          <div>
            <p className='text-gray-700 text-sm font-medium mb-1.5'>Price <span className='text-gray-400 font-normal'>/ Night</span></p>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>₹</span>
              <input
                type='number'
                placeholder='0'
                className='w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'
                onChange={(e) => setInput({ ...input, pricePerNight: e.target.value })}
                value={input.pricePerNight}
              />
            </div>
          </div>
        </div>

        {/* ── Amenities ── */}
        <div className='mt-6'>
          <p className='text-gray-700 text-sm font-medium mb-3'>Amenities</p>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
            {Object.keys(input.amenities).map((amenity, index) => (
              <label
                key={index}
                htmlFor={`amenities${index + 1}`}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-150 select-none
                  ${input.amenities[amenity]
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <input
                  type='checkbox'
                  id={`amenities${index + 1}`}
                  checked={input.amenities[amenity]}
                  className='hidden'
                  onChange={() => setInput({
                    ...input,
                    amenities: { ...input.amenities, [amenity]: !input.amenities[amenity] }
                  })}
                />
                <span className='text-base'>{amenityIcons[amenity]}</span>
                <span className='text-sm font-medium'>{amenity}</span>
                {input.amenities[amenity] && (
                  <svg className='w-3.5 h-3.5 ml-auto text-emerald-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                  </svg>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* ── Submit Button ── */}
        <button
          type='submit'
          disabled={loading}
          className='mt-8 mb-5 w-full sm:w-auto px-10 py-2.5 rounded-xl bg-primary text-white text-sm font-medium
            flex items-center justify-center gap-2 transition-all duration-200
            hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {loading ? (
            <>
              <svg className='animate-spin w-4 h-4 text-white' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
              </svg>
              Adding Room...
            </>
          ) : (
            <>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
              </svg>
              Add Room
            </>
          )}
        </button>
      </form>
    </>
  )
}

export default AddRoom