import React from 'react';
import { ClockIcon, UsersIcon, CreditCardIcon } from 'lucide-react';
const facilityIcons = {
  'study-room': '📚',
  lab: '🧑‍💻',
  'sports-hall': '🏀',
  'meeting-room': '👥',
  auditorium: '🎭',
  library: '📖'
};
const FacilityCard = ({
  facility,
  onClick,
  showDetails = true
}) => {
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick && onClick(facility)}>
      <div className="relative h-40 bg-gray-200">
        {facility.image ? <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-6xl">
            {facilityIcons[facility.type] || '🏢'}
          </div>}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium shadow-sm">
          {facilityIcons[facility.type] || '🏢'}{' '}
          {facility.type.replace('-', ' ')}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {facility.name}
        </h3>
        {showDetails && <>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {facility.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{facility.availableHours}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <UsersIcon className="w-4 h-4 mr-1" />
              <span>Capacity: {facility.capacity}</span>
            </div>
            <div className="flex items-center text-sm text-blue-600 font-medium">
              <CreditCardIcon className="w-4 h-4 mr-1" />
              <span>{facility.creditCost} credits/hour</span>
            </div>
          </>}
      </div>
    </div>;
};
export default FacilityCard;