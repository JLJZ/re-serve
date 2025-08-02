import React, { useState } from 'react';
import { UserIcon, MailIcon, BuildingIcon, CalendarIcon, CheckIcon, XIcon } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { useAdminProfile } from '../../hooks/useAdminProfile';

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

const AdminProfile = ({ onLogout }: { onLogout?: () => void }) => {
  const { admin: user, loading, error, updateProfile } = useAdminProfile();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // handle change password: backend endpoint expected at /api/auth/change-password
  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      if (!user) throw new Error('Not authenticated');
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Basic auth + x-login-type header assumed to be injected globally or include manually if needed
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
      throw err;
    }
  };

  if (loading) {
    return (
      <AdminLayout user={user || undefined} onLogout={onLogout}>
        <div className="p-6">Loading profile...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout user={user || undefined} onLogout={onLogout}>
        <div className="p-6 text-red-600">Error loading profile: {error}</div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout user={null} onLogout={onLogout}>
        <div className="p-6">Not authenticated.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-tight text-gray-900">My Profile</h1>
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
              {/* Full Name */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Full Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.name || 'Admin User'}
                </dd>
              </div>
              {/* Username */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Username
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  @{user.name}
                </dd>
              </div>
              {/* Email */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MailIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email || 'admin@example.com'}
                </dd>
              </div>
              {/* Organization */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BuildingIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Organization
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.organization || 'Main University'}
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
            </dl>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Change Password
          </button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        currentPassword={''}
      />
    </AdminLayout>
  );
};

export default AdminProfile;