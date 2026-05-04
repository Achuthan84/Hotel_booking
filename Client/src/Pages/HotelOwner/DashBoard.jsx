import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const DashBoard = () => {
  const { currency, axios, toast, user, getToken } = useAppContext();
  const [dashboardData, setDashBoardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchDashBoardData = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/bookings/hotel', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setDashBoardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchDashBoardData()
  }, [user])

  const filteredBookings = dashboardData.bookings.filter(item =>
    item.user.username.toLowerCase().includes(search.toLowerCase()) ||
    (item.user.lastName && item.user.lastName.toLowerCase().includes(search.toLowerCase())) ||
    String(item.userid).includes(search)
  )


  // ── Skeleton Components ──────────────────────────────────────────

  const SkeletonStatCard = () => (
    <div className='relative overflow-hidden border border-gray-100 rounded-2xl p-5 bg-white shadow-sm w-full sm:w-56 flex items-center gap-4'>
      <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent' />
      <div className='w-12 h-12 rounded-xl bg-gray-100' />
      <div className='space-y-2'>
        <div className='h-3 bg-gray-100 rounded-lg w-24' />
        <div className='h-4 bg-gray-100 rounded-lg w-16' />
      </div>
    </div>
  )

  const SkeletonRow = () => (
    <tr>
      {[60, 100, 90, 100, 100, 70, 70].map((w, i) => (
        <td key={i} className='py-4 px-4 border-t border-gray-100'>
          <div className='relative overflow-hidden rounded-lg bg-gray-100 mx-auto' style={{ width: w, height: 13 }}>
            <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent' />
          </div>
        </td>
      ))}
    </tr>
  )

  const SkeletonCard = () => (
    <div className='relative overflow-hidden border border-gray-100 rounded-2xl p-5 bg-white shadow-sm'>
      <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent' />
      <div className='flex justify-between items-center mb-3'>
        <div className='space-y-1.5'>
          <div className='h-3.5 bg-gray-100 rounded-lg w-28' />
          <div className='h-3 bg-gray-100 rounded-lg w-16' />
        </div>
        <div className='h-6 bg-gray-100 rounded-full w-20' />
      </div>
      <div className='h-3 bg-gray-100 rounded-lg w-24 mb-3' />
      <div className='flex justify-between'>
        <div className='h-3 bg-gray-100 rounded-lg w-28' />
        <div className='h-3 bg-gray-100 rounded-lg w-28' />
      </div>
      <div className='h-4 bg-gray-100 rounded-lg w-20 mt-3' />
    </div>
  )

  // ── Reusable Components ──────────────────────────────────────────

  const StatCard = ({ icon, label, value, color }) => (
    <div className='relative overflow-hidden border border-gray-100 rounded-2xl p-5 bg-white shadow-sm flex items-center gap-4 w-full sm:w-auto hover:shadow-md transition-shadow'>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <img src={icon} alt={label} className='h-6 w-6 object-contain' />
      </div>
      <div>
        <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>{label}</p>
        <p className='text-xl font-bold text-gray-800 mt-0.5'>{value}</p>
      </div>
    </div>
  )

  const PaymentBadge = ({ isPaid }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
      ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {isPaid ? 'Completed' : 'Pending'}
    </span>
  )

  // ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div>
        <Title
          align='left'
          font='outfit'
          title='Dashboard'
          subTitle='Monitor your room listings, track bookings and analyze revenue — all in one place.'
        />

        {/* ── Stat Cards ── */}
        <div className='flex flex-col sm:flex-row gap-4 my-8'>
          {loading ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <StatCard
                icon={assets.totalBookingIcon}
                label='Total Bookings'
                value={dashboardData.totalBookings}
                color='bg-blue-50'
              />
              <StatCard
                icon={assets.totalRevenueIcon}
                label='Total Revenue'
                value={`${currency} ${dashboardData.totalRevenue.toLocaleString()}`}
                color='bg-emerald-50'
              />
            </>
          )}
        </div>

        {/* ── Header + Search ── */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
          <div>
            <h2 className='text-base font-semibold text-gray-800'>Recent Bookings</h2>
            <p className='text-xs text-gray-400 mt-0.5'>
              {loading
                ? 'Loading...'
                : `${filteredBookings.length} booking${filteredBookings.length !== 1 ? 's' : ''} found`
              }
            </p>
          </div>

          <div className='flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white w-full sm:w-60 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all'>
            <img src={assets.searchIcon} alt='search' className='w-4 h-4 opacity-40 shrink-0' />
            <input
              type='text'
              placeholder='Search user or ID...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent'
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className='w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors shrink-0'
              >
                <svg className='w-2.5 h-2.5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile: Card View ── */}
        <div className='flex flex-col gap-3 md:hidden'>
          {loading
            ? Array(3).fill(null).map((_, i) => <SkeletonCard key={i} />)
            : filteredBookings.length > 0
              ? filteredBookings.map((items, index) => (
                <div key={index} className='border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow'>
                  <div className='flex justify-between items-start mb-3'>
                    <div>
                      <p className='font-semibold text-gray-900 text-sm'>{items.user.username}</p>
                      <p className='text-xs text-gray-400 mt-0.5'>#{items.userid}</p>
                    </div>
                    <PaymentBadge isPaid={items.isPaid} />
                  </div>
                  <p className='text-xs text-gray-400 mb-3 font-medium'>{items.room.roomType}</p>
                  <div className='flex justify-between text-xs bg-gray-50 rounded-xl px-3 py-2'>
                    <div>
                      <p className='text-gray-300 uppercase tracking-wide text-[10px] mb-0.5'>Check In</p>
                      <p className='text-gray-600 font-medium'>{new Date(items.checkInDate).toDateString()}</p>
                    </div>
                    <div className='w-px bg-gray-200' />
                    <div className='text-right'>
                      <p className='text-gray-300 uppercase tracking-wide text-[10px] mb-0.5'>Check Out</p>
                      <p className='text-gray-600 font-medium'>{new Date(items.checkOutDate).toDateString()}</p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-50'>
                    <p className='text-sm font-bold text-gray-800'>{currency} {items.totalPrice.toLocaleString()}</p>
                    <p className='text-xs text-gray-400'>Total Amount</p>
                  </div>
                </div>
              ))
              : (
                <div className='text-center py-16 text-gray-400'>
                  <svg className='w-12 h-12 mx-auto mb-3 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                  </svg>
                  <p className='text-sm'>
                    {search ? `No bookings found for "${search}"` : 'No bookings yet'}
                  </p>
                </div>
              )
          }
        </div>

        {/* ── Desktop: Table View ── */}
        <div className='hidden md:block w-full border border-gray-100 rounded-2xl overflow-hidden shadow-sm'>
          <div className='max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
            <table className='w-full'>
              <thead className='bg-gray-50 sticky top-0 z-10'>
                <tr>
                  {['User ID', 'User Name', 'Room', 'Check In', 'Check Out', 'Amount', 'Payment'].map((h) => (
                    <th key={h} className='py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center whitespace-nowrap'>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-50'>
                {loading
                  ? Array(5).fill(null).map((_, i) => <SkeletonRow key={i} />)
                  : filteredBookings.length > 0
                    ? filteredBookings.map((items, index) => (
                      <tr key={index} className='hover:bg-gray-50/70 transition-colors'>
                        <td className='py-4 px-4 text-center'>
                          <span className='text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded-lg'>
                            #{items.userid}
                          </span>
                        </td>
                        <td className='py-4 px-4 text-center text-sm font-medium text-gray-800'>{items.user.username}</td>
                        <td className='py-4 px-4 text-center text-sm text-gray-500'>{items.room.roomType}</td>
                        <td className='py-4 px-4 text-center text-sm text-gray-500 whitespace-nowrap'>
                          {new Date(items.checkInDate).toDateString()}
                        </td>
                        <td className='py-4 px-4 text-center text-sm text-gray-500 whitespace-nowrap'>
                          {new Date(items.checkOutDate).toDateString()}
                        </td>
                        <td className='py-4 px-4 text-center text-sm font-semibold text-gray-800 whitespace-nowrap'>
                          {currency} {items.totalPrice.toLocaleString()}
                        </td>
                        <td className='py-4 px-4 text-center'>
                          <PaymentBadge isPaid={items.isPaid} />
                        </td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={7} className='py-16 text-center'>
                          <svg className='w-12 h-12 mx-auto mb-3 text-gray-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                          </svg>
                          <p className='text-sm text-gray-400'>
                            {search ? `No bookings found for "${search}"` : 'No bookings yet'}
                          </p>
                        </td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashBoard