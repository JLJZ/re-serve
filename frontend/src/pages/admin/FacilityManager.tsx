import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon, BuildingIcon, XIcon } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
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
const FacilityManager = ({
  user,
  onLogout
}) => {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFacility, setCurrentFacility] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    image: '',
    availableHours: '',
    capacity: '',
    creditCost: '',
    location: ''
  });
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFacilities(mockFacilities);
      setIsLoading(false);
    }, 1000);
  }, []);
  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };
  const filteredFacilities = facilities.filter(facility => facility.name.toLowerCase().includes(searchTerm.toLowerCase()) || facility.type.toLowerCase().includes(searchTerm.toLowerCase()) || facility.location.toLowerCase().includes(searchTerm.toLowerCase()));
  const openModal = (facility = null) => {
    if (facility) {
      setCurrentFacility(facility);
      setFormData({
        name: facility.name,
        type: facility.type,
        description: facility.description,
        image: facility.image,
        availableHours: facility.availableHours,
        capacity: facility.capacity,
        creditCost: facility.creditCost,
        location: facility.location
      });
    } else {
      setCurrentFacility(null);
      setFormData({
        name: '',
        type: '',
        description: '',
        image: '',
        availableHours: '',
        capacity: '',
        creditCost: '',
        location: ''
      });
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFacility(null);
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
  };
  const handleSubmit = e => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (currentFacility) {
        // Update existing facility
        setFacilities(facilities.map(f => f.id === currentFacility.id ? {
          ...f,
          ...formData
        } : f));
      } else {
        // Create new facility
        const newFacility = {
          id: Date.now(),
          ...formData,
          capacity: Number(formData.capacity),
          creditCost: Number(formData.creditCost)
        };
        setFacilities([...facilities, newFacility]);
      }
      setIsLoading(false);
      closeModal();
    }, 1000);
  };
  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFacilities(facilities.filter(f => f.id !== id));
        setIsLoading(false);
      }, 1000);
    }
  };
  return <AdminLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          Facility Manager
        </h1>
        <button onClick={() => openModal()} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Facility
        </button>
      </div>
      <div className="mt-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                All Facilities
              </h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" placeholder="Search facilities..." value={searchTerm} onChange={handleSearch} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
              </div>
            </div>
            {isLoading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div> : filteredFacilities.length === 0 ? <div className="text-center py-10">
                <BuildingIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No facilities found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search.' : 'Get started by adding a new facility.'}
                </p>
                {!searchTerm && <div className="mt-6">
                    <button onClick={() => openModal()} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Add Facility
                    </button>
                  </div>}
              </div> : <div className="mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Facility
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Capacity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credit Cost
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hours
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredFacilities.map(facility => <tr key={facility.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {facility.image ? <img className="h-10 w-10 rounded-md object-cover" src={facility.image} alt="" /> : <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                                    <BuildingIcon className="h-6 w-6" />
                                  </div>}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {facility.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {facility.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {facilityTypes.find(t => t.value === facility.type)?.label || facility.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {facility.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {facility.capacity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                            {facility.creditCost} credits/hour
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {facility.availableHours}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => openModal(facility)} className="text-purple-600 hover:text-purple-900 mr-4">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleDelete(facility.id)} className="text-red-600 hover:text-red-900">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
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
                      {currentFacility ? 'Edit Facility' : 'Add New Facility'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Facility Name *
                            </label>
                            <div className="mt-1">
                              <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                              Facility Type *
                            </label>
                            <div className="mt-1">
                              <select id="type" name="type" required value={formData.type} onChange={handleInputChange} className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md">
                                <option value="">Select a type</option>
                                {facilityTypes.map(type => <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>)}
                              </select>
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                              Location *
                            </label>
                            <div className="mt-1">
                              <input type="text" name="location" id="location" required value={formData.location} onChange={handleInputChange} className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                          </div>
                          <div className="sm:col-span-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <div className="mt-1">
                              <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleInputChange} className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                          </div>
                          <div className="sm:col-span-6">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                              Image URL
                            </label>
                            <div className="mt-1">
                              <input type="text" name="image" id="image" value={formData.image} onChange={handleInputChange} className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                              Capacity *
                            </label>
                            <div className="mt-1">
                              <input type="number" name="capacity" id="capacity" required min="1" value={formData.capacity} onChange={handleInputChange} className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="creditCost" className="block text-sm font-medium text-gray-700">
                              Credit Cost/Hour *
                            </label>
                            <div className="mt-1">
                              <input type="number" name="creditCost" id="creditCost" required min="1" value={formData.creditCost} onChange={handleInputChange} className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="availableHours" className="block text-sm font-medium text-gray-700">
                              Available Hours *
                            </label>
                            <div className="mt-1">
                              <input type="text" name="availableHours" id="availableHours" required placeholder="e.g., 9:00 AM - 5:00 PM" value={formData.availableHours} onChange={handleInputChange} className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-start-2 sm:text-sm">
                            {currentFacility ? 'Save Changes' : 'Create Facility'}
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
export default FacilityManager;