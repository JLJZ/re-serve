import React, { useCallback, useMemo, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);
// Custom toolbar component to match our design
const CustomToolbar = ({
  onNavigate,
  label,
  onView,
  view
}) => {
  return <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900">{label}</h3>
      <div className="flex items-center space-x-2">
        <button onClick={() => onNavigate('PREV')} className="p-2 rounded-md hover:bg-gray-100">
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <button onClick={() => onNavigate('TODAY')} className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
          Today
        </button>
        <button onClick={() => onNavigate('NEXT')} className="p-2 rounded-md hover:bg-gray-100">
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
        <div className="border-l border-gray-300 h-6 mx-2"></div>
        <button onClick={() => onView(Views.WEEK)} className={`px-3 py-1 text-sm font-medium rounded-md ${view === Views.WEEK ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}>
          Week
        </button>
        <button onClick={() => onView(Views.DAY)} className={`px-3 py-1 text-sm font-medium rounded-md ${view === Views.DAY ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}>
          Day
        </button>
      </div>
    </div>;
};
// Format existing bookings to calendar events
const formatBookingsToEvents = (bookings, facilityName) => {
  return bookings.map(booking => {
    const startDate = new Date(`${booking.date}T${booking.startTime}`);
    const endDate = new Date(`${booking.date}T${booking.endTime}`);
    return {
      id: booking.id,
      title: facilityName,
      start: startDate,
      end: endDate,
      status: booking.status,
      resource: booking.status // Used for styling
    };
  });
};
// Custom event styling
const eventStyleGetter = event => {
  let style = {
    borderRadius: '4px',
    border: '1px solid',
    fontSize: '0.875rem',
    padding: '2px 4px'
  };
  // Apply different styles based on event status
  switch (event.resource) {
    case 'booked':
      return {
        style: {
          ...style,
          backgroundColor: '#FEE2E2',
          borderColor: '#FCA5A5',
          color: '#991B1B' // red-800
        }
      };
    case 'blocked':
      return {
        style: {
          ...style,
          backgroundColor: '#FEE2E2',
          borderColor: '#FCA5A5',
          color: '#991B1B' // red-800
        }
      };
    case 'released':
      return {
        style: {
          ...style,
          backgroundColor: '#FEF3C7',
          borderColor: '#FCD34D',
          color: '#92400E' // yellow-800
        }
      };
    case 'selected':
      return {
        style: {
          ...style,
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          color: '#FFFFFF' // white
        }
      };
    default:
      return {
        style: {
          ...style,
          backgroundColor: '#DCFCE7',
          borderColor: '#86EFAC',
          color: '#166534' // green-800
        }
      };
  }
};
interface CalendarBookingViewProps {
  facility: any;
  existingBookings: any[];
  onTimeBlockSelect: (startTime: string, endTime: string, duration: number) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}
const CalendarBookingView: React.FC<CalendarBookingViewProps> = ({
  facility,
  existingBookings,
  onTimeBlockSelect,
  selectedDate,
  onDateChange
}) => {
  // State for tracking the selected event (if any)
  const [selectedEvent, setSelectedEvent] = useState(null);
  // State for calendar view (day, week)
  const [view, setView] = useState(Views.WEEK);
  // Convert existing bookings to calendar events
  const events = useMemo(() => {
    const formattedEvents = formatBookingsToEvents(existingBookings, facility.name);
    // Add the selected event if it exists
    if (selectedEvent) {
      return [...formattedEvents, {
        ...selectedEvent,
        resource: 'selected'
      }];
    }
    return formattedEvents;
  }, [existingBookings, facility.name, selectedEvent]);
  // Handle slot selection (creating a new booking)
  const handleSelectSlot = useCallback(({
    start,
    end
  }) => {
    // Check if the slot overlaps with any existing events
    const isOverlapping = events.some(event => {
      return start < event.end && end > event.start && event.resource !== 'selected';
    });
    if (isOverlapping) {
      return; // Don't allow overlapping bookings
    }
    // Create a new selected event
    const newEvent = {
      id: 'new-selection',
      title: facility.name,
      start,
      end,
      resource: 'selected'
    };
    setSelectedEvent(newEvent);
    // Format times for parent component
    const startTime = moment(start).format('HH:mm');
    const endTime = moment(end).format('HH:mm');
    // Calculate duration in hours
    const durationHours = moment.duration(moment(end).diff(moment(start))).asHours();
    // Pass the selection to parent component
    onTimeBlockSelect(startTime, endTime, durationHours);
  }, [events, facility.name, onTimeBlockSelect]);
  // Handle event selection
  const handleSelectEvent = useCallback(event => {
    // Only allow selecting available events
    if (event.resource === 'available') {
      setSelectedEvent({
        ...event,
        resource: 'selected'
      });
      // Format times for parent component
      const startTime = moment(event.start).format('HH:mm');
      const endTime = moment(event.end).format('HH:mm');
      // Calculate duration in hours
      const durationHours = moment.duration(moment(event.end).diff(moment(event.start))).asHours();
      // Pass the selection to parent component
      onTimeBlockSelect(startTime, endTime, durationHours);
    }
  }, [onTimeBlockSelect]);
  // Handle resizing an event
  const handleResizeEvent = useCallback(({
    event,
    start,
    end
  }) => {
    // Only allow resizing the selected event
    if (event.resource === 'selected') {
      const updatedEvent = {
        ...event,
        start,
        end
      };
      setSelectedEvent(updatedEvent);
      // Format times for parent component
      const startTime = moment(start).format('HH:mm');
      const endTime = moment(end).format('HH:mm');
      // Calculate duration in hours
      const durationHours = moment.duration(moment(end).diff(moment(start))).asHours();
      // Pass the selection to parent component
      onTimeBlockSelect(startTime, endTime, durationHours);
    }
  }, [onTimeBlockSelect]);
  // Handle moving an event
  const handleMoveEvent = useCallback(({
    event,
    start,
    end
  }) => {
    // Only allow moving the selected event
    if (event.resource === 'selected') {
      // Check if the move would overlap with any existing events
      const isOverlapping = events.some(existingEvent => {
        return existingEvent.id !== event.id && existingEvent.resource !== 'selected' && start < existingEvent.end && end > existingEvent.start;
      });
      if (isOverlapping) {
        return; // Don't allow overlapping bookings
      }
      const updatedEvent = {
        ...event,
        start,
        end
      };
      setSelectedEvent(updatedEvent);
      // Format times for parent component
      const startTime = moment(start).format('HH:mm');
      const endTime = moment(end).format('HH:mm');
      // Calculate duration in hours
      const durationHours = moment.duration(moment(end).diff(moment(start))).asHours();
      // Pass the selection to parent component
      onTimeBlockSelect(startTime, endTime, durationHours);
    }
  }, [events, onTimeBlockSelect]);
  // Handle date change
  const handleNavigate = useCallback(date => {
    onDateChange(date);
  }, [onDateChange]);
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">
            {facility.name} - Availability Calendar
          </h3>
        </div>
        <div className="h-[600px]">
          <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" selectable resizable onSelectSlot={handleSelectSlot} onSelectEvent={handleSelectEvent} onEventResize={handleResizeEvent} onEventDrop={handleMoveEvent} defaultView={Views.WEEK} views={[Views.WEEK, Views.DAY]} step={15} timeslots={4} date={selectedDate} onNavigate={handleNavigate} onView={setView} view={view} eventPropGetter={eventStyleGetter} components={{
          toolbar: CustomToolbar
        }} min={new Date(new Date().setHours(8, 0, 0))} max={new Date(new Date().setHours(22, 0, 0))} formats={{
          timeGutterFormat: 'h A',
          eventTimeRangeFormat: ({
            start,
            end
          }, culture, localizer) => `${localizer.format(start, 'h:mm A', culture)} - ${localizer.format(end, 'h:mm A', culture)}`
        }} />
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
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs text-gray-600">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs text-gray-600">Released</span>
          </div>
        </div>
      </div>
    </div>;
};
export default CalendarBookingView;