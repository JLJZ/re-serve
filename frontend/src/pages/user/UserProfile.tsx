import React, { useEffect, useState } from 'react';
import { UserIcon, MailIcon, BuildingIcon, CreditCardIcon, CalendarIcon, LockIcon, SaveIcon, CheckIcon, XIcon } from 'lucide-react';
import UserLayout from '../../components/UserLayout';
import ChangePasswordModal from '../../components/ChangePasswordModal';
const UserProfile = ({
  user,
  onLogout,
  updateUser
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
    username: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    // Initialize profile data from user prop
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        username: user.username || ''
      };
      setProfileData(userData);
      setOriginalData(userData);
    }
  }, [user]);
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  const startEditing = () => {
    setIsEditing(true);
    setSuccessMessage('');
    setErrorMessage('');
  };
  const cancelEditing = () => {
    setProfileData({
      ...originalData
    });
    setIsEditing(false);
    setErrorMessage('');
  };
  const saveProfile = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update the original data
      setOriginalData({
        ...profileData
      });
      // Show success message
      setSuccessMessage('Profile updated successfully');
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangePassword = async (oldPassword, newPassword) => {
    // Simulate API call to change password
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo purposes, only validate that old password is "password" or the actual password
        if (oldPassword === 'password' || oldPassword === user.password) {
          // Check if new password is the same as old password
          if (newPassword === oldPassword || newPassword === user.password) {
            reject(new Error('New password cannot be the same as your current password'));
            return;
          }
          // Success
          setSuccessMessage('Password changed successfully');
          // Update the user's password in the parent component
          updateUser({
            password: newPassword
          });
          resolve();
        } else {
          // Failure
          reject(new Error('Current password is incorrect'));
        }
      }, 1000);
    });
  };
  const formatDate = dateStr => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  return <UserLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">
          My Profile
        </h1>
      </div>
      <div className="mt-6">
        {successMessage && <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>}
        {errorMessage && <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your account details and preferences
              </p>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? <button onClick={startEditing} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Edit Profile
                </button> : <>
                  <button onClick={cancelEditing} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cancel
                  </button>
                  <button onClick={saveProfile} disabled={isLoading} className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                    {isLoading ? <>
                        <div className="animate-spin mr-2 h-4 w-4 text-white">
                          ⟳
                        </div>
                        Saving...
                      </> : <>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        Save Changes
                      </>}
                  </button>
                </>}
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Full Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? <input type="text" name="name" id="name" value={profileData.name} onChange={handleInputChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" /> : profileData.name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MailIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? <input type="email" name="email" id="email" value={profileData.email} onChange={handleInputChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" /> : profileData.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Username
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  @{profileData.username}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BuildingIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Faculty
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? <select id="department" name="department" value={profileData.department} onChange={handleInputChange} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      <option value="">Select a faculty</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="Operations">Operations</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Research">Research</option>
                    </select> : profileData.department || 'Not specified'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <LockIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Password
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <span className="mr-2">••••••••</span>
                  <button onClick={() => setIsChangePasswordModalOpen(true)} className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Change Password
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Account Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your account details and usage statistics
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CreditCardIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Credit Balance
                </dt>
                <dd className="mt-1 text-sm font-medium text-blue-600 sm:mt-0 sm:col-span-2">
                  {user?.credits || 0} credits
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Total Bookings
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.totalBookings || 0} bookings
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Last Login
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(user?.lastLogin)}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Account Status
                </dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} onSubmit={handleChangePassword} currentPassword={user?.password} />
    </UserLayout>;
};
export default UserProfile;