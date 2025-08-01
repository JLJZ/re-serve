import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, BuildingIcon, RefreshCwIcon } from 'lucide-react';
import UserLayout from '../../components/UserLayout';
import CountdownTimer from '../../components/CountdownTimer';
// Mock data
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
  originalBooker: 'Jane Smith',
  releasedAt: '14:15',
  image: 'https://images.unsplash.com/photo-1581092921461-fd0e5756a5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  location: 'Building B, Floor 1'
}, {
  id: 'r2',
  facilityId: 1,
  facilityName: 'Main Study Room',
  facilityType: 'study-room',
  date: '2023-09-14',
  startTime: '16:00',
  endTime: '18:00',
  status: 'released',
  creditCost: 10,
  originalBooker: 'Alex Johnson',
  releasedAt: '16:15',
  image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  location: 'Building A, Floor 2'
}, {
  id: 'r3',
  facilityId: 4,
  facilityName: 'Conference Room B',
  facilityType: 'meeting-room',
  date: '2023-09-14',
  startTime: '14:00',
  endTime: '16:00',
  status: 'released',
  creditCost: 20,
  originalBooker: 'Sarah Williams',
  releasedAt: '14:15',
  image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  location: 'Admin Building, Floor 3'
}];
const facilityIcons = {
  'study-room': '📚',
  lab: '🧑‍💻',
  'sports-hall': '🏀',
  'meeting-room': '👥',
  auditorium: '🎭',
  library: '📖'
};
const ReleasedRooms = ({
  user,
  onLogout
}) => {
  const [releasedRooms, setReleasedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [claimedRoom, setClaimedRoom] = useState(null);
  useEffect(() => {
    loadReleasedRooms();
  }, []);
  const loadReleasedRooms = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReleasedRooms(mockReleasedRooms);
      setIsLoading(false);
      setLastRefreshed(new Date());
    }, 1000);
  };
  const handleRefresh = () => {
    loadReleasedRooms();
  };
  const handleClaimRoom = room => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setClaimedRoom(room);
      setReleasedRooms(releasedRooms.filter(r => r.id !== room.id));
      setIsLoading(false);
    }, 1500);
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
  const formatTime = time => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };
  return <UserLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          Released Rooms
        </h1>
        <button onClick={handleRefresh} disabled={isLoading} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <RefreshCwIcon className={`-ml-0.5 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      <div className="mt-6">
        {claimedRoom && <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  You've successfully claimed{' '}
                  <strong>{claimedRoom.facilityName}</strong> for{' '}
                  {formatTime(claimedRoom.startTime)} -{' '}
                  {formatTime(claimedRoom.endTime)}. Please check in within 15
                  minutes of the start time.
                </p>
              </div>
            </div>
          </div>}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Available Released Rooms
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  These rooms were released when users failed to check in. Claim
                  them for immediate use.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Last refreshed: {lastRefreshed.toLocaleTimeString()}
              </div>
            </div>
            {isLoading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div> : releasedRooms.length === 0 ? <div className="text-center py-10">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No released rooms
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Check back later for newly released rooms or refresh to check
                  for updates.
                </p>
              </div> : <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {releasedRooms.map(room => <div key={room.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 flex flex-col h-full">
                    <div className="relative h-40 bg-gray-200">
                      {room.image ? <img src={room.image} alt={room.facilityName} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-6xl">
                          {facilityIcons[room.facilityType] || '🏢'}
                        </div>}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {room.facilityName}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          {facilityIcons[room.facilityType]}{' '}
                          {room.facilityType.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center mb-1">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>
                            {formatDateTime(room.date, room.startTime)}
                          </span>
                        </div>
                        <div className="flex items-center mb-1">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span>
                            {formatTime(room.startTime)} -{' '}
                            {formatTime(room.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center mb-1">
                          <BuildingIcon className="w-4 h-4 mr-1" />
                          <span>{room.location}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100 mt-3">
                        <div className="text-blue-600 font-medium">
                          {room.creditCost} credits
                        </div>
                        <button onClick={() => handleClaimRoom(room)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Claim Now
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>
        </div>
      </div>
    </UserLayout>;
};
export default ReleasedRooms;