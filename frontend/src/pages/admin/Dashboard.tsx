import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, BuildingIcon, CalendarIcon, CreditCardIcon, AlertTriangleIcon, ChevronRightIcon } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
// Mock data
const mockStats = {
  totalFacilities: 12,
  activeBookings: 8,
  releasedRooms: 3,
  totalUsers: 245
};
const mockRecentActivity = [{
  id: 'a1',
  type: 'booking',
  user: 'John Doe',
  facility: 'Main Study Room',
  time: '2023-09-14T14:30:00',
  details: 'Booked for 2 hours (15:00 - 17:00)'
}, {
  id: 'a2',
  type: 'check-in',
  user: 'Sarah Williams',
  facility: 'Computer Lab A',
  time: '2023-09-14T13:10:00',
  details: 'Checked in 5 minutes early'
}, {
  id: 'a3',
  type: 'release',
  user: 'Alex Johnson',
  facility: 'Conference Room B',
  time: '2023-09-14T10:15:00',
  details: 'Failed to check in, room released'
}, {
  id: 'a4',
  type: 'credit-adjustment',
  user: 'Lisa Chen',
  facility: null,
  time: '2023-09-14T09:45:00',
  details: 'Added 50 credits by Admin'
}];
const mockMaintenanceAlerts = [{
  id: 'm1',
  facility: 'Indoor Basketball Court',
  date: '2023-09-15',
  timeRange: '14:00 - 18:00',
  reason: 'Floor resurfacing'
}, {
  id: 'm2',
  facility: 'Computer Lab A',
  date: '2023-09-16',
  timeRange: '09:00 - 12:00',
  reason: 'Software updates'
}];
const Dashboard = ({
  user,
  onLogout
}) => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setRecentActivity(mockRecentActivity);
      setMaintenanceAlerts(mockMaintenanceAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);
  const formatTime = timeString => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  const formatTimeAgo = timeString => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  const getActivityIcon = type => {
    switch (type) {
      case 'booking':
        return <CalendarIcon className="h-5 w-5 text-blue-500" />;
      case 'check-in':
        return <UsersIcon className="h-5 w-5 text-green-500" />;
      case 'release':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'credit-adjustment':
        return <CreditCardIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  return <AdminLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          Admin Dashboard
        </h1>
      </div>
      {isLoading ? <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div> : <div className="mt-6">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <BuildingIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Facilities
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.totalFacilities}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/admin/facilities" className="font-medium text-purple-700 hover:text-purple-900">
                    View all
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Bookings
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.activeBookings}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/admin/monitor" className="font-medium text-blue-700 hover:text-blue-900">
                    View all
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Released Rooms
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.releasedRooms}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/admin/monitor" className="font-medium text-yellow-700 hover:text-yellow-900">
                    View all
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <UsersIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.totalUsers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/admin/credits" className="font-medium text-green-700 hover:text-green-900">
                    Manage users
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Main content */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h3>
                <div className="mt-5 flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentActivity.map(activity => <li key={activity.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.user}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {activity.type === 'credit-adjustment' ? activity.details : `${activity.facility}: ${activity.details}`}
                            </p>
                          </div>
                          <div>
                            <div className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white">
                              {formatTimeAgo(activity.time)}
                            </div>
                          </div>
                        </div>
                      </li>)}
                  </ul>
                </div>
                <div className="mt-6">
                  <Link to="/admin/monitor" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    View all activity
                  </Link>
                </div>
              </div>
            </div>
            {/* Maintenance Alerts */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Upcoming Maintenance
                  </h3>
                  <Link to="/admin/blocking" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                    Schedule maintenance
                  </Link>
                </div>
                <div className="mt-5 flow-root">
                  {maintenanceAlerts.length === 0 ? <p className="text-sm text-gray-500">
                      No upcoming maintenance scheduled.
                    </p> : <ul className="-my-5 divide-y divide-gray-200">
                      {maintenanceAlerts.map(alert => <li key={alert.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100">
                                <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {alert.facility}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p>
                                  {alert.date}, {alert.timeRange}
                                </p>
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                Reason: {alert.reason}
                              </p>
                            </div>
                            <div>
                              <Link to={`/admin/blocking?id=${alert.id}`} className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                Edit
                                <ChevronRightIcon className="ml-1 h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </li>)}
                    </ul>}
                </div>
                <div className="mt-6">
                  <Link to="/admin/blocking" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    View all maintenance
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </AdminLayout>;
};
export default Dashboard;