import React, { useEffect, useState } from 'react';
import { CalendarIcon, CheckCircleIcon, XCircleIcon, ClockIcon, FilterIcon, ChevronDownIcon } from 'lucide-react';
import UserLayout from '../../components/UserLayout';
// Mock data
const mockBookings = [{
  id: 'b1',
  facilityId: 1,
  facilityName: 'Main Study Room',
  facilityType: 'study-room',
  date: '2023-09-15',
  startTime: '14:00',
  endTime: '16:00',
  status: 'upcoming',
  checkInStatus: null,
  creditCost: 10
}, {
  id: 'b2',
  facilityId: 3,
  facilityName: 'Indoor Basketball Court',
  facilityType: 'sports-hall',
  date: '2023-09-10',
  startTime: '10:00',
  endTime: '12:00',
  status: 'completed',
  checkInStatus: 'checked-in',
  creditCost: 30
}, {
  id: 'b3',
  facilityId: 2,
  facilityName: 'Computer Lab A',
  facilityType: 'lab',
  date: '2023-09-05',
  startTime: '15:00',
  endTime: '17:00',
  status: 'completed',
  checkInStatus: 'missed',
  creditCost: 16
}, {
  id: 'b4',
  facilityId: 4,
  facilityName: 'Conference Room B',
  facilityType: 'meeting-room',
  date: '2023-09-01',
  startTime: '09:00',
  endTime: '11:00',
  status: 'completed',
  checkInStatus: 'checked-in',
  creditCost: 20
}, {
  id: 'b5',
  facilityId: 1,
  facilityName: 'Main Study Room',
  facilityType: 'study-room',
  date: '2023-08-28',
  startTime: '13:00',
  endTime: '15:00',
  status: 'cancelled',
  checkInStatus: null,
  creditCost: 10,
  refundedCredits: 8
}];
const BookingHistory = ({
  user,
  onLogout
}) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    checkInStatus: 'all',
    dateRange: 'all'
  });
  const [expandedBooking, setExpandedBooking] = useState(null);
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, []);
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
  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const getStatusBadge = status => {
    switch (status) {
      case 'upcoming':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Upcoming
          </span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Cancelled
          </span>;
      case 'released':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Released
          </span>;
      default:
        return null;
    }
  };
  const getCheckInStatusBadge = checkInStatus => {
    switch (checkInStatus) {
      case 'checked-in':
        return <span className="inline-flex items-center text-xs font-medium text-green-700">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Checked In
          </span>;
      case 'missed':
        return <span className="inline-flex items-center text-xs font-medium text-red-700">
            <XCircleIcon className="mr-1 h-4 w-4" />
            Missed
          </span>;
      default:
        return <span className="inline-flex items-center text-xs font-medium text-gray-500">
            <ClockIcon className="mr-1 h-4 w-4" />
            Pending
          </span>;
    }
  };
  const filteredBookings = bookings.filter(booking => {
    if (filters.status !== 'all' && booking.status !== filters.status) {
      return false;
    }
    if (filters.checkInStatus !== 'all') {
      if (filters.checkInStatus === 'checked-in' && booking.checkInStatus !== 'checked-in') {
        return false;
      }
      if (filters.checkInStatus === 'missed' && booking.checkInStatus !== 'missed') {
        return false;
      }
    }
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const bookingDate = new Date(booking.date);
      if (filters.dateRange === 'last-week') {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (bookingDate < lastWeek) {
          return false;
        }
      } else if (filters.dateRange === 'last-month') {
        const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (bookingDate < lastMonth) {
          return false;
        }
      }
    }
    return true;
  });
  return <UserLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          Booking History
        </h1>
      </div>
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Your Bookings
              </h2>
              <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <div className="flex items-center">
                  <FilterIcon className="mr-2 h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Filters:</span>
                </div>
                <div className="mt-2 sm:mt-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select name="status" value={filters.status} onChange={handleFilterChange} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="all">All Statuses</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="released">Released</option>
                  </select>
                  <select name="checkInStatus" value={filters.checkInStatus} onChange={handleFilterChange} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="all">All Check-ins</option>
                    <option value="checked-in">Checked In</option>
                    <option value="missed">Missed</option>
                  </select>
                  <select name="dateRange" value={filters.dateRange} onChange={handleFilterChange} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="all">All Time</option>
                    <option value="last-week">Last Week</option>
                    <option value="last-month">Last Month</option>
                  </select>
                </div>
              </div>
            </div>
            {isLoading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div> : filteredBookings.length === 0 ? <div className="text-center py-10">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filters.status !== 'all' || filters.checkInStatus !== 'all' || filters.dateRange !== 'all' ? 'Try adjusting your filters.' : 'You have not made any bookings yet.'}
                </p>
              </div> : <div className="mt-4">
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {filteredBookings.map(booking => <li key={booking.id}>
                        <div className="block hover:bg-gray-50">
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-blue-600 truncate">
                                  {booking.facilityName}
                                </p>
                                <p className="ml-2 flex-shrink-0 flex">
                                  {getStatusBadge(booking.status)}
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <button onClick={() => toggleBookingDetails(booking.id)} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                                  {expandedBooking === booking.id ? 'Hide Details' : 'Show Details'}
                                  <ChevronDownIcon className={`ml-1 h-5 w-5 transform ${expandedBooking === booking.id ? 'rotate-180' : ''}`} />
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  {formatDate(booking.date)}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  {booking.startTime} - {booking.endTime}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                {getCheckInStatusBadge(booking.checkInStatus)}
                              </div>
                            </div>
                            {expandedBooking === booking.id && <div className="mt-4 bg-gray-50 p-4 rounded-md">
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
                                    <dd className="mt-1 text-sm text-blue-600 font-medium">
                                      {booking.creditCost} credits
                                    </dd>
                                  </div>
                                  {booking.status === 'cancelled' && booking.refundedCredits && <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                          Refunded Credits
                                        </dt>
                                        <dd className="mt-1 text-sm text-green-600 font-medium">
                                          {booking.refundedCredits} credits
                                        </dd>
                                      </div>}
                                  <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">
                                      Status Details
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {booking.status === 'upcoming' && 'This booking is scheduled for the future.'}
                                      {booking.status === 'completed' && booking.checkInStatus === 'checked-in' && 'You successfully checked in and used this facility.'}
                                      {booking.status === 'completed' && booking.checkInStatus === 'missed' && 'You did not check in within the 15-minute window. The booking was marked as released.'}
                                      {booking.status === 'cancelled' && 'This booking was cancelled and partial credits were refunded.'}
                                      {booking.status === 'released' && 'This booking was released and made available to other users.'}
                                    </dd>
                                  </div>
                                </dl>
                              </div>}
                          </div>
                        </div>
                      </li>)}
                  </ul>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </UserLayout>;
};
export default BookingHistory;