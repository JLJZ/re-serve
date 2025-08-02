import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {   
  CalendarIcon,
  ClockIcon,
  BuildingIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  TrashIcon,
  QrCodeIcon, } from 'lucide-react';
import UserLayout from '../../components/UserLayout';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../context/AuthContext';

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
}

const formatTime = (time: string) => {
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
};

const BookingDetails = ({ onLogout }: { onLogout?: () => void }) => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // for layout
  const {
    booking,
    loading,
    error,
    cancelBooking,
    canceling,
    refetch,
  } = useBooking(bookingId);
  const [showQRCode, setShowQRCode] = useState(false);
  const [canCheckIn, setCanCheckIn] = useState(false);

  useEffect(() => {
    if (booking) {
      const bookingTime = new Date(`${booking.date}T${booking.startTime}`);
      const now = new Date();
      const timeDiffMinutes = (bookingTime.getTime() - now.getTime()) / (1000 * 60);
      setCanCheckIn(timeDiffMinutes <= 15 && timeDiffMinutes >= -15);
    }
  }, [booking]);

  const handleCancel = async () => {
    try {
      await cancelBooking();
      navigate('/user/dashboard');
    } catch (e) {
      // optionally show error toast
      console.error('Cancel failed', e);
    }
  };

  if (loading) {
    return (
      <UserLayout user={user || undefined} onLogout={onLogout}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout user={user || undefined} onLogout={onLogout}>
        <div className="p-6 text-red-600">
          <h3 className="text-lg font-medium">Error</h3>
          <p>{error}</p>
          <div className="mt-4">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!booking) {
    return (
      <UserLayout user={user || undefined} onLogout={onLogout}>
        <div className="text-center py-10">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Booking not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The booking you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/user/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout user={user || undefined} onLogout={onLogout}>
      <div className="pb-5 border-b border-gray-200 flex items-center">
        <button
          onClick={() => navigate('/user/dashboard')}
          className="mr-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ChevronLeftIcon className="mr-1 h-5 w-5" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold leading-tight text-gray-900">Booking Details</h1>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="flex-shrink-0 w-full md:w-1/3 h-48 bg-gray-200 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                {booking.image ? (
                  <img
                    src={booking.image}
                    alt={booking.facilityName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-6xl">
                    {booking.facilityType === 'study-room'
                      ? '📚'
                      : booking.facilityType === 'lab'
                      ? '🧑‍💻'
                      : booking.facilityType === 'sports-hall'
                      ? '🏀'
                      : booking.facilityType === 'meeting-room'
                      ? '👥'
                      : '🏢'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{booking.facilityName}</h2>
                <p className="mt-1 text-sm text-gray-500">{booking.description}</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <BuildingIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>{booking.location}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>{formatDate(booking.date)}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    <CreditCardIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-500" />
                    <p>{booking.creditCost} credits</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {canCheckIn ? (
                    <button
                      onClick={() => setShowQRCode(prev => !prev)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <QrCodeIcon className="-ml-1 mr-2 h-5 w-5" />
                      {showQRCode ? 'Hide QR Code' : 'Show QR Code for Check-in'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-500 bg-gray-100 cursor-not-allowed"
                    >
                      <QrCodeIcon className="-ml-1 mr-2 h-5 w-5" />
                      Check-in Not Available Yet
                    </button>
                  )}
                  <button
                    onClick={handleCancel}
                    disabled={canceling}
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                    {canceling ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                </div>
              </div>
            </div>
            {showQRCode && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Check-in QR Code
                </h3>
                <div className="flex justify-center">
                  <QRCodeDisplay
                    bookingId={booking.id}
                    facilityName={booking.facilityName}
                  />
                </div>
                <p className="mt-4 text-sm text-center text-gray-500">
                  Scan this QR code at the facility entrance to check in.
                  <br />
                  Remember to check in within 15 minutes of your booking start
                  time.
                </p>
              </div>
            )}
            {!canCheckIn && !showQRCode && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Check-in Information
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          The QR code for check-in will be available 15 minutes
                          before your booking start time. Please remember to
                          check in within 15 minutes of your booking start time
                          to avoid losing your reservation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BookingDetails;