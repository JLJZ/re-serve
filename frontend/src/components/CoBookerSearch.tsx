import React, { useEffect, useState } from 'react';
import { SearchIcon, PlusCircleIcon, XCircleIcon, UserIcon, CheckIcon, ClockIcon } from 'lucide-react';
// Mock user data for demonstration
const mockUsers = [{
  id: 1,
  username: 'johndoe',
  name: 'John Doe',
  faculty: 'Engineering'
}, {
  id: 2,
  username: 'janedoe',
  name: 'Jane Doe',
  faculty: 'Marketing'
}, {
  id: 3,
  username: 'mikebrown',
  name: 'Mike Brown',
  faculty: 'Finance'
}, {
  id: 4,
  username: 'sarahsmith',
  name: 'Sarah Smith',
  faculty: 'HR'
}, {
  id: 5,
  username: 'alexjohnson',
  name: 'Alex Johnson',
  faculty: 'Design'
}, {
  id: 6,
  username: 'emilywong',
  name: 'Emily Wong',
  faculty: 'Product'
}, {
  id: 7,
  username: 'davidchen',
  name: 'David Chen',
  faculty: 'Engineering'
}, {
  id: 8,
  username: 'lisawilson',
  name: 'Lisa Wilson',
  faculty: 'Sales'
}];
export interface CoBooker {
  id: number;
  username: string;
  name: string;
  faculty: string;
  status: 'pending' | 'accepted' | 'declined';
}
interface CoBookerSearchProps {
  onCoBookersChange: (coBookers: CoBooker[]) => void;
  facilityCapacity: number;
  disabled?: boolean;
}
const CoBookerSearch: React.FC<CoBookerSearchProps> = ({
  onCoBookersChange,
  facilityCapacity,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCoBookers, setSelectedCoBookers] = useState<CoBooker[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 2) {
      setIsSearching(true);
      setShowResults(true);
      // Simulate API call with delay
      setTimeout(() => {
        const filtered = mockUsers.filter(user => !selectedCoBookers.some(selected => selected.id === user.id) && (user.username.toLowerCase().includes(value.toLowerCase()) || user.name.toLowerCase().includes(value.toLowerCase())));
        setSearchResults(filtered);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };
  // Add co-booker
  const handleAddCoBooker = (user: any) => {
    if (selectedCoBookers.length >= facilityCapacity - 1) {
      alert(`You can only add up to ${facilityCapacity - 1} co-bookers for this facility.`);
      return;
    }
    const newCoBooker: CoBooker = {
      ...user,
      status: 'pending'
    };
    const updatedCoBookers = [...selectedCoBookers, newCoBooker];
    setSelectedCoBookers(updatedCoBookers);
    onCoBookersChange(updatedCoBookers);
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };
  // Remove co-booker
  const handleRemoveCoBooker = (userId: number) => {
    const updatedCoBookers = selectedCoBookers.filter(user => user.id !== userId);
    setSelectedCoBookers(updatedCoBookers);
    onCoBookersChange(updatedCoBookers);
  };
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowResults(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  // For demo purposes, randomly accept some co-bookers after a delay
  useEffect(() => {
    if (selectedCoBookers.length > 0) {
      const timeouts = selectedCoBookers.filter(user => user.status === 'pending').map(user => {
        // Randomly accept some co-bookers after 3-10 seconds
        const shouldAccept = Math.random() > 0.3;
        const delay = Math.floor(Math.random() * 7000) + 3000;
        return setTimeout(() => {
          if (shouldAccept) {
            const updatedCoBookers = selectedCoBookers.map(u => u.id === user.id ? {
              ...u,
              status: 'accepted' as const
            } : u);
            setSelectedCoBookers(updatedCoBookers);
            onCoBookersChange(updatedCoBookers);
          }
        }, delay);
      });
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [selectedCoBookers, onCoBookersChange]);
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Add Co-Bookers (Optional)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Share this booking with other users to split the credit cost. Each
          co-booker must accept your invitation.
        </p>
        {selectedCoBookers.length > 0 && <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Invited Co-Bookers:
            </h4>
            <div className="space-y-2">
              {selectedCoBookers.map(user => <div key={user.id} className={`flex items-center justify-between p-3 rounded-md ${user.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{user.username} • {user.faculty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {user.status === 'pending' ? <span className="flex items-center text-xs text-yellow-700 mr-3">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Pending
                      </span> : <span className="flex items-center text-xs text-green-700 mr-3">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Accepted
                      </span>}
                    {!disabled && <button onClick={() => handleRemoveCoBooker(user.id)} className="text-gray-400 hover:text-red-500">
                        <XCircleIcon className="h-5 w-5" />
                      </button>}
                  </div>
                </div>)}
            </div>
          </div>}
        {!disabled && selectedCoBookers.length < facilityCapacity - 1 && <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border-0 focus:ring-0 sm:text-sm" placeholder="Search users by name or username..." value={searchTerm} onChange={handleSearchChange} onClick={e => {
            e.stopPropagation();
            if (searchTerm.length >= 2) {
              setShowResults(true);
            }
          }} />
            </div>
            {showResults && <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                {isSearching ? <div className="p-4 text-center text-sm text-gray-500">
                    Searching...
                  </div> : searchResults.length === 0 ? <div className="p-4 text-center text-sm text-gray-500">
                    {searchTerm.length < 2 ? 'Type at least 2 characters to search' : 'No users found'}
                  </div> : <ul className="divide-y divide-gray-200">
                    {searchResults.map(user => <li key={user.id} className="p-2 hover:bg-gray-50 cursor-pointer" onClick={() => handleAddCoBooker(user)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                @{user.username} • {user.faculty}
                              </p>
                            </div>
                          </div>
                          <PlusCircleIcon className="h-5 w-5 text-blue-500" />
                        </div>
                      </li>)}
                  </ul>}
              </div>}
          </div>}
        {selectedCoBookers.length >= facilityCapacity - 1 && <div className="text-sm text-blue-600">
            You've reached the maximum number of co-bookers for this facility.
          </div>}
        {selectedCoBookers.length > 0 && <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              Credit Sharing
            </h4>
            <p className="text-xs text-blue-600">
              {selectedCoBookers.filter(u => u.status === 'accepted').length > 0 ? `Credit cost will be split between you and ${selectedCoBookers.filter(u => u.status === 'accepted').length} accepted co-bookers.` : 'If co-bookers accept your invitation, the credit cost will be split equally.'}
            </p>
          </div>}
      </div>
    </div>;
};
export default CoBookerSearch;