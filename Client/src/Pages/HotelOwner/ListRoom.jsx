import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ListRoom = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)
  const { axios, currency, getToken, user } = useAppContext();

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/rooms/owner', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setRooms(data.rooms)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (roomId) => {
    setTogglingId(roomId)
    try {
      const { data } = await axios.post('/api/rooms/toggle-availability', { roomId }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        fetchRooms()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setTogglingId(null)
    }
  }

  useEffect(() => {
    if (user) fetchRooms()
  }, [user])

  // ── Skeleton Components ──────────────────────────────────────────

  const SkeletonCard = () => (
    <div className='relative overflow-hidden border border-gray-100 rounded-2xl p-5 bg-white shadow-sm'>
      <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent' />
      <div className='flex justify-between items-start mb-4'>
        <div className='space-y-2'>
          <div className='h-4 bg-gray-100 rounded-lg w-32'></div>
          <div className='h-3 bg-gray-100 rounded-lg w-48'></div>
        </div>
        <div className='h-4 bg-gray-100 rounded-lg w-20'></div>
      </div>
      <div className='flex items-center justify-between mt-4'>
        <div className='h-6 bg-gray-100 rounded-full w-24'></div>
        <div className='h-7 bg-gray-100 rounded-full w-14'></div>
      </div>
    </div>
  )

  const SkeletonRow = () => (
    <tr>
      {[140, 200, 80, 100].map((w, i) => (
        <td key={i} className='py-4 px-4 border-t border-gray-100'>
          <div className='relative overflow-hidden rounded-lg bg-gray-100' style={{ width: w, height: 14 }}>
            <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent' />
          </div>
        </td>
      ))}
    </tr>
  )

  // ── Toggle Knob ──────────────────────────────────────────────────

  const ToggleSwitch = ({ item }) => (
    <label className='relative inline-flex items-center cursor-pointer gap-3'>
      <input
        type='checkbox'
        className='sr-only peer'
        checked={item.isAvailable || false}
        onChange={() => toggleAvailability(item._id)}
        disabled={togglingId === item._id}
      />
      <div className={`relative w-12 h-6 rounded-full transition-all duration-300 
        ${item.isAvailable ? 'bg-emerald-500' : 'bg-gray-300'}
        ${togglingId === item._id ? 'opacity-70' : ''}
      `}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md
          flex items-center justify-center transition-all duration-300
          ${item.isAvailable ? 'translate-x-6' : 'translate-x-0'}
        `}>
          {togglingId === item._id && (
            <svg className='animate-spin w-3 h-3 text-emerald-500' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
            </svg>
          )}
        </span>
      </div>
      <span className={`text-xs font-medium ${item.isAvailable ? 'text-emerald-600' : 'text-gray-400'}`}>
        {togglingId === item._id ? 'Saving...' : item.isAvailable ? 'Available' : 'Unavailable'}
      </span>
    </label>
  )

  // ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Shimmer keyframe injected once */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <Title
        align='left'
        font='outfit'
        title='Room Listings'
        subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.'
      />

      <div className='flex items-center justify-between mt-8 mb-3'>
        <p className='text-gray-500 text-sm font-medium'>
          {loading ? 'Fetching rooms...' : `${rooms.length} room${rooms.length !== 1 ? 's' : ''} listed`}
        </p>
        {!loading && (
          <button
            onClick={fetchRooms}
            className='text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors flex items-center gap-1'
          >
            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
            </svg>
            Refresh
          </button>
        )}
      </div>

      {/* ── Mobile View ── */}
      <div className='flex flex-col gap-3 md:hidden'>
        {loading
          ? Array(3).fill(null).map((_, i) => <SkeletonCard key={i} />)
          : rooms.length === 0
            ? (
              <div className='text-center py-16 text-gray-400'>
                <svg className='w-12 h-12 mx-auto mb-3 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                </svg>
                <p className='text-sm'>No rooms listed yet</p>
              </div>
            )
            : rooms.map((item) => (
              <div key={item._id} className='border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <p className='font-semibold text-gray-900'>{item.roomType}</p>
                    <p className='text-gray-400 text-xs mt-1 leading-relaxed'>{item.amenities.join(', ')}</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-bold text-gray-800'>{currency} {item.pricePerNight}</p>
                    <p className='text-gray-400 text-xs'>per night</p>
                  </div>
                </div>
                <div className='flex items-center justify-between pt-3 border-t border-gray-50'>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${item.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'}`}>
                    {item.isAvailable ? '● Available' : '● Unavailable'}
                  </span>
                  <ToggleSwitch item={item} />
                </div>
              </div>
            ))
        }
      </div>

      {/* ── Desktop View ── */}
      <div className='hidden md:block w-full border border-gray-100 rounded-2xl overflow-hidden shadow-sm mt-0'>
        <div className='max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
          <table className='w-full'>
            <thead className='bg-gray-50 sticky top-0 z-10'>
              <tr>
                {['Name', 'Facility', 'Price / Night', 'Availability'].map((h) => (
                  <th key={h} className='py-3.5 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-50'>
              {loading
                ? Array(4).fill(null).map((_, i) => <SkeletonRow key={i} />)
                : rooms.length === 0
                  ? (
                    <tr>
                      <td colSpan={4} className='py-16 text-center text-gray-400'>
                        <svg className='w-12 h-12 mx-auto mb-3 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                        </svg>
                        <p className='text-sm'>No rooms listed yet</p>
                      </td>
                    </tr>
                  )
                  : rooms.map((item) => (
                    <tr key={item._id} className='hover:bg-gray-50/70 transition-colors group'>
                      <td className='py-4 px-5 text-sm font-medium text-gray-800'>{item.roomType}</td>
                      <td className='py-4 px-5 text-sm text-gray-500 max-w-xs truncate'>{item.amenities.join(', ')}</td>
                      <td className='py-4 px-5 text-sm font-semibold text-gray-800'>{currency}  {item.pricePerNight}</td>
                      <td className='py-4 px-5'>
                        <ToggleSwitch item={item} />
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ListRoom