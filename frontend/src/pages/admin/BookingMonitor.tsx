import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, BuildingIcon, RefreshCwIcon, CheckIcon, XIcon, FilterIcon } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import CountdownTimer from '../../components/CountdownTimer';
// Mock data
const mockBookings = [{
  id: 'b1',
  userId: 1,
  userName: 'John Doe',
  facilityId: 1,
  facilityName: 'Main Study Room',
  facilityType: 'study-room',
  date: '2023-09-15',
  startTime: '14:00',
  endTime: '16:00',
  status: 'upcoming',
  checkInStatus: null,
  creditCost: 10,
  bookingType: 'pre-booking'
}, {
  id: 'b2',
  userId: 2,
  userName: 'Jane Smith',
  facilityId: 3,
  facilityName: 'Indoor Basketball Court',
  facilityType: 'sports-hall',
  date: '2023-09-14',
  startTime: '10:00',
  endTime: '12:00',
  status: 'active',
  checkInStatus: 'checked-in',
  creditCost: 30,
  bookingType: 'pre-booking'
}, {
  id: 'b3',
  userId: 3,
  userName: 'Alex Johnson',
  facilityId: 2,
  facilityName: 'Computer Lab A',
  facilityType: 'lab',
  date: '2023-09-14',
  startTime: '15:00',
  endTime: '17:00',
  status: 'active',
  checkInStatus: 'pending',
  creditCost: 16,
  bookingType: 'ad-hoc',
  checkInDeadline: '2023-09-14T15:15:00'
}, {
  id: 'b4',
  userId: 4,
  userName: 'Sarah Williams',
  facilityId: 4,
  facilityName: 'Conference Room B',
  facilityType: 'meeting-room',
  date: '2023-09-14',
  startTime: '14:00',
  endTime: '16:00',
  status: 'released',
  checkInStatus: 'missed',
  creditCost: 20,
  bookingType: 'pre-booking',
  releasedAt: '2023-09-14T14:15:00'
}];
const BookingMonitor = ({
  user,
  onLogout
}) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [filters, setFilters] = useState({
    status: 'all',
    bookingType: 'all',
    facilityType: 'all'
  });
  const [expandedBooking, setExpandedBooking] = useState(null);
  useEffect(() => {
    loadBookings();
  }, []);
  const loadBookings = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
      setLastRefreshed(new Date());
    }, 1000);
  };
  const handleRefresh = () => {
    loadBookings();
  };
  const handleFilterChange = e => {
    const {
      name,
      value
    } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const toggleBookingDetails = bookingId => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };
  const handleCheckInStatusChange = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => booking.id === bookingId ? {
      ...booking,
      checkInStatus: newStatus,
      status: newStatus === 'checked-in' ? 'active' : booking.status
    } : booking));
  };
  const handleReleaseBooking = bookingId => {
    setBookings(bookings.map(booking => booking.id === bookingId ? {
      ...booking,
      status: 'released',
      checkInStatus: 'missed',
      releasedAt: new Date().toISOString()
    } : booking));
  };
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
  const formatTime = timeString => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  const getStatusBadge = status => {
    switch (status) {
      case 'upcoming':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Upcoming
          </span>;
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>;
      case 'released':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Released
          </span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Completed
          </span>;
      default:
        return null;
    }
  };
  const getCheckInStatusBadge = checkInStatus => {
    switch (checkInStatus) {
      case 'checked-in':
        return <span className="inline-flex items-center text-xs font-medium text-green-700">
            <CheckIcon className="mr-1 h-4 w-4" />
            Checked In
          </span>;
      case 'missed':
        return <span className="inline-flex items-center text-xs font-medium text-red-700">
            <XIcon className="mr-1 h-4 w-4" />
            Missed
          </span>;
      case 'pending':
        return <span className="inline-flex items-center text-xs font-medium text-yellow-700">
            <ClockIcon className="mr-1 h-4 w-4" />
            Pending Check-in
          </span>;
      default:
        return <span className="inline-flex items-center text-xs font-medium text-gray-500">
            <ClockIcon className="mr-1 h-4 w-4" />
            Not Started
          </span>;
    }
  };
  const filteredBookings = bookings.filter(booking => {
    if (filters.status !== 'all' && booking.status !== filters.status) {
      return false;
    }
    if (filters.bookingType !== 'all' && booking.bookingType !== filters.bookingType) {
      return false;
    }
    if (filters.facilityType !== 'all' && booking.facilityType !== filters.facilityType) {
      return false;
    }
    return true;
  });
  return <AdminLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          Booking Monitor
        </h1>
        <button onClick={handleRefresh} disabled={isLoading} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <RefreshCwIcon className={`-ml-0.5 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      <div className="mt-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  All Bookings
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Last refreshed: {lastRefreshed.toLocaleTimeString()}
                </p>
              </div>
              <div className="mt-3 md:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <div className="flex items-center">
                  <FilterIcon className="mr-2 h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Filters:</span>
                </div>
                <div className="mt-2 sm:mt-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select name="status" value={filters.status} onChange={handleFilterChange} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
                    <option value="all">All Statuses</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="released">Released</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select name="bookingType" value={filters.bookingType} onChange={handleFilterChange} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
                    <option value="all">All Booking Types</option>
                    <option value="pre-booking">Pre-booking</option>
                    <option value="ad-hoc">Ad-hoc</option>
                  </select>
                  <select name="facilityType" value={filters.facilityType} onChange={handleFilterChange} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md">
                    <option value="all">All Facility Types</option>
                    <option value="study-room">Study Room</option>
                    <option value="lab">Computer Lab</option>
                    <option value="sports-hall">Sports Hall</option>
                    <option value="meeting-room">Meeting Room</option>
                  </select>
                </div>
              </div>
            </div>
            {isLoading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div> : filteredBookings.length === 0 ? <div className="text-center py-10">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or refreshing the page.
                </p>
              </div> : <div className="mt-4">
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {filteredBookings.map(booking => <li key={booking.id} className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100">
                                <BuildingIcon className="h-6 w-6 text-purple-600" />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center flex-wrap gap-2">
                                <h3 className="text-base font-medium text-gray-900">
                                  {booking.facilityName}
                                </h3>
                                {getStatusBadge(booking.status)}
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                                  {booking.bookingType}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                <p>{booking.userName}</p>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                <p>
                                  {formatDateTime(booking.date, booking.startTime)}{' '}
                                  - {booking.endTime}
                                </p>
                              </div>
                              <div className="mt-1 flex items-center">
                                {getCheckInStatusBadge(booking.checkInStatus)}
                                {booking.status === 'active' && booking.checkInStatus === 'pending' && booking.checkInDeadline && <div className="ml-3">
                                      <CountdownTimer startTime={booking.checkInDeadline} onExpire={() => handleReleaseBooking(booking.id)} />
                                    </div>}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button onClick={() => toggleBookingDetails(booking.id)} className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                              {expandedBooking === booking.id ? 'Hide Details' : 'View Details'}
                            </button>
                            {booking.status === 'active' && booking.checkInStatus === 'pending' && <div className="flex space-x-2">
                                  <button onClick={() => handleCheckInStatusChange(booking.id, 'checked-in')} className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    Mark Checked In
                                  </button>
                                  <button onClick={() => handleReleaseBooking(booking.id)} className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                    Release
                                  </button>
                                </div>}
                          </div>
                        </div>
                        {expandedBooking === booking.id && <div className="mt-4 ml-14 bg-gray-50 p-4 rounded-md">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                  Booking ID
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {booking.id}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                  Facility Type
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 capitalize">
                                  {booking.facilityType.replace('-', ' ')}
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                  Credit Cost
                                </dt>
                                <dd className="mt-1 text-sm text-purple-600 font-medium">
                                  {booking.creditCost} credits
                                </dd>
                              </div>
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                  User ID
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {booking.userId}
                                </dd>
                              </div>
                              {booking.status === 'released' && booking.releasedAt && <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">
                                      Released At
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {new Date(booking.releasedAt).toLocaleString()}
                                    </dd>
                                  </div>}
                              <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">
                                  Status Details
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {booking.status === 'upcoming' && 'This booking is scheduled for the future.'}
                                  {booking.status === 'active' && booking.checkInStatus === 'checked-in' && 'User has checked in and is currently using the facility.'}
                                  {booking.status === 'active' && booking.checkInStatus === 'pending' && 'User has not checked in yet. Booking will be released if check-in is not completed in time.'}
                                  {booking.status === 'released' && 'This booking was released because the user did not check in within the 15-minute window.'}
                                  {booking.status === 'completed' && 'This booking has been completed.'}
                                </dd>
                              </div>
                              {booking.status === 'active' && booking.checkInStatus === 'pending' && <div className="sm:col-span-2 flex justify-end">
                                    <div className="flex space-x-2">
                                      <button onClick={() => handleCheckInStatusChange(booking.id, 'checked-in')} className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                        <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                        Mark Checked In
                                      </button>
                                      <button onClick={() => handleReleaseBooking(booking.id)} className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                        <ClockIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                        Release Room
                                      </button>
                                    </div>
                                  </div>}
                            </dl>
                          </div>}
                      </li>)}
                  </ul>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </AdminLayout>;
};
export default BookingMonitor;