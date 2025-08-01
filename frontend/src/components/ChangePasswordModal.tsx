import React, { useState } from 'react';
import { XIcon, EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
  isFirstTimeLogin?: boolean;
  currentPassword?: string;
}
const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isFirstTimeLogin = false,
  currentPassword = ''
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  if (!isOpen) return null;
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!isFirstTimeLogin && !oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (newPassword === oldPassword || newPassword === currentPassword) {
      newErrors.newPassword = 'New password cannot be the same as your current password';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await onSubmit(oldPassword, newPassword);
      // Reset form on success
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      setSuccess(true);
      // Close the modal after a delay if it's not first time login
      if (!isFirstTimeLogin) {
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      }
    } catch (error) {
      // Handle error - in a real app, you'd get the error from the API response
      setErrors({
        form: 'Failed to change password. Please check your current password and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {!isFirstTimeLogin && <div className="absolute top-0 right-0 pt-4 pr-4">
              <button type="button" onClick={onClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" />
              </button>
            </div>}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <LockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isFirstTimeLogin ? 'Set Your Password' : 'Change Password'}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {isFirstTimeLogin ? 'Welcome! Please set a new password for your account. Your default password is "password".' : 'Update your account password below. Make sure to choose a strong, secure password.'}
                  </p>
                </div>
                {errors.form && <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400 text-sm text-red-700">
                    {errors.form}
                  </div>}
                {success && <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 text-sm text-green-700">
                    Password changed successfully!
                  </div>}
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      {!isFirstTimeLogin && <div>
                          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input type={showOldPassword ? 'text' : 'password'} name="oldPassword" id="oldPassword" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className={`block w-full pr-10 sm:text-sm rounded-md ${errors.oldPassword ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                {showOldPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                          {errors.oldPassword && <p className="mt-1 text-sm text-red-600">
                              {errors.oldPassword}
                            </p>}
                        </div>}
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input type={showNewPassword ? 'text' : 'password'} name="newPassword" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`block w-full pr-10 sm:text-sm rounded-md ${errors.newPassword ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                              {showNewPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        {errors.newPassword && <p className="mt-1 text-sm text-red-600">
                            {errors.newPassword}
                          </p>}
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`block w-full pr-10 sm:text-sm rounded-md ${errors.confirmPassword ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                              {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">
                            {errors.confirmPassword}
                          </p>}
                      </div>
                      <div className="bg-blue-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-blue-800">
                          Password Requirements
                        </h4>
                        <ul className="mt-1 text-xs text-blue-700 list-disc list-inside">
                          <li>At least 8 characters long</li>
                          <li>
                            Include a mix of letters, numbers, and symbols for
                            better security
                          </li>
                          <li>Avoid using easily guessable information</li>
                          <li>Cannot be the same as your current password</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button type="submit" disabled={isLoading || success} className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${isLoading || success ? 'opacity-75 cursor-not-allowed' : ''}`}>
                        {isLoading ? 'Processing...' : success ? 'Password Changed!' : isFirstTimeLogin ? 'Set Password' : 'Change Password'}
                      </button>
                      {!isFirstTimeLogin && <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                          Cancel
                        </button>}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ChangePasswordModal;