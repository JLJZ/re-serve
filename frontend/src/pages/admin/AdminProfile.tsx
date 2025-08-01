import React, { useState } from 'react';
import { UserIcon, MailIcon, BuildingIcon, CalendarIcon, CheckIcon, XIcon } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import ChangePasswordModal from '../../components/ChangePasswordModal';
const AdminProfile = ({
  user,
  onLogout,
  updateUser
}) => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
  return <AdminLayout user={user} onLogout={onLogout}>
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
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Administrator Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your admin account details
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Full Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.name || 'Admin User'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Username
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  @{user?.username || 'admin'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MailIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.email || 'admin@example.com'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BuildingIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Organization
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.organization || 'Main University'}
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
                    {user?.isFirstLogin ? 'Unactivated' : 'Active'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button onClick={() => setIsChangePasswordModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Change Password
          </button>
        </div>
      </div>
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} onSubmit={handleChangePassword} currentPassword={user?.password} />
    </AdminLayout>;
};
export default AdminProfile;