'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from './AuthContext';

export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  color: string;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'userId'>) => void;
  getEventsForDate: (date: Date) => Event[];
  deleteEvent: (id: string) => void;
}

const EventContext = createContext<EventContextType>({
  events: [],
  addEvent: () => {},
  getEventsForDate: () => [],
  deleteEvent: () => {},
});

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider = ({ children }: EventProviderProps) => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const { user } = useAuth();

  // Filter events for current user
  const events = allEvents.filter(event => event.userId === user?.uid);

  // Load events from localStorage when user changes
  useEffect(() => {
    if (user?.uid) {
      const savedEvents = localStorage.getItem(`events_${user.uid}`);
      if (savedEvents) {
        try {
          const userEvents = JSON.parse(savedEvents);
          setAllEvents(prev => {
            // Remove old events for this user and add the loaded ones
            const otherUsersEvents = prev.filter(event => event.userId !== user.uid);
            return [...otherUsersEvents, ...userEvents];
          });
        } catch (error) {
          console.error('Error loading events from localStorage:', error);
        }
      }
    }
  }, [user?.uid]);

  // Save events to localStorage when events change
  useEffect(() => {
    if (user?.uid && events.length >= 0) {
      localStorage.setItem(`events_${user.uid}`, JSON.stringify(events));
    }
  }, [events, user?.uid]);

  const addEvent = (event: Omit<Event, 'id' | 'userId'>) => {
    if (!user?.uid) return;
    
    const newEvent: Event = {
      ...event,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
    };
    setAllEvents(prev => [...prev, newEvent]);
  };

  const getEventsForDate = (date: Date): Event[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateString);
  };

  const deleteEvent = (id: string) => {
    setAllEvents(prev => prev.filter(event => event.id !== id));
  };

  // Clear events when user logs out
  useEffect(() => {
    if (!user) {
      setAllEvents([]);
    }
  }, [user]);

  const value = {
    events,
    addEvent,
    getEventsForDate,
    deleteEvent,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};