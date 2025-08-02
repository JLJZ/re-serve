import React, { useEffect, useState, FormEvent } from 'react';
import {   
  UserIcon,
  MailIcon,
  BuildingIcon,
  CreditCardIcon,
  CalendarIcon,
  LockIcon,
  SaveIcon,
  CheckIcon,
  XIcon, } from 'lucide-react';
import UserLayout from '../../components/UserLayout';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { useUserProfile } from '../../hooks/useUserProfile';

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const UserProfile = ({ onLogout }: { onLogout?: () => void }) => {
  const { user, loading, error, updateProfile, isAdmin } = useUserProfile();

  const [isLoading, setIsLoading] = useState(false); // for saveProfile
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    faculty: '',
    username: '',
  });
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    faculty: '',
    username: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync hook user into local form state
  useEffect(() => {
    if (user) {
      const userData = {
        name: (user as any).name || '',
        email: (user as any).email || '',
        faculty: (user as any).faculty || '',
        username: (user as any).username || '',
      };
      setProfileData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const startEditing = () => {
    setIsEditing(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const cancelEditing = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
    setErrorMessage('');
  };

  const saveProfile = async () => {
    if (!updateProfile) return;
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const updated = await updateProfile({
        name: profileData.name,
        email: profileData.email,
        faculty: profileData.faculty,
      });
      const newOriginal = {
        name: updated.name || '',
        email: updated.email || '',
        faculty: updated.faculty || '',
        username: updated. name || '',
      };
      setOriginalData(newOriginal);
      setProfileData(newOriginal);
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setErrorMessage(
        (err as Error).message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Change password: expects backend endpoint /api/auth/change-password
  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      if (!user) throw new Error('Not authenticated');
      // Call backend with Basic auth and login-type header; reuse credentials via cookie or context
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming backend uses existing Basic auth header from fetch (in interceptor) or via context.
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || 'Failed to change password');
      }
      setSuccessMessage('Password changed successfully');
    } catch (err) {
      setErrorMessage((err as Error).message || 'Password change failed');
      throw err; // allow modal to show its own error logic if needed
    }
  };

  if (loading) {
    return (
      <UserLayout user={user || undefined} onLogout={onLogout}>
        <div className="p-6">Loading profile...</div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout user={user || undefined} onLogout={onLogout}>
        <div className="p-6 text-red-600">Error loading profile: {error}</div>
      </UserLayout>
    );
  }

  if (!user) {
    return (
      <UserLayout user={null} onLogout={onLogout}>
        <div className="p-6">Not authenticated.</div>
      </UserLayout>
    );
  }

  return (
    <UserLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-tight text-gray-900">My Profile</h1>
          {isAdmin && (
            <div className="mt-1 px-2 py-1 inline-flex text-xs font-medium rounded bg-yellow-100 text-yellow-800">
              Admin session
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        {successMessage && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
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
              {!isEditing ? (
                <button
                  onClick={startEditing}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={cancelEditing}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={isLoading}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 text-white">⟳</div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {/* Full Name */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Full Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    profileData.name
                  )}
                </dd>
              </div>
              {/* Email */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MailIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    profileData.email
                  )}
                </dd>
              </div>
              {/* Username */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Username
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  @{profileData.username}
                </dd>
              </div>
              {/* Faculty / faculty */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BuildingIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Faculty
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <select
                      id="faculty"
                      name="faculty"
                      value={profileData.faculty}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
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
                    </select>
                  ) : (
                    profileData.faculty || 'Not specified'
                  )}
                </dd>
              </div>
              {/* Password */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <LockIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Password
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <span className="mr-2">••••••••</span>
                  <button
                    onClick={() => setIsChangePasswordModalOpen(true)}
                    className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Change Password
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Account Info */}
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
              {/* Credit Balance */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CreditCardIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Credit Balance
                </dt>
                <dd className="mt-1 text-sm font-medium text-blue-600 sm:mt-0 sm:col-span-2">
                  {(user as any)?.credits || 0} credits
                </dd>
              </div>
              {/* Total Bookings */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Total Bookings
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {(user as any)?.totalBookings || 0} bookings
                </dd>
              </div>
              {/* Last Login */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Last Login
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate((user as any)?.lastLogin)}
                </dd>
              </div>
              {/* Account Status */}
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

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        currentPassword={''} // remove reliance on stored password
      />
    </UserLayout>
  );
};

export default UserProfile;