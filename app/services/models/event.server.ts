import { Event } from '@prisma/client';
import { prisma } from '../database.server';

export async function createEvent(
  event: { title: string; description: string; location: string },
  time_range: { from: Date; to: Date }
): Promise<Event> {
  return await prisma.event.create({
    data: {
      title: event.title,
      description: event.description,
      location: event.location,
      start_time: time_range.from,
      end_time: time_range.to,
    },
  });
}
