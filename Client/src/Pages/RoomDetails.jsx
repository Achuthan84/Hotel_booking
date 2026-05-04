import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import StarRating from '../components/StarRating'
import { useAppContext } from '../context/AppContext';

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, getToken, axios, navigate, currency, toast } = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  const checkAvailability = async () => {
    try {
      if (checkInDate >= checkOutDate) {
        toast.error('Check-In Date should be less than Check-Out Date')
        return;
      }
      const { data } = await axios.post('/api/bookings/check-availability',
        { room: id, checkInDate, checkOutDate },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true)
          toast.success('Room is available')
        } else {
          setIsAvailable(false)
          toast.error('Room is not available')
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (!isAvailable) {
        return checkAvailability();
      } else {
        const { data } = await axios.post('/api/bookings/book',
          { room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay At Hotel" },
          { headers: { Authorization: `Bearer ${await getToken()}` } }
        )
        if (data.success) {
          toast.success(data.message)
          navigate('/my-bookings')
          window.scrollTo(0, 0)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const room = rooms.find(room => room._id === id)
    room && setRoom(room)
    room && setMainImage(room.images[0])
  }, [rooms])

  return room && (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>

      {/* room details */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name} <span className='font-inner text-sm'>({room.roomType})</span> </h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
      </div>

      {/* room ratings */}
      <div className='flex items-center gap-1 mt-2'>
        <StarRating />
        <p className='ml-2'>200+ reviews </p>
      </div>

      {/* room Address */}
      <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <img src={assets.locationIcon} alt="locationIcon" />
        <span>{room.hotel.address}</span>
      </div>

      {/* room images */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        {/* Main Image */}
        <div className='lg:w-1/2 w-full h-72 lg:h-96'>
          <img
            src={mainImage}
            alt="roomImage"
            className='w-full h-full rounded-xl shadow-lg object-cover'
          />
        </div>
        {/* Thumbnail Grid */}
        <div className='cursor-pointer grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
          {room?.images.length > 1 && room.images.map((img, index) => (
            <div key={index} className='h-32 lg:h-44'>
              <img
                onClick={() => setMainImage(img)}
                src={img}
                alt='roomImage'
                className={`w-full h-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === img ? 'outline outline-3 outline-orange-500' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* room highlight */}
      <div className='flex flex-col md:flex-row md:justify-between mt-10'>
        <div className='flex flex-col'>
          <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            {room.amenities.map((item, index) => (
              <div key={index} className='flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100'>
                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                <p className='text-xs'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        {/* room price */}
        <p className='text-2xl font-medium'>{currency}{room.pricePerNight}/Night</p>
      </div>

      {/* checkIn and checkOut form */}
      <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
        <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
          <div className='flex flex-col'>
            <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
            <input onChange={(e) => setCheckInDate(e.target.value)} min={new Date().toISOString().split('T')[0]} type="date" id='checkInDate' className='w-full cursor-pointer rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
          </div>
        </div>
        <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
        <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
          <div className='flex flex-col'>
            <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
            <input onChange={(e) => setCheckOutDate(e.target.value)} min={checkInDate} disabled={!checkInDate} type="date" id='checkOutDate' className='w-full cursor-pointer rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
          </div>
        </div>
        <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
        <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
          <div className='flex flex-col'>
            <label htmlFor="guest" className='font-medium'>Guests</label>
            <input onChange={(e) => setGuests(e.target.value)} value={guests} min={1} max={10} type="number" id='guest' className='max-w-20 cursor-pointer rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
          </div>
        </div>
        <button type="submit" className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer">
          {isAvailable ? "Book Now" : "Check Availability"}
        </button>
      </form>

      {/* common spec */}
      <div className='mt-25 space-y-4'>
        {roomCommonData.map((spec, index) => (
          <div key={index} className='flex items-start gap-2'>
            <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6-5' />
            <div>
              <p className='text-base'>{spec.title}</p>
              <p className='text-gray-500'>{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
        <p>Guests will be allocated on the ground floor according to availability.
          You get a comfortable Two bedroom apartment has a true city feeling. The
          price quoted is for two guest, at the guest slot please mark the number of
          guests to get the exact price for groups. The Guests will be allocated
          ground floor according to availability. You get the comfortable two bedroom
          apartment that has a true city feeling.</p>
      </div>

      {/* Map */}
      <div className='my-10'>
        <h2 className="text-2xl font-playfair mb-4">Location on map</h2>
        <div className="w-full rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.1556546169886!2d78.10701157953339!3d9.920991564861277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c58773fc0a57%3A0xd6b45ba629dda796!2sHotel%20Royal%20Court!5e0!3m2!1sen!2sin!4v1773587017501!5m2!1sen!2sin"
            className="w-full lg:h-150 h-100"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-4">
          <p className="text-lg">Periyar, Madurai, TamilNadu</p>
          <p className="text-gray-500 text-sm mt-1">It's like a home away from home.</p>
        </div>
      </div>

      {/* Hosted by */}
      <div className='flex flex-col items-start gap-4'>
        <div className='flex gap-4'>
          <img src={assets.vijay} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
          <div>
            <p className='text-lg md:text-xl'>Hosted By {room.hotel.name}</p>
            <div className='flex items-center mt-1'>
              <StarRating />
              <p className='ml-2'>200+ reviews</p>
            </div>
          </div>
        </div>
        <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>
          Contact Now
        </button>
      </div>

    </div>
  )
}

export default RoomDetails