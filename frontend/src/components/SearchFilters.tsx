import React, { useState } from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';
const SearchFilters = ({
  filters,
  setFilters,
  facilityTypes,
  onSearch
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleCheckboxChange = e => {
    const {
      name,
      checked
    } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSearch(filters);
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" name="searchTerm" value={filters.searchTerm} onChange={handleInputChange} placeholder="Search facilities..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:hidden">
              <FilterIcon className="h-4 w-4 mr-1" />
              Filters
            </button>
          </div>
          <div className={`${isExpanded || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label htmlFor="facilityType" className="block text-sm font-medium text-gray-700 mb-1">
                  Facility Type
                </label>
                <select id="facilityType" name="facilityType" value={filters.facilityType} onChange={handleInputChange} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option value="">All Types</option>
                  {facilityTypes.map(type => <option key={type.value} value={type.value}>
                      {type.label}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input type="date" id="date" name="date" value={filters.date} onChange={handleInputChange} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <div className="mt-1">
                  <input type="time" name="startTime" id="startTime" value={filters.startTime} onChange={handleInputChange} className={`block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm`} />
                </div>
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <div className="mt-1">
                  <input type="time" name="endTime" id="endTime" value={filters.endTime} onChange={handleInputChange} className={`block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm`} />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <input id="showAvailableOnly" name="showAvailableOnly" type="checkbox" checked={filters.showAvailableOnly} onChange={handleCheckboxChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="showAvailableOnly" className="ml-2 block text-sm text-gray-700">
                  Available Only
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>;
};
export default SearchFilters;