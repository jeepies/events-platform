import { Attendee, Event, Prisma } from '@prisma/client';
import { prisma } from '../database.server';

export async function getEventByID(id: string): Promise<Event | null> {
  return await prisma.event.findFirst({
    where: {
      id: id,
    },
  });
}

export async function getAttendeesForEventID(id: string): Promise<Attendee[]> {
  return await prisma.attendee.findMany({
    where: {
      eventId: id,
    },
  });
}

export async function getEventsForUserFromID(id: string, overload?: { hide_past: boolean, take: number }): Promise<Prisma.AttendeeGetPayload<{ include: { event: true }}>[]> {
  return await prisma.attendee.findMany({
    where: {
      userId: id,
    },
    include: {
      event: true,
    },
    take: overload?.take ?? 5,
  });
}

export async function getAttendeeCountForEventID(id: string): Promise<any> {
  return await prisma.attendee.count({
    where: {
      eventId: id
    },
  })
}