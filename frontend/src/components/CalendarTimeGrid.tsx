import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
// Time constants
const START_HOUR = 8; // 8 AM
const END_HOUR = 22; // 10 PM
const MINUTES_PER_SLOT = 15;
const SLOTS_PER_HOUR = 60 / MINUTES_PER_SLOT;
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * SLOTS_PER_HOUR;
// Helper functions
const formatTime = (hour, minute) => {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${h}:${m} ${period}`;
};
const formatDuration = durationMinutes => {
  if (durationMinutes < 60) {
    return `${durationMinutes} min`;
  }
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `${hours}h ${minutes}m`;
};
const getTimeFromSlot = slotIndex => {
  const totalMinutes = START_HOUR * 60 + slotIndex * MINUTES_PER_SLOT;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return {
    hour,
    minute
  };
};
const getDateString = date => {
  return date.toISOString().split('T')[0];
};
// Types for TypeScript
interface TimeBlock {
  id: string;
  startSlot: number;
  endSlot: number;
  status: 'available' | 'booked' | 'blocked' | 'selected' | 'creating' | 'resizing';
}
interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}
interface CalendarTimeGridProps {
  facility: any;
  existingBookings: Booking[];
  onTimeBlockSelect: (startTime: string, endTime: string, duration: number) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}
const CalendarTimeGrid: React.FC<CalendarTimeGridProps> = ({
  facility,
  existingBookings,
  onTimeBlockSelect,
  selectedDate,
  onDateChange
}) => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeBlock, setActiveBlock] = useState<TimeBlock | null>(null);
  const [startY, setStartY] = useState(0);
  const [startSlot, setStartSlot] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  // Generate days for the week view
  const generateWeekDays = () => {
    const days = [];
    const currentDay = new Date(selectedDate);
    currentDay.setDate(currentDay.getDate() - currentDay.getDay()); // Start with Sunday
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDay);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };
  const weekDays = generateWeekDays();
  // Convert existing bookings to time blocks
  useEffect(() => {
    const selectedDateStr = getDateString(selectedDate);
    // Filter bookings for the selected date
    const bookingsForDate = existingBookings.filter(booking => booking.date === selectedDateStr);
    // Convert bookings to time blocks
    const blocks = bookingsForDate.map(booking => {
      const [startHour, startMinute] = booking.startTime.split(':').map(Number);
      const [endHour, endMinute] = booking.endTime.split(':').map(Number);
      const startSlot = (startHour - START_HOUR) * SLOTS_PER_HOUR + startMinute / MINUTES_PER_SLOT;
      const endSlot = (endHour - START_HOUR) * SLOTS_PER_HOUR + endMinute / MINUTES_PER_SLOT;
      return {
        id: booking.id,
        startSlot,
        endSlot,
        status: booking.status as any
      };
    });
    setTimeBlocks(blocks);
  }, [existingBookings, selectedDate]);
  // Get the slot index from a Y position
  const getSlotFromY = (y: number) => {
    if (!gridRef.current) return 0;
    const gridRect = gridRef.current.getBoundingClientRect();
    const relativeY = y - gridRect.top;
    const slotHeight = gridRect.height / TOTAL_SLOTS;
    let slot = Math.floor(relativeY / slotHeight);
    // Ensure slot is within bounds
    slot = Math.max(0, Math.min(slot, TOTAL_SLOTS - 1));
    return slot;
  };
  // Handle mouse down on the grid
  const handleGridMouseDown = (e: React.MouseEvent) => {
    if (isCreating || isResizing || isDragging) return;
    const slot = getSlotFromY(e.clientY);
    // Check if the slot is already occupied
    const isOccupied = timeBlocks.some(block => slot >= block.startSlot && slot < block.endSlot);
    if (isOccupied) return;
    // Create a new block that's 1 hour long by default
    const newBlock: TimeBlock = {
      id: `new-${Date.now()}`,
      startSlot: slot,
      endSlot: Math.min(slot + SLOTS_PER_HOUR, TOTAL_SLOTS),
      status: 'creating'
    };
    setActiveBlock(newBlock);
    setTimeBlocks([...timeBlocks, newBlock]);
    setIsCreating(true);
    setStartY(e.clientY);
    setStartSlot(slot);
  };
  // Handle mouse down on a block
  const handleBlockMouseDown = (e: React.MouseEvent, block: TimeBlock) => {
    e.stopPropagation();
    // Only allow interaction with blocks that are 'creating', 'selected', or 'available'
    if (!['creating', 'selected', 'available'].includes(block.status)) return;
    // Check if click is near the bottom edge (for resizing)
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const isNearBottom = e.clientY > rect.bottom - 10;
    if (isNearBottom) {
      // Start resizing
      setIsResizing(true);
      setActiveBlock(block);
      setStartY(e.clientY);
      setStartSlot(block.endSlot);
    } else {
      // Start dragging
      setIsDragging(true);
      setActiveBlock(block);
      setStartY(e.clientY);
      setStartSlot(block.startSlot);
    }
  };
  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeBlock) return;
    const currentSlot = getSlotFromY(e.clientY);
    if (isResizing) {
      // Resizing logic
      const newEndSlot = Math.max(activeBlock.startSlot + 1, currentSlot);
      // Check if new size overlaps with other blocks
      const wouldOverlap = timeBlocks.some(block => block.id !== activeBlock.id && newEndSlot > block.startSlot && activeBlock.startSlot < block.endSlot);
      if (!wouldOverlap) {
        const updatedBlocks = timeBlocks.map(block => block.id === activeBlock.id ? {
          ...block,
          endSlot: newEndSlot,
          status: 'resizing'
        } : block);
        setTimeBlocks(updatedBlocks);
      }
    } else if (isDragging) {
      // Dragging logic
      const slotDiff = currentSlot - startSlot;
      const newStartSlot = Math.max(0, activeBlock.startSlot + slotDiff);
      const newEndSlot = Math.min(TOTAL_SLOTS, activeBlock.endSlot + slotDiff);
      const blockDuration = activeBlock.endSlot - activeBlock.startSlot;
      // Ensure we don't go out of bounds
      if (newStartSlot < 0 || newEndSlot > TOTAL_SLOTS) return;
      // Check if new position overlaps with other blocks
      const wouldOverlap = timeBlocks.some(block => block.id !== activeBlock.id && newEndSlot > block.startSlot && newStartSlot < block.endSlot);
      if (!wouldOverlap) {
        const updatedBlocks = timeBlocks.map(block => block.id === activeBlock.id ? {
          ...block,
          startSlot: newStartSlot,
          endSlot: newStartSlot + blockDuration,
          status: 'resizing'
        } : block);
        setTimeBlocks(updatedBlocks);
        setStartSlot(currentSlot);
      }
    }
  };
  // Handle mouse up
  const handleMouseUp = () => {
    if (activeBlock) {
      // Finalize the block
      const finalBlock = timeBlocks.find(block => block.id === activeBlock.id);
      if (finalBlock) {
        // Convert slots to time strings
        const startTime = getTimeFromSlot(finalBlock.startSlot);
        const endTime = getTimeFromSlot(finalBlock.endSlot);
        const startTimeStr = `${startTime.hour.toString().padStart(2, '0')}:${startTime.minute.toString().padStart(2, '0')}`;
        const endTimeStr = `${endTime.hour.toString().padStart(2, '0')}:${endTime.minute.toString().padStart(2, '0')}`;
        // Calculate duration in minutes
        const durationMinutes = (finalBlock.endSlot - finalBlock.startSlot) * MINUTES_PER_SLOT;
        // Update the block status to 'selected'
        const updatedBlocks = timeBlocks.map(block => block.id === activeBlock.id ? {
          ...block,
          status: 'selected'
        } : block);
        setTimeBlocks(updatedBlocks);
        // Notify parent component
        onTimeBlockSelect(startTimeStr, endTimeStr, durationMinutes / 60);
      }
    }
    // Reset state
    setIsCreating(false);
    setIsResizing(false);
    setIsDragging(false);
    setActiveBlock(null);
  };
  // Handle date selection
  const handleDateClick = (date: Date) => {
    onDateChange(date);
  };
  // Navigate to previous/next week
  const navigateToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };
  const navigateToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };
  // Generate time labels
  const timeLabels = Array.from({
    length: END_HOUR - START_HOUR + 1
  }, (_, i) => {
    const hour = START_HOUR + i;
    return formatTime(hour, 0);
  });
  // Check if a date is the selected date
  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };
  // Format date for display
  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  // Format day for display
  const formatDayDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short'
    });
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {facility.name} - Availability Calendar
          </h3>
          <div className="flex space-x-2">
            <button onClick={navigateToPreviousWeek} className="p-2 rounded-md hover:bg-gray-100">
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="text-sm font-medium text-gray-700">
              {formatDateDisplay(weekDays[0])} -{' '}
              {formatDateDisplay(weekDays[6])}
            </div>
            <button onClick={navigateToNextWeek} className="p-2 rounded-md hover:bg-gray-100">
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        {/* Days of week */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="text-xs text-gray-500 font-medium"></div>
          {weekDays.map((day, index) => <button key={index} onClick={() => handleDateClick(day)} className={`text-center py-2 ${isSelectedDate(day) ? 'bg-blue-100 text-blue-800 rounded-md' : 'hover:bg-gray-50 text-gray-700'}`}>
              <div className="text-xs font-medium">{formatDayDisplay(day)}</div>
              <div className="text-sm font-bold">{day.getDate()}</div>
            </button>)}
        </div>
        {/* Time grid */}
        <div className="relative grid grid-cols-8 gap-1 h-[600px] overflow-y-auto">
          {/* Time labels */}
          <div className="text-xs text-gray-500 space-y-6 pr-2 text-right">
            {timeLabels.map((label, index) => <div key={index} className="h-6">
                {label}
              </div>)}
          </div>
          {/* Day column */}
          <div ref={gridRef} className="col-span-7 relative bg-gray-50 rounded-md" onMouseDown={handleGridMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {/* Time grid lines */}
            {Array.from({
            length: (END_HOUR - START_HOUR) * 4 + 1
          }, (_, i) => <div key={i} className={`absolute left-0 right-0 border-t border-gray-200 ${i % 4 === 0 ? 'border-gray-300' : ''}`} style={{
            top: `${i / ((END_HOUR - START_HOUR) * 4) * 100}%`
          }}></div>)}
            {/* Time blocks */}
            {timeBlocks.map(block => {
            const startTime = getTimeFromSlot(block.startSlot);
            const endTime = getTimeFromSlot(block.endSlot);
            const durationMinutes = (block.endSlot - block.startSlot) * MINUTES_PER_SLOT;
            // Status-based styling
            let blockClass = '';
            if (block.status === 'booked' || block.status === 'blocked') {
              blockClass = 'bg-red-100 text-red-800 cursor-not-allowed';
            } else if (block.status === 'available') {
              blockClass = 'bg-green-100 text-green-800 cursor-pointer hover:bg-green-200';
            } else if (block.status === 'selected' || block.status === 'creating' || block.status === 'resizing') {
              blockClass = 'bg-blue-500 text-white cursor-pointer';
            }
            return <div key={block.id} className={`absolute left-0 right-0 rounded-md border ${blockClass}`} style={{
              top: `${block.startSlot / TOTAL_SLOTS * 100}%`,
              height: `${(block.endSlot - block.startSlot) / TOTAL_SLOTS * 100}%`
            }} onMouseDown={e => handleBlockMouseDown(e, block)}>
                  <div className="p-1 text-xs font-medium">
                    <div>
                      {formatTime(startTime.hour, startTime.minute)} -{' '}
                      {formatTime(endTime.hour, endTime.minute)}
                    </div>
                    <div>{formatDuration(durationMinutes)}</div>
                  </div>
                  {block.status === 'resizing' && <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-400 cursor-ns-resize"></div>}
                </div>;
          })}
          </div>
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
        </div>
      </div>
    </div>;
};
export default CalendarTimeGrid;