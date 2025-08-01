import React, { useEffect, useState } from 'react';
import { SearchIcon, PlusIcon, MinusIcon, RefreshCwIcon, CreditCardIcon, UsersIcon, XIcon, ChevronRightIcon, ChevronLeftIcon, TrashIcon, UserPlusIcon } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
// Mock data
const mockUsers = [{
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'user',
  credits: 100,
  lastLogin: '2023-09-12T14:30:00',
  totalBookings: 15,
  isFirstLogin: false,
  faculty: 'Engineering',
  username: 'johndoe'
}, {
  id: 2,
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  role: 'user',
  credits: 75,
  lastLogin: '2023-09-13T09:45:00',
  totalBookings: 8,
  isFirstLogin: false,
  faculty: 'Marketing',
  username: 'janesmith'
}, {
  id: 3,
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'user',
  credits: 50,
  lastLogin: '2023-09-10T16:20:00',
  totalBookings: 12,
  isFirstLogin: true,
  faculty: 'Finance',
  username: 'alexjohnson'
}, {
  id: 4,
  name: 'Sarah Williams',
  email: 'sarah.williams@example.com',
  role: 'user',
  credits: 120,
  lastLogin: '2023-09-11T11:15:00',
  totalBookings: 20,
  isFirstLogin: false,
  faculty: 'HR',
  username: 'sarahwilliams'
}, {
  id: 5,
  name: 'Michael Brown',
  email: 'michael.brown@example.com',
  role: 'user',
  credits: 30,
  lastLogin: '2023-09-08T10:30:00',
  totalBookings: 5,
  isFirstLogin: true,
  faculty: 'Sales',
  username: 'michaelbrown'
}];
const mockCreditHistory = [{
  id: 'c1',
  userId: 1,
  userName: 'John Doe',
  amount: 50,
  type: 'addition',
  reason: 'Monthly allocation',
  date: '2023-09-01T10:00:00',
  adminName: 'Admin User'
}, {
  id: 'c2',
  userId: 1,
  userName: 'John Doe',
  amount: -10,
  type: 'deduction',
  reason: 'Study Room Booking',
  date: '2023-09-05T14:30:00',
  adminName: null
}, {
  id: 'c3',
  userId: 2,
  userName: 'Jane Smith',
  amount: 25,
  type: 'addition',
  reason: 'Special allocation',
  date: '2023-09-08T09:15:00',
  adminName: 'Admin User'
}, {
  id: 'c4',
  userId: 3,
  userName: 'Alex Johnson',
  amount: -15,
  type: 'deduction',
  reason: 'Basketball Court Booking',
  date: '2023-09-10T16:30:00',
  adminName: null
}];
// Available faculties for new users
const faculties = ['Engineering', 'Marketing', 'Finance', 'HR', 'Sales', 'Design', 'Product', 'Operations', 'Customer Support', 'Research'];
const UserCreditManager = ({
  user,
  onLogout
}) => {
  const [users, setUsers] = useState([]);
  const [creditHistory, setCreditHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [creditType, setCreditType] = useState('addition');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState('users');
  const [errors, setErrors] = useState({});
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    username: '',
    faculty: '',
    credits: 50
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setCreditHistory(mockCreditHistory);
      setIsLoading(false);
    }, 1000);
  }, []);
  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.faculty.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredHistory = creditHistory.filter(entry => entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) || entry.reason.toLowerCase().includes(searchTerm.toLowerCase()));
  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginate = pageNumber => setCurrentPage(pageNumber);
  const openModal = user => {
    setSelectedUser(user);
    setCreditAmount('');
    setCreditReason('');
    setCreditType('addition');
    setErrors({});
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const openCreateUserModal = () => {
    setNewUser({
      name: '',
      email: '',
      username: '',
      faculty: '',
      credits: 50
    });
    setErrors({});
    setIsCreateUserModalOpen(true);
  };
  const closeCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };
  const openDeleteModal = user => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };
  const validateForm = () => {
    const newErrors = {};
    if (!creditAmount || isNaN(creditAmount) || Number(creditAmount) <= 0) {
      newErrors.creditAmount = 'Please enter a valid positive number';
    }
    if (!creditReason.trim()) {
      newErrors.creditReason = 'Please provide a reason';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateCreateUserForm = () => {
    const newErrors = {};
    if (!newUser.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!newUser.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      newErrors.email = 'Email is invalid';
    } else if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      newErrors.email = 'Email already exists';
    }
    if (!newUser.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      newErrors.username = 'Username already exists';
    }
    if (!newUser.faculty) {
      newErrors.faculty = 'Faculty is required';
    }
    if (!newUser.credits || isNaN(newUser.credits) || Number(newUser.credits) < 0) {
      newErrors.credits = 'Please enter a valid number of credits';
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
      // Update user credits
      const updatedUsers = users.map(u => {
        if (u.id === selectedUser.id) {
          const updatedCredits = creditType === 'addition' ? u.credits + Number(creditAmount) : u.credits - Number(creditAmount);
          return {
            ...u,
            credits: updatedCredits
          };
        }
        return u;
      });
      // Add to credit history
      const newHistoryEntry = {
        id: `c${Date.now()}`,
        userId: selectedUser.id,
        userName: selectedUser.name,
        amount: creditType === 'addition' ? Number(creditAmount) : -Number(creditAmount),
        type: creditType,
        reason: creditReason,
        date: new Date().toISOString(),
        adminName: user.name
      };
      setUsers(updatedUsers);
      setCreditHistory([newHistoryEntry, ...creditHistory]);
      setIsLoading(false);
      closeModal();
    }, 1000);
  };
  const handleCreateUser = e => {
    e.preventDefault();
    if (!validateCreateUserForm()) {
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newUserId = Math.max(...users.map(u => u.id)) + 1;
      const createdUser = {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        faculty: newUser.faculty,
        role: 'user',
        credits: Number(newUser.credits),
        lastLogin: null,
        totalBookings: 0,
        isFirstLogin: true
      };
      // Add user to the list
      setUsers([...users, createdUser]);
      // Add credit history entry for initial credit allocation
      if (Number(newUser.credits) > 0) {
        const newHistoryEntry = {
          id: `c${Date.now()}`,
          userId: newUserId,
          userName: newUser.name,
          amount: Number(newUser.credits),
          type: 'addition',
          reason: 'Initial credit allocation',
          date: new Date().toISOString(),
          adminName: user.name
        };
        setCreditHistory([newHistoryEntry, ...creditHistory]);
      }
      setIsLoading(false);
      closeCreateUserModal();
    }, 1000);
  };
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Remove user from the list
      setUsers(users.filter(u => u.id !== userToDelete.id));
      // Remove user's credit history
      setCreditHistory(creditHistory.filter(entry => entry.userId !== userToDelete.id));
      setIsLoading(false);
      closeDeleteModal();
    }, 1000);
  };
  const handleNewUserInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };
  const formatDate = dateStr => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  return <AdminLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          User Management
        </h1>
      </div>
      <div className="mt-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <nav className="-mb-px flex space-x-8">
                    <button className={`
                        whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                        ${activeTab === 'users' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                      `} onClick={() => setActiveTab('users')}>
                      Users
                    </button>
                    <button className={`
                        whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                        ${activeTab === 'history' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                      `} onClick={() => setActiveTab('history')}>
                      Credit History
                    </button>
                  </nav>
                </div>
                <div className="flex items-center space-x-4">
                  {activeTab === 'users' && <button onClick={openCreateUserModal} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                      <UserPlusIcon className="h-4 w-4 mr-1" />
                      Create User
                    </button>}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" placeholder={activeTab === 'users' ? 'Search users...' : 'Search credit history...'} value={searchTerm} onChange={handleSearch} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                  </div>
                </div>
              </div>
            </div>
            {isLoading ? <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div> : activeTab === 'users' ? <>
                {currentUsers.length === 0 ? <div className="text-center py-10">
                    <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No users found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or create a new user.
                    </p>
                    <div className="mt-6">
                      <button onClick={openCreateUserModal} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Create User
                      </button>
                    </div>
                  </div> : <div className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Faculty
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Credits
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Last Login
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentUsers.map(user => <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-purple-800 font-medium">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      @{user.username} • {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.faculty || '—'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-purple-600">
                                  {user.credits} credits
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(user.lastLogin)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {user.isFirstLogin ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    New Account
                                  </span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <button onClick={() => openModal(user)} className="text-purple-600 hover:text-purple-900">
                                    Adjust Credits
                                  </button>
                                  <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-900">
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                        <div className="flex flex-1 justify-between sm:hidden">
                          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                            Previous
                          </button>
                          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing{' '}
                              <span className="font-medium">
                                {indexOfFirstUser + 1}
                              </span>{' '}
                              to{' '}
                              <span className="font-medium">
                                {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
                              </span>{' '}
                              of{' '}
                              <span className="font-medium">
                                {filteredUsers.length}
                              </span>{' '}
                              users
                            </p>
                          </div>
                          <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}>
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                              {[...Array(totalPages)].map((_, i) => <button key={i} onClick={() => paginate(i + 1)} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1 ? 'z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}>
                                  {i + 1}
                                </button>)}
                              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}>
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>}
                  </div>}
              </> : <>
                {filteredHistory.length === 0 ? <div className="text-center py-10">
                    <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No credit history found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search.
                    </p>
                  </div> : <div className="mt-4">
                    <div className="overflow-hidden">
                      <ul className="divide-y divide-gray-200">
                        {filteredHistory.map(entry => <li key={entry.id} className="py-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                  <div className={`flex items-center justify-center h-10 w-10 rounded-full ${entry.type === 'addition' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {entry.type === 'addition' ? <PlusIcon className="h-6 w-6 text-green-600" /> : <MinusIcon className="h-6 w-6 text-red-600" />}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="text-base font-medium text-gray-900">
                                      {entry.userName}
                                    </h3>
                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.type === 'addition' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {entry.type === 'addition' ? '+' : '-'}
                                      {Math.abs(entry.amount)} credits
                                    </span>
                                  </div>
                                  <div className="mt-1 text-sm text-gray-500">
                                    <p>
                                      <span className="font-medium">
                                        Reason:
                                      </span>{' '}
                                      {entry.reason}
                                    </p>
                                  </div>
                                  <div className="mt-1 text-xs text-gray-400">
                                    <p>
                                      {entry.adminName ? `Adjusted by ${entry.adminName} on ${formatDate(entry.date)}` : `System deduction on ${formatDate(entry.date)}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>)}
                      </ul>
                    </div>
                  </div>}
              </>}
          </div>
        </div>
      </div>
      {/* Credit Adjustment Modal */}
      {isModalOpen && selectedUser && <div className="fixed z-10 inset-0 overflow-y-auto">
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
                      Adjust Credits for {selectedUser.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Current balance:{' '}
                        <span className="font-medium text-purple-600">
                          {selectedUser.credits} credits
                        </span>
                      </p>
                    </div>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Credit Adjustment Type
                            </label>
                            <div className="mt-1 flex space-x-4">
                              <div className="flex items-center">
                                <input id="addition" name="creditType" type="radio" value="addition" checked={creditType === 'addition'} onChange={() => setCreditType('addition')} className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300" />
                                <label htmlFor="addition" className="ml-2 block text-sm text-gray-700">
                                  Add Credits
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input id="deduction" name="creditType" type="radio" value="deduction" checked={creditType === 'deduction'} onChange={() => setCreditType('deduction')} className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300" />
                                <label htmlFor="deduction" className="ml-2 block text-sm text-gray-700">
                                  Deduct Credits
                                </label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700">
                              Amount *
                            </label>
                            <div className="mt-1">
                              <input type="number" name="creditAmount" id="creditAmount" min="1" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.creditAmount ? 'border-red-300' : ''}`} />
                              {errors.creditAmount && <p className="mt-1 text-sm text-red-600">
                                  {errors.creditAmount}
                                </p>}
                            </div>
                          </div>
                          <div>
                            <label htmlFor="creditReason" className="block text-sm font-medium text-gray-700">
                              Reason *
                            </label>
                            <div className="mt-1">
                              <input type="text" name="creditReason" id="creditReason" value={creditReason} onChange={e => setCreditReason(e.target.value)} placeholder="e.g., Monthly allocation, Special bonus, etc." className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.creditReason ? 'border-red-300' : ''}`} />
                              {errors.creditReason && <p className="mt-1 text-sm text-red-600">
                                  {errors.creditReason}
                                </p>}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium text-gray-900">
                              Summary
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {creditType === 'addition' ? 'Adding' : 'Deducting'}{' '}
                              {creditAmount || '0'} credits
                              {creditType === 'addition' ? ` to ${selectedUser.name}'s account.` : ` from ${selectedUser.name}'s account.`}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              New balance will be:
                              <span className="font-medium text-purple-600">
                                {' '}
                                {creditAmount && !isNaN(creditAmount) ? creditType === 'addition' ? selectedUser.credits + Number(creditAmount) : selectedUser.credits - Number(creditAmount) : selectedUser.credits}{' '}
                                credits
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-start-2 sm:text-sm">
                            Confirm Adjustment
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
      {/* Create User Modal */}
      {isCreateUserModalOpen && <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button type="button" onClick={closeCreateUserModal} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Create New User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Fill in the details below to create a new user account.
                        The user will be prompted to change their password on
                        first login.
                      </p>
                    </div>
                    <div className="mt-4">
                      <form onSubmit={handleCreateUser}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Full Name *
                            </label>
                            <div className="mt-1">
                              <input type="text" name="name" id="name" value={newUser.name} onChange={handleNewUserInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`} />
                              {errors.name && <p className="mt-1 text-sm text-red-600">
                                  {errors.name}
                                </p>}
                            </div>
                          </div>
                          <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                              Username *
                            </label>
                            <div className="mt-1">
                              <input type="text" name="username" id="username" value={newUser.username} onChange={handleNewUserInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.username ? 'border-red-300' : ''}`} />
                              {errors.username && <p className="mt-1 text-sm text-red-600">
                                  {errors.username}
                                </p>}
                            </div>
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email Address *
                            </label>
                            <div className="mt-1">
                              <input type="email" name="email" id="email" value={newUser.email} onChange={handleNewUserInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.email ? 'border-red-300' : ''}`} />
                              {errors.email && <p className="mt-1 text-sm text-red-600">
                                  {errors.email}
                                </p>}
                            </div>
                          </div>
                          <div>
                            <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
                              Faculty *
                            </label>
                            <div className="mt-1">
                              <select name="faculty" id="faculty" value={newUser.faculty} onChange={handleNewUserInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.faculty ? 'border-red-300' : ''}`}>
                                <option value="">Select a faculty</option>
                                {faculties.map(faculty => <option key={faculty} value={faculty}>
                                    {faculty}
                                  </option>)}
                              </select>
                              {errors.faculty && <p className="mt-1 text-sm text-red-600">
                                  {errors.faculty}
                                </p>}
                            </div>
                          </div>
                          <div>
                            <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                              Initial Credits
                            </label>
                            <div className="mt-1">
                              <input type="number" name="credits" id="credits" min="0" value={newUser.credits} onChange={handleNewUserInputChange} className={`shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.credits ? 'border-red-300' : ''}`} />
                              {errors.credits && <p className="mt-1 text-sm text-red-600">
                                  {errors.credits}
                                </p>}
                            </div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium text-yellow-800">
                              Important Note
                            </h4>
                            <p className="mt-1 text-sm text-yellow-700">
                              The user will be created with a default password
                              of "password" and will be prompted to change it on
                              first login.
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-start-2 sm:text-sm">
                            Create User
                          </button>
                          <button type="button" onClick={closeCreateUserModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:col-start-1 sm:text-sm">
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
      {/* Delete User Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete User Account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the account for{' '}
                        <span className="font-medium">{userToDelete.name}</span>
                        ? This action cannot be undone, and all associated
                        bookings and credit history will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" onClick={handleDeleteUser} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Delete
                </button>
                <button type="button" onClick={closeDeleteModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>}
    </AdminLayout>;
};
export default UserCreditManager;