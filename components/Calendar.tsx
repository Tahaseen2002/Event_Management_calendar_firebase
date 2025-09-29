'use client';

import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useEvents } from '@/contexts/EventContext';
import { EventModal } from './EventModal';
import { EventList } from './EventList';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getEventsForDate } = useEvents();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayEvents = getEventsForDate(cloneDay);
      
      days.push(
        <div
          key={day.toString()}
          className={`
            min-h-[120px] p-2 border border-gray-200 cursor-pointer transition-colors duration-200
            hover:bg-blue-50 relative group
            ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : 'bg-white'}
            ${isSameDay(day, selectedDate!) ? 'bg-blue-100 border-blue-300' : ''}
            ${isToday(day) ? 'bg-yellow-50 border-yellow-300' : ''}
          `}
          onClick={() => {
            setSelectedDate(cloneDay);
            setIsModalOpen(true);
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`
              text-sm font-medium
              ${!isSameMonth(day, monthStart) ? 'text-gray-400' : 'text-gray-700'}
              ${isToday(day) ? 'text-blue-600 font-bold' : ''}
            `}>
              {format(day, dateFormat)}
            </span>
            <Plus className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-2 py-1 rounded truncate font-medium text-white`}
                style={{ backgroundColor: event.color }}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 px-2">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-gray-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="px-4 py-3 text-sm font-semibold text-gray-600 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="divide-y divide-gray-200">
        {rows}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}