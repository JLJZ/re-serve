import React from 'react';
import QRCode from 'react-qr-code';
const QRCodeDisplay = ({
  bookingId,
  facilityName
}) => {
  return <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <QRCode value={`booking-${bookingId}`} size={180} />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Scan to check in to {facilityName}
      </p>
      <p className="text-xs text-gray-500">Booking ID: {bookingId}</p>
    </div>;
};
export default QRCodeDisplay;