import React, { useState } from 'react';
import { XIcon, UserPlusIcon, AlertCircleIcon } from 'lucide-react';
interface CoBookingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  bookingStatus: string;
}
const CoBookingRequestModal: React.FC<CoBookingRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bookingStatus
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    // Check if booking is confirmed
    if (bookingStatus !== 'confirmed') {
      setError('Co-booking requests can only be sent for confirmed bookings');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(email);
      setSuccess(true);
      setEmail('');
      // Close the modal after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to send co-booking request. Please try again.');
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
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button type="button" onClick={onClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">Close</span>
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <UserPlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Send Co-Booking Request
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Invite someone to share this booking with you. They will
                    receive an email with instructions to accept the invitation.
                  </p>
                </div>
                {bookingStatus !== 'confirmed' && <div className="mt-4 p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Co-booking requests can only be sent for confirmed
                          bookings. Please confirm your booking first.
                        </p>
                      </div>
                    </div>
                  </div>}
                {error && <div className="mt-4 p-3 bg-red-50 rounded-md border-l-4 border-red-400">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircleIcon className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>}
                {success && <div className="mt-4 p-3 bg-green-50 rounded-md border-l-4 border-green-400">
                    <p className="text-sm text-green-700">
                      Co-booking request sent successfully!
                    </p>
                  </div>}
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} disabled={bookingStatus !== 'confirmed' || isLoading || success} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="colleague@university.edu" />
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button type="submit" disabled={bookingStatus !== 'confirmed' || isLoading || success} className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${bookingStatus !== 'confirmed' || isLoading || success ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isLoading ? 'Sending...' : success ? 'Sent!' : 'Send Invitation'}
                      </button>
                      <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm">
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
    </div>;
};
export default CoBookingRequestModal;