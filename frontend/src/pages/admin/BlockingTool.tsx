import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, AlertTriangleIcon, SearchIcon, PlusIcon, XIcon, TrashIcon } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
// Mock data
const mockFacilities = [{
  id: 1,
  name: 'Main Study Room',
  type: 'study-room',
  location: 'Building A, Floor 2'
}, {
  id: 2,
  name: 'Computer Lab A',
  type: 'lab',
  location: 'Building B, Floor 1'
}, {
  id: 3,
  name: 'Indoor Basketball Court',
  type: 'sports-hall',
  location: 'Sports Complex, Ground Floor'
}, {
  id: 4,
  name: 'Conference Room B',
  type: 'meeting-room',
  location: 'Admin Building, Floor 3'
}];
const mockMaintenanceBlocks = [{
  id: 'm1',
  facilityId: 3,
  facilityName: 'Indoor Basketball Court',
  date: '2023-09-15',
  startTime: '14:00',
  endTime: '18:00',
  reason: 'Floor resurfacing',
  createdBy: 'Admin User',
  createdAt: '2023-09-10T10:30:00'
}, {
  id: 'm2',
  facilityId: 2,
  facilityName: 'Computer Lab A',
  date: '2023-09-16',
  startTime: '09:00',
  endTime: '12:00',
  reason: 'Software updates',
  createdBy: 'Admin User',
  createdAt: '2023-09-10T11:15:00'
}];
const BlockingTool = ({
  user,
  onLogout
}) => {
  const [facilities, setFacilities] = useState([]);
  const [maintenanceBlocks, setMaintenanceBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    facilityId: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFacilities(mockFacilities);
      setMaintenanceBlocks(mockMaintenanceBlocks);
      setIsLoading(false);
    }, 1000);
  }, []);
  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };
  const filteredBlocks = maintenanceBlocks.filter(block => block.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) || block.reason.toLowerCase().includes(searchTerm.toLowerCase()));
  const openModal = () => {
    setFormData({
      facilityId: '',
      date: '',
      startTime: '',
      endTime: '',
      reason: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.facilityId) {
      newErrors.facilityId = 'Please select a facility';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Please select a start time';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'Please select an end time';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    if (!formData.reason) {
      newErrors.reason = 'Please provide a reason';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const selectedFacility = facilities.find(f => f.id.toString() === formData.facilityId.toString());
      const newBlock = {
        id: `m${Date.now()}`,
        facilityId: parseInt(formData.facilityId),
        facilityName: selectedFacility.name,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        reason: formData.reason,
        createdBy: user.name,
        createdAt: new Date().toISOString()
      };
      setMaintenanceBlocks([...maintenanceBlocks, newBlock]);
      setIsLoading(false);
      closeModal();
    }, 1000);
  };
  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this maintenance block?')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMaintenanceBlocks(maintenanceBlocks.filter(block => block.id !== id));
        setIsLoading(false);
      }, 1000);
    }
  };
  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  return <AdminLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          Block Facilities
        </h1>
        <button onClick={openModal} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Maintenance Block
        </button>
      </div>
      <div className="mt-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Scheduled Maintenance
              </h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" placeholder="Search maintenance..." value={searchTerm} onChange={handleSearch} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
              </div>
            </div>
            {isLoading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div> : filteredBlocks.length === 0 ? <div className="text-center py-10">
                <AlertTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No maintenance blocks found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search.' : 'Get started by adding a maintenance block.'}
                </p>
                {!searchTerm && <div className="mt-6">
                    <button onClick={openModal} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Add Maintenance Block
                    </button>
                  </div>}
              </div> : <div className="mt-4">
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {filteredBlocks.map(block => <li key={block.id} className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100">
                                <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-base font-medium text-gray-900">
                                  {block.facilityName}
                                </h3>
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Blocked
                                </span>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                <p>{formatDate(block.date)}</p>
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                <p>
                                  {block.startTime} - {block.endTime}
                                </p>
                              </div>
                              <div className="mt-1 text-sm text-gray-500">
                                <p>
                                  <span className="font-medium">Reason:</span>{' '}
                                  {block.reason}
                                </p>
                              </div>
                              <div className="mt-1 text-xs text-gray-400">
                                <p>
                                  Created by {block.createdBy} on{' '}
                                  {new Date(block.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <button onClick={() => handleDelete(block.id)} className="text-red-600 hover:text-red-900">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </li>)}
                  </ul>
                </div>
              </div>}
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button type="button" onClick={closeModal} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add Maintenance Block
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="facilityId" className="block text-sm font-medium text-gray-700">
                              Facility *
                            </label>
                            <div className="mt-1">
                              <select id="facilityId" name="facilityId" value={formData.facilityId} onChange={handleInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.facilityId ? 'border-red-300' : ''}`}>
                                <option value="">Select a facility</option>
                                {facilities.map(facility => <option key={facility.id} value={facility.id}>
                                    {facility.name} ({facility.location})
                                  </option>)}
                              </select>
                              {errors.facilityId && <p className="mt-1 text-sm text-red-600">
                                  {errors.facilityId}
                                </p>}
                            </div>
                          </div>
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                              Date *
                            </label>
                            <div className="mt-1">
                              <input type="date" name="date" id="date" min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={handleInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.date ? 'border-red-300' : ''}`} />
                              {errors.date && <p className="mt-1 text-sm text-red-600">
                                  {errors.date}
                                </p>}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                Start Time *
                              </label>
                              <div className="mt-1">
                                <input type="time" name="startTime" id="startTime" value={formData.startTime} onChange={handleInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.startTime ? 'border-red-300' : ''}`} />
                                {errors.startTime && <p className="mt-1 text-sm text-red-600">
                                    {errors.startTime}
                                  </p>}
                              </div>
                            </div>
                            <div>
                              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                End Time *
                              </label>
                              <div className="mt-1">
                                <input type="time" name="endTime" id="endTime" value={formData.endTime} onChange={handleInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.endTime ? 'border-red-300' : ''}`} />
                                {errors.endTime && <p className="mt-1 text-sm text-red-600">
                                    {errors.endTime}
                                  </p>}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                              Reason for Maintenance *
                            </label>
                            <div className="mt-1">
                              <textarea id="reason" name="reason" rows={3} value={formData.reason} onChange={handleInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.reason ? 'border-red-300' : ''}`} />
                              {errors.reason && <p className="mt-1 text-sm text-red-600">
                                  {errors.reason}
                                </p>}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Please provide details about the maintenance being
                              performed.
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-start-2 sm:text-sm">
                            Create Block
                          </button>
                          <button type="button" onClick={closeModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </AdminLayout>;
};
export default BlockingTool;