import React, { useEffect, useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, BuildingIcon, UserIcon, CreditCardIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import UserLayout from '../../components/UserLayout';
import SearchFilters from '../../components/SearchFilters';
import FacilityCard from '../../components/FacilityCard';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import CalendarBookingView from '../../components/CalendarBookingView';
// Mock data
const mockFacilities = [{
  id: 1,
  name: 'Main Study Room',
  type: 'study-room',
  description: 'A quiet study room with 10 individual desks and power outlets.',
  image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  availableHours: '8:00 AM - 10:00 PM',
  capacity: 10,
  creditCost: 5,
  location: 'Building A, Floor 2'
}, {
  id: 2,
  name: 'Computer Lab A',
  type: 'lab',
  description: 'Computer lab with 20 workstations with specialized software.',
  image: 'https://images.unsplash.com/photo-1581092921461-fd0e5756a5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  availableHours: '9:00 AM - 9:00 PM',
  capacity: 20,
  creditCost: 8,
  location: 'Building B, Floor 1'
}, {
  id: 3,
  name: 'Indoor Basketball Court',
  type: 'sports-hall',
  description: 'Full-size indoor basketball court with seating for spectators.',
  image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  availableHours: '8:00 AM - 8:00 PM',
  capacity: 30,
  creditCost: 15,
  location: 'Sports Complex, Ground Floor'
}, {
  id: 4,
  name: 'Conference Room B',
  type: 'meeting-room',
  description: 'Professional meeting room with projector and whiteboard.',
  image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  availableHours: '9:00 AM - 6:00 PM',
  capacity: 12,
  creditCost: 10,
  location: 'Admin Building, Floor 3'
}];
const facilityTypes = [{
  value: 'study-room',
  label: '📚 Study Room'
}, {
  value: 'lab',
  label: '🧑‍💻 Computer Lab'
}, {
  value: 'sports-hall',
  label: '🏀 Sports Hall'
}, {
  value: 'meeting-room',
  label: '👥 Meeting Room'
}, {
  value: 'auditorium',
  label: '🎭 Auditorium'
}, {
  value: 'library',
  label: '📖 Library'
}];
// Generate time slots from 8 AM to 10 PM
const generateTimeSlots = date => {
  const slots = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedDate = new Date(date);
  // Check if the date is today
  const isToday = selectedDate.getTime() === today.getTime();
  for (let hour = 8; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      // For today, don't show past time slots
      if (isToday) {
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hour, minute);
        if (slotTime <= now) continue;
      }
      // Randomly assign status for demo
      let status = 'available';
      const random = Math.random();
      if (random < 0.2) status = 'booked';else if (random < 0.3) status = 'blocked';else if (random < 0.35) status = 'released';
      slots.push({
        time,
        status
      });
    }
  }
  return slots;
};
const BookingFlow = ({
  user,
  onLogout
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bookingType, setBookingType] = useState('pre-booking');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [booking, setBooking] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    facilityType: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    showAvailableOnly: false,
    showReleasedOnly: false
  });
  // Mock existing bookings for the selected facility
  const [existingBookings, setExistingBookings] = useState([]);
  useEffect(() => {
    if (currentStep === 1) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFacilities(mockFacilities);
        setIsLoading(false);
      }, 1000);
    }
  }, [currentStep]);
  useEffect(() => {
    if (selectedFacility) {
      // Simulate fetching existing bookings for the facility
      setIsLoading(true);
      setTimeout(() => {
        // Generate some random bookings for demo purposes
        const today = new Date();
        const bookings = [];
        // Add a few bookings for the next 7 days
        for (let i = 0; i < 7; i++) {
          const bookingDate = new Date(today);
          bookingDate.setDate(today.getDate() + i);
          // Random number of bookings per day (0-3)
          const numBookings = Math.floor(Math.random() * 4);
          for (let j = 0; j < numBookings; j++) {
            // Random start hour between 8 AM and 8 PM
            const startHour = Math.floor(Math.random() * 12) + 8;
            // Random start minute (0, 15, 30, 45)
            const startMinute = Math.floor(Math.random() * 4) * 15;
            // Random duration (1-3 hours)
            const durationHours = Math.floor(Math.random() * 3) + 1;
            // Calculate end time
            const endHour = startHour + durationHours;
            const endMinute = startMinute;
            bookings.push({
              id: `booking-${i}-${j}`,
              date: bookingDate.toISOString().split('T')[0],
              startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
              endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
              status: Math.random() > 0.8 ? 'released' : 'booked'
            });
          }
        }
        setExistingBookings(bookings);
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedFacility]);
  const handleSearch = searchFilters => {
    setIsLoading(true);
    // Simulate API call with filters
    setTimeout(() => {
      let filteredFacilities = [...mockFacilities];
      // Apply filters (simplified for demo)
      if (searchFilters.searchTerm) {
        filteredFacilities = filteredFacilities.filter(facility => facility.name.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()));
      }
      if (searchFilters.facilityType) {
        filteredFacilities = filteredFacilities.filter(facility => facility.type === searchFilters.facilityType);
      }
      setFacilities(filteredFacilities);
      setIsLoading(false);
    }, 800);
  };
  const handleSelectFacility = facility => {
    setSelectedFacility(facility);
    setCurrentStep(2);
  };
  const handleDateChange = date => {
    setSelectedDate(date);
  };
  const handleTimeBlockSelect = (startTime, endTime, blockDuration) => {
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setDuration(blockDuration);
  };
  const handleConfirmBooking = () => {
    if (!selectedStartTime || !selectedEndTime) {
      alert('Please select a time slot by creating a time block on the calendar.');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newBooking = {
        id: `booking-${Date.now()}`,
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.name,
        facilityType: selectedFacility.type,
        date: selectedDate.toISOString().split('T')[0],
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        bookingType,
        status: 'confirmed',
        creditCost: selectedFacility.creditCost * duration
      };
      setBooking(newBooking);
      setCurrentStep(3);
      setIsLoading(false);
    }, 1500);
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select a Facility
            </h2>
            <SearchFilters filters={filters} setFilters={setFilters} facilityTypes={facilityTypes} onSearch={handleSearch} />
            {isLoading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div> : facilities.length === 0 ? <div className="text-center py-10">
                <BuildingIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No facilities found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search filters.
                </p>
              </div> : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                {facilities.map(facility => <FacilityCard key={facility.id} facility={facility} onClick={handleSelectFacility} showDetails={false} />)}
              </div>}
          </div>;
      case 2:
        return <div>
            <button onClick={() => setCurrentStep(1)} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-4">
              <ChevronLeftIcon className="mr-1 h-5 w-5" />
              Back to Facilities
            </button>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-start">
                  <div className="flex-shrink-0 w-full md:w-1/3 h-48 bg-gray-200 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                    {selectedFacility.image ? <img src={selectedFacility.image} alt={selectedFacility.name} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-6xl">
                        {facilityTypes.find(t => t.value === selectedFacility.type)?.label.split(' ')[0] || '🏢'}
                      </div>}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedFacility.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedFacility.description}
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <BuildingIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>{selectedFacility.location}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>{selectedFacility.availableHours}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>Capacity: {selectedFacility.capacity}</p>
                      </div>
                      <div className="flex items-center text-sm text-blue-600 font-medium">
                        <CreditCardIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-500" />
                        <p>{selectedFacility.creditCost} credits/hour</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Booking Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={`
                          border rounded-lg p-4 cursor-pointer
                          ${bookingType === 'pre-booking' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
                        `} onClick={() => setBookingType('pre-booking')}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Pre-booking
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              Book in advance for a future date and time
                            </p>
                          </div>
                          {bookingType === 'pre-booking' && <CheckIcon className="h-5 w-5 text-blue-500" />}
                        </div>
                      </div>
                      <div className={`
                          border rounded-lg p-4 cursor-pointer
                          ${bookingType === 'ad-hoc' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
                        `} onClick={() => setBookingType('ad-hoc')}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Ad-hoc Booking
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              Book for immediate use (today only)
                            </p>
                          </div>
                          {bookingType === 'ad-hoc' && <CheckIcon className="h-5 w-5 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Calendar Booking View Component */}
            {isLoading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div> : <CalendarBookingView facility={selectedFacility} existingBookings={existingBookings} onTimeBlockSelect={handleTimeBlockSelect} selectedDate={selectedDate} onDateChange={setSelectedDate} />}
            {selectedStartTime && selectedEndTime && <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-4 sm:p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Booking Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Facility:</span>
                      <span className="text-gray-900 font-medium">
                        {selectedFacility.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-900">
                        {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Time:</span>
                      <span className="text-gray-900">
                        {selectedStartTime} - {selectedEndTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Booking Type:</span>
                      <span className="text-gray-900 capitalize">
                        {bookingType}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-900">Total Credits:</span>
                      <span className="text-blue-600">
                        {selectedFacility.creditCost * duration} credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>}
            <div className="flex justify-between">
              <button onClick={() => setCurrentStep(1)} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <ChevronLeftIcon className="-ml-1 mr-2 h-5 w-5" />
                Back
              </button>
              <button onClick={handleConfirmBooking} disabled={!selectedStartTime || !selectedEndTime || isLoading} className={`
                  inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                  ${!selectedStartTime || !selectedEndTime || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                `}>
                {isLoading ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </> : <>
                    Confirm Booking
                    <ChevronRightIcon className="ml-2 -mr-1 h-5 w-5" />
                  </>}
              </button>
            </div>
          </div>;
      case 3:
        return <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-3 text-lg font-medium text-gray-900">
                Booking Confirmed!
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your booking has been confirmed. Please check in within 15
                minutes of your booking start time.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Booking ID
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {booking.id}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Facility
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {booking.facilityName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Time
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {booking.startTime} - {booking.endTime}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Booking Type
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 capitalize">
                          {booking.bookingType}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Credits Used
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-blue-600">
                          {booking.creditCost} credits
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Remaining Credits
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-blue-600">
                          {user.credits - booking.creditCost} credits
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Check-in QR Code
                    </h4>
                    <QRCodeDisplay bookingId={booking.id} facilityName={booking.facilityName} />
                    <p className="mt-4 text-xs text-gray-500 text-center">
                      Please scan this QR code at the facility entrance to check
                      in.
                      <br />
                      Remember to check in within 15 minutes of your booking
                      start time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => navigate('/user/dashboard')} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Return to Dashboard
              </button>
              <button onClick={() => {
              setCurrentStep(1);
              setSelectedFacility(null);
              setSelectedStartTime('');
              setSelectedEndTime('');
              setDuration(1);
              setBooking(null);
            }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Book Another Facility
              </button>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <UserLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          Book a Facility
        </h1>
      </div>
      <div className="mt-6">{renderStepContent()}</div>
    </UserLayout>;
};
export default BookingFlow;