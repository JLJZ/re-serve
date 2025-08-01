import React from 'react';
// Status colors
const statusColors = {
  available: 'bg-green-100 text-green-800 hover:bg-green-200',
  booked: 'bg-red-100 text-red-800 cursor-not-allowed',
  blocked: 'bg-red-100 text-red-800 cursor-not-allowed',
  released: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  selected: 'bg-blue-500 text-white hover:bg-blue-600'
};
const TimeSlotPicker = ({
  date,
  slots,
  onSelectSlot,
  selectedSlot
}) => {
  const formatTime = time => {
    return time.replace(':00', '');
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })}
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {slots.map(slot => <button key={slot.time} disabled={slot.status === 'booked' || slot.status === 'blocked'} onClick={() => onSelectSlot(slot)} className={`
              ${statusColors[selectedSlot?.time === slot.time ? 'selected' : slot.status]}
              py-2 px-1 rounded text-sm font-medium transition-colors
            `}>
            {formatTime(slot.time)}
          </button>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span className="text-xs text-gray-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span className="text-xs text-gray-600">Booked/Blocked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
          <span className="text-xs text-gray-600">Released</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span className="text-xs text-gray-600">Selected</span>
        </div>
      </div>
    </div>;
};
export default TimeSlotPicker;