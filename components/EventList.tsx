'use client';

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock } from 'lucide-react';
import { useEvents, Event } from '@/contexts/EventContext';

interface EventListProps {
  date: Date;
}

export function EventList({ date }: EventListProps) {
  const { getEventsForDate, deleteEvent } = useEvents();
  const events = getEventsForDate(date);

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Events for {format(date, 'EEEE, MMMM d')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No events scheduled for this date
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Events for {format(date, 'EEEE, MMMM d')} ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event: Event) => (
            <div
              key={event.id}
              className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {event.time}
                </div>
                {event.description && (
                  <p className="text-sm text-gray-600">{event.description}</p>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteEvent(event.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}