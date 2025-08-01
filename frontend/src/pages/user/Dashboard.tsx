import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, ChevronRightIcon, AlertCircleIcon, CalendarPlusIcon, TrashIcon } from 'lucide-react';
import UserLayout from '../../components/UserLayout';
import FacilityCard from '../../components/FacilityCard';
import ChangePasswordModal from '../../components/ChangePasswordModal';
// Mock data
const mockFacilities = [{
  id: 1,
  name: 'Main Study Room',
  type: 'study-room',
  description: 'A quiet study room with 10 individual desks and power outlets.',
  image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  availableHours: '8:00 AM - 10:00 PM',
  capacity: 10,
  creditCost: 5
}, {
  id: 2,
  name: 'Computer Lab A',
  type: 'lab',
  description: 'Computer lab with 20 workstations with specialized software.',
  image: 'https://images.unsplash.com/photo-1581092921461-fd0e5756a5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  availableHours: '9:00 AM - 9:00 PM',
  capacity: 20,
  creditCost: 8
}, {
  id: 3,
  name: 'Indoor Basketball Court',
  type: 'sports-hall',
  description: 'Full-size indoor basketball court with seating for spectators.',
  image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  availableHours: '8:00 AM - 8:00 PM',
  capacity: 30,
  creditCost: 15
}, {
  id: 4,
  name: 'Conference Room B',
  type: 'meeting-room',
  description: 'Professional meeting room with projector and whiteboard.',
  image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  availableHours: '9:00 AM - 6:00 PM',
  capacity: 12,
  creditCost: 10
}];
const mockUpcomingBookings = [{
  id: 'b1',
  facilityId: 1,
  facilityName: 'Main Study Room',
  facilityType: 'study-room',
  date: '2023-09-15',
  startTime: '14:00',
  endTime: '16:00',
  status: 'confirmed',
  creditCost: 10
}, {
  id: 'b2',
  facilityId: 3,
  facilityName: 'Indoor Basketball Court',
  facilityType: 'sports-hall',
  date: '2023-09-16',
  startTime: '10:00',
  endTime: '12:00',
  status: 'confirmed',
  creditCost: 30
}];
const mockReleasedRooms = [{
  id: 'r1',
  facilityId: 2,
  facilityName: 'Computer Lab A',
  facilityType: 'lab',
  date: '2023-09-14',
  startTime: '15:00',
  endTime: '17:00',
  status: 'released',
  creditCost: 16,
  originalBooker: 'Jane Smith'
}];
const Dashboard = ({
  user,
  onLogout,
  updateUser
}) => {
  const [popularFacilities, setPopularFacilities] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [releasedRooms, setReleasedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTimeLoginModalOpen, setIsFirstTimeLoginModalOpen] = useState(false);
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPopularFacilities(mockFacilities);
      setUpcomingBookings(mockUpcomingBookings);
      setReleasedRooms(mockReleasedRooms);
      setIsLoading(false);
      // Check if this is a first-time login
      if (user && user.isFirstLogin) {
        setIsFirstTimeLoginModalOpen(true);
      }
    }, 1000);
  }, [user]);
  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  const handleCancelBooking = bookingId => {
    // Simulate API call for cancellation
    setIsLoading(true);
    setTimeout(() => {
      setUpcomingBookings(upcomingBookings.filter(booking => booking.id !== bookingId));
      setIsLoading(false);
    }, 1000);
  };
  const handlePasswordChange = async (oldPassword, newPassword) => {
    // Simulate API call to change password
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In a real app, you'd make an API call here
        console.log('Password changed from', oldPassword, 'to', newPassword);
        // Check if new password is the same as old password
        if (newPassword === oldPassword || user && newPassword === user.password) {
          reject(new Error('New password cannot be the same as your current password'));
          return;
        }
        // Update user's first login status
        if (user && user.isFirstLogin) {
          // Update the user state in the parent component
          updateUser({
            isFirstLogin: false,
            password: newPassword // Store new password (in a real app, you wouldn't do this)
          });
          // Close the modal
          setIsFirstTimeLoginModalOpen(false);
        }
        resolve();
      }, 1500);
    });
  };
  return <UserLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          Dashboard
        </h1>
      </div>
      {isLoading ? <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div> : <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Upcoming Bookings */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Upcoming Bookings
                  </h2>
                  <Link to="/user/history" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all
                  </Link>
                </div>
                <div className="mt-4">
                  {upcomingBookings.length === 0 ? <div className="text-center py-6">
                      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No upcoming bookings
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Book a facility to get started.
                      </p>
                      <div className="mt-6">
                        <Link to="/user/booking" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <CalendarPlusIcon className="-ml-1 mr-2 h-5 w-5" />
                          Book Now
                        </Link>
                      </div>
                    </div> : <div className="divide-y divide-gray-200">
                      {upcomingBookings.map(booking => <div key={booking.id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {booking.facilityName}
                              </h3>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p>
                                  {formatDateTime(booking.date, booking.startTime)}{' '}
                                  - {booking.endTime}
                                </p>
                              </div>
                              <div className="mt-1 text-sm text-blue-600">
                                {booking.creditCost} credits
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link to={`/user/booking-details/${booking.id}`} className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                View Details
                                <ChevronRightIcon className="ml-1 h-4 w-4" />
                              </Link>
                              <button onClick={() => handleCancelBooking(booking.id)} className="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                <TrashIcon className="mr-1 h-4 w-4" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>)}
                    </div>}
                </div>
              </div>
            </div>
            {/* Released Rooms */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Released Rooms
                  </h2>
                  <Link to="/user/released-rooms" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all
                  </Link>
                </div>
                <div className="mt-4">
                  {releasedRooms.length === 0 ? <div className="text-center py-6">
                      <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No released rooms
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Check back later for newly released rooms.
                      </p>
                    </div> : <div className="divide-y divide-gray-200">
                      {releasedRooms.map(room => <div key={room.id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-sm font-medium text-gray-900">
                                  {room.facilityName}
                                </h3>
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Released
                                </span>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p>
                                  {formatDateTime(room.date, room.startTime)} -{' '}
                                  {room.endTime}
                                </p>
                              </div>
                              <div className="mt-1 text-sm text-blue-600">
                                {room.creditCost} credits
                              </div>
                            </div>
                            <div>
                              <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Claim Now
                              </button>
                            </div>
                          </div>
                        </div>)}
                    </div>}
                </div>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-6">
            {/* Recently Booked Facilities */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Recently Booked
                  </h2>
                  <Link to="/user/booking" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {popularFacilities.slice(0, 4).map(facility => <FacilityCard key={facility.id} facility={facility} onClick={() => {}} showDetails={false} />)}
                </div>
              </div>
            </div>
            {/* Tips & Reminders */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Tips & Reminders
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircleIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Check-In Reminder
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Remember to check in within 15 minutes of your
                            booking start time to avoid losing your reservation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Credit System
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            You currently have {user.credits} credits. Each
                            facility booking deducts credits based on duration
                            and facility type.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      {/* First-time login password change modal */}
      <ChangePasswordModal isOpen={isFirstTimeLoginModalOpen} onClose={() => setIsFirstTimeLoginModalOpen(false)} onSubmit={handlePasswordChange} isFirstTimeLogin={true} currentPassword={user?.password || 'password'} />
    </UserLayout>;
};
export default Dashboard;