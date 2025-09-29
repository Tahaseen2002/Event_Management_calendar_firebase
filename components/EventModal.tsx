'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEvents } from '@/contexts/EventContext';

const eventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  time: z.string().min(1, 'Time is required'),
  color: z.string().min(1, 'Color is required'),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

const eventColors = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
];

export function EventModal({ isOpen, onClose, selectedDate }: EventModalProps) {
  const { addEvent } = useEvents();
  const [selectedColor, setSelectedColor] = useState(eventColors[0].value);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      color: eventColors[0].value,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    if (!selectedDate) return;

    addEvent({
      title: data.title,
      description: data.description || '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: data.time,
      color: selectedColor,
    });

    reset();
    setSelectedColor(eventColors[0].value);
    onClose();
  };

  const handleClose = () => {
    reset();
    setSelectedColor(eventColors[0].value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            {selectedDate && `Create an event for ${format(selectedDate, 'EEEE, MMMM d, yyyy')}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Input
              id="time"
              type="time"
              {...register('time')}
            />
            {errors.time && (
              <p className="text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter event description (optional)"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Event Color *</Label>
            <div className="flex space-x-2">
              {eventColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}