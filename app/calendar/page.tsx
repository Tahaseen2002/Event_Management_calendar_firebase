'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Calendar from '@/components/Calendar';
import { EventList } from '@/components/EventList';

export default function CalendarPage() {
  const [selectedDateForList, setSelectedDateForList] = useState<Date>(new Date());

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Calendar />
            </div>
            <div className="lg:col-span-1">
              <EventList date={selectedDateForList} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}