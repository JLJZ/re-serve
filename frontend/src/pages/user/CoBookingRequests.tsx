import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, UserIcon, BuildingIcon, CheckIcon, XIcon, AlertCircleIcon } from 'lucide-react';
import UserLayout from '../../components/UserLayout';
// Mock data for co-booking requests
const mockCoBookingRequests = [{
  id: 'cb1',
  requesterId: 2,
  requesterName: 'Jane Smith',
  requesterUsername: 'janesmith',
  facilityId: 1,
  facilityName: 'Main Study Room',
  facilityType: 'study-room',
  date: '2023-09-18',
  startTime: '14:00',
  endTime: '16:00',
  status: 'pending',
  creditCost: 10,
  requestedAt: '2023-09-15T10:30:00',
  totalParticipants: 3,
  image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 'cb2',
  requesterId: 3,
  requesterName: 'Mike Brown',
  requesterUsername: 'mikebrown',
  facilityId: 3,
  facilityName: 'Indoor Basketball Court',
  facilityType: 'sports-hall',
  date: '2023-09-20',
  startTime: '10:00',
  endTime: '12:00',
  status: 'pending',
  creditCost: 30,
  requestedAt: '2023-09-15T09:15:00',
  totalParticipants: 4,
  image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 'cb3',
  requesterId: 4,
  requesterName: 'Sarah Williams',
  requesterUsername: 'sarahwilliams',
  facilityId: 2,
  facilityName: 'Computer Lab A',
  facilityType: 'lab',
  date: '2023-09-16',
  startTime: '15:00',
  endTime: '17:00',
  status: 'pending',
  creditCost: 16,
  requestedAt: '2023-09-14T14:45:00',
  totalParticipants: 2,
  image: 'https://images.unsplash.com/photo-1581092921461-fd0e5756a5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
}];
const facilityIcons = {
  'study-room': '📚',
  lab: '🧑‍💻',
  'sports-hall': '🏀',
  'meeting-room': '👥',
  auditorium: '🎭',
  library: '📖'
};
const CoBookingRequests = ({
  user,
  onLogout
}) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'pending' // Default to showing pending requests
  });
  const [expandedRequest, setExpandedRequest] = useState(null);
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests(mockCoBookingRequests);
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
  const toggleRequestDetails = requestId => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };
  const handleAcceptRequest = requestId => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRequests(requests.map(request => request.id === requestId ? {
        ...request,
        status: 'accepted'
      } : request));
      setIsLoading(false);
    }, 1000);
  };
  const handleDeclineRequest = requestId => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRequests(requests.map(request => request.id === requestId ? {
        ...request,
        status: 'declined'
      } : request));
      setIsLoading(false);
    }, 1000);
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
  const formatTimeAgo = timeString => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };
  const calculateCreditShare = (totalCredits, participants) => {
    return Math.ceil(totalCredits / participants);
  };
  const filteredRequests = requests.filter(request => {
    if (filters.status !== 'all' && request.status !== filters.status) {
      return false;
    }
    return true;
  });
  return <UserLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          Co-Booking Requests
        </h1>
      </div>
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Requests from Other Users
              </h2>
              <div className="mt-3 sm:mt-0">
                <select name="status" value={filters.status} onChange={handleFilterChange} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>
            {isLoading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div> : filteredRequests.length === 0 ? <div className="text-center py-10">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No co-booking requests found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filters.status !== 'all' ? `You don't have any ${filters.status} co-booking requests.` : 'No one has invited you to co-book a facility yet.'}
                </p>
              </div> : <div className="mt-4 space-y-4">
                {filteredRequests.map(request => <div key={request.id} className={`border rounded-lg overflow-hidden ${request.status === 'pending' ? 'border-yellow-200' : request.status === 'accepted' ? 'border-green-200' : 'border-gray-200'}`}>
                    <div className={`p-4 ${request.status === 'pending' ? 'bg-yellow-50' : request.status === 'accepted' ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {request.requesterName} (@
                              {request.requesterUsername})
                            </p>
                            <p className="text-xs text-gray-500">
                              invited you to co-book {request.facilityName}
                            </p>
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <CalendarIcon className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                              <span>
                                {formatDateTime(request.date, request.startTime)}{' '}
                                - {request.endTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : request.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {request.status === 'pending' ? 'Pending' : request.status === 'accepted' ? 'Accepted' : 'Declined'}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(request.requestedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <button onClick={() => toggleRequestDetails(request.id)} className="text-xs text-blue-600 hover:text-blue-500">
                          {expandedRequest === request.id ? 'Hide Details' : 'View Details'}
                        </button>
                        {request.status === 'pending' && <div className="flex space-x-2">
                            <button onClick={() => handleDeclineRequest(request.id)} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                              <XIcon className="mr-1 h-3 w-3" />
                              Decline
                            </button>
                            <button onClick={() => handleAcceptRequest(request.id)} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              <CheckIcon className="mr-1 h-3 w-3" />
                              Accept
                            </button>
                          </div>}
                      </div>
                    </div>
                    {expandedRequest === request.id && <div className="p-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Facility Details
                            </h4>
                            <div className="flex-1 bg-gray-100 rounded-md p-3">
                              <div className="flex items-start space-x-3">
                                <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                                  {request.image ? <img src={request.image} alt={request.facilityName} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-2xl">
                                      {facilityIcons[request.facilityType] || '🏢'}
                                    </div>}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {request.facilityName}
                                  </p>
                                  <div className="mt-1 flex items-center text-xs text-gray-500">
                                    <BuildingIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                                    <span className="capitalize">
                                      {request.facilityType.replace('-', ' ')}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex items-center text-xs text-gray-500">
                                    <ClockIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                                    <span>
                                      {request.startTime} - {request.endTime}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Booking Details
                            </h4>
                            <div className="flex-1 bg-gray-100 rounded-md p-3">
                              <dl className="space-y-1">
                                <div className="flex justify-between">
                                  <dt className="text-xs text-gray-500">
                                    Date:
                                  </dt>
                                  <dd className="text-xs text-gray-900">
                                    {new Date(request.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })}
                                  </dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-xs text-gray-500">
                                    Total Participants:
                                  </dt>
                                  <dd className="text-xs text-gray-900">
                                    {request.totalParticipants}
                                  </dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-xs text-gray-500">
                                    Total Credit Cost:
                                  </dt>
                                  <dd className="text-xs text-blue-600 font-medium">
                                    {request.creditCost} credits
                                  </dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-xs text-gray-500">
                                    Your Credit Share:
                                  </dt>
                                  <dd className="text-xs text-green-600 font-medium">
                                    {calculateCreditShare(request.creditCost, request.totalParticipants)}{' '}
                                    credits
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </div>
                        {request.status === 'pending' && <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                            <div className="flex items-start">
                              <AlertCircleIcon className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                              <div>
                                <h4 className="text-sm font-medium text-yellow-800">
                                  Important Information
                                </h4>
                                <p className="mt-1 text-xs text-yellow-700">
                                  By accepting this co-booking request, you
                                  agree to share the facility and split the
                                  credit cost. You must check in within 15
                                  minutes of the booking start time or your
                                  portion of the credits will be forfeited.
                                </p>
                              </div>
                            </div>
                          </div>}
                        {request.status === 'accepted' && <div className="mt-4 flex justify-center">
                            <Link to={`/user/booking-details/${request.id}`} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              View Booking Details
                            </Link>
                          </div>}
                      </div>}
                  </div>)}
              </div>}
          </div>
        </div>
      </div>
    </UserLayout>;
};
export default CoBookingRequests;