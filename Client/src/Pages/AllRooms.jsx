import React, { useMemo, useState } from 'react'
import Title from '../components/Title'
import { assets, facilityIcons } from '../assets/assets'
import { useSearchParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { useAppContext } from '../context/AppContext'

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input
                type="checkbox"
                checked={selected}
                onChange={(e) => onChange(e.target.checked, label)}
            />
            <span className="font-light">{label}</span>
        </label>
    );
};

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input
                type="radio"
                name="sortOption"
                checked={selected}
                onChange={() => onChange(label)}
            />
            <span className="font-light">{label}</span>
        </label>
    );
};

const AllRooms = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { rooms, toast, navigate, currency } = useAppContext();
    const [openFiles, setOpenFiles] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        roomTypes: [],
        priceRange: []
    })
    const [selectedSort, setSelectedSort] = useState('')
    const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"]
    const priceRange = ['0 to 1000', '1000 to 3000', '3000 to 6000', '6000 to 10000']
    const sortOption = ["Price Low to High", "Price High to Low", "Newest First"]

    const handleFilterChange = (checked, value, type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (checked) {
                updatedFilters[type].push(value);
            } else {
                updatedFilters[type] = updatedFilters[type].filter(item => item !== value);
            }
            return updatedFilters;
        })
    }

    const handleSortChange = (sortOption) => {
        setSelectedSort(sortOption);
    }

    const matchesRoomType = (room) => {
        return selectedFilters.roomTypes.length === 0 || selectedFilters.roomTypes
            .includes(room.roomType);
    }

    const matchesPriceRange = (room) => {
        return selectedFilters.priceRange.length === 0 || selectedFilters
            .priceRange.some(range => {
                const cleanRange = range.replace(currency, '').trim();
                const [min, max] = cleanRange.split(' to ').map(Number);
                return room.pricePerNight >= min && room.pricePerNight <= max;
            })
    }

    const sortRooms = (a, b) => {
        if (selectedSort === 'Price Low to High') {
            return a.pricePerNight - b.pricePerNight;
        }
        if (selectedSort === 'Price High to Low') {
            return b.pricePerNight - a.pricePerNight;
        }
        if (selectedSort === 'Newest First') {
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return 0;
    }

    const filterDestination = (room) => {
        const destination = searchParams.get('destination');
        if (!destination) return true;
        return room.hotel.city.toLowerCase().includes(destination.toLowerCase())
    }

    const filteredRooms = useMemo(() => {
        return rooms.filter(room => matchesRoomType(room) && matchesPriceRange
            (room) && filterDestination(room)).sort(sortRooms);
    }, [rooms, selectedFilters, selectedSort, searchParams])

    const clearFilters = () => {
        setSelectedFilters({
            roomTypes: [],
            priceRange: [],
        });
        setSelectedSort('');
        setSearchParams({});
    }


    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            {/* Room List */}
            <div className='w-full lg:flex-1 lg:pr-8'>
                <div className='flex flex-col items-start text-left'>
                    <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
                </div>
                {filteredRooms.map((room) => (
                    <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                        <img
                            onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }}
                            src={room.images[0]}
                            alt="hotel-img"
                            title='View Rooms Details'
                            className='w-full md:w-1/2 max-h-65 shrink-0 rounded-xl shadow-lg object-cover cursor-pointer'
                        />
                        <div className='w-full md:w-1/2 flex flex-col gap-2'>
                            <p className='text-gray-500'>{room.hotel.city}</p>
                            <p onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }} className='text-gray-800 text-3xl font-playfair cursor-pointer'>{room.hotel.name}</p>
                            <div className='flex items-center'>
                                <StarRating />
                                <p className='ml-2'>200+ Reviews</p>
                            </div>
                            <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                                <img src={assets.locationIcon} alt="location-icon" />
                                <span>{room.hotel.address}</span>
                            </div>
                            {/* Room Amenities */}
                            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Room price per night */}
                            <p className='text-xl font-medium text-gray-700'>{currency} {room.pricePerNight} / Night</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className='bg-white w-full lg:w-80 shrink-0 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16'>
                <div className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-400 ${openFiles && "border-b"}`}>
                    <p className='text-base font-medium text-gray-800'>FILTERS</p>
                    <div className='text-xs cursor-pointer'>
                        <span className='lg:hidden' onClick={() => setOpenFiles(!openFiles)}>{openFiles ? 'HIDE' : 'SHOW'}</span>
                        <span onClick={clearFilters} className='hidden lg:block'>CLEAR</span> {/* ✅ wired clearFilters to CLEAR button */}
                    </div>
                </div>
                <div className={`${openFiles ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                    <div className="px-5 pt-5">
                        <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox
                                key={index}
                                label={room}
                                selected={selectedFilters.roomTypes.includes(room)}
                                onChange={(checked, label) => handleFilterChange(checked, label, 'roomTypes')}
                            />
                        ))}
                    </div>
                    <div className="px-5 pt-5">
                        <p className="font-medium text-gray-800 pb-2">Price Range</p>
                        {priceRange.map((range, index) => (
                            <CheckBox
                                key={index}
                                label={`${currency} ${range}`}
                                selected={selectedFilters.priceRange.includes(`${currency} ${range}`)}
                                onChange={(checked, label) => handleFilterChange(checked, label, 'priceRange')}
                            />
                        ))}
                    </div>
                    <div className="px-5 pt-5 pb-7">
                        <p className="font-medium text-gray-800 pb-2">Sort By</p>
                        {sortOption.map((option, index) => (
                            <RadioButton
                                key={index}
                                label={option}
                                selected={selectedSort === option}
                                onChange={handleSortChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllRooms