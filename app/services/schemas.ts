import { z } from 'zod';

export const createEventSchema = z
  .object({
    title: z.string().min(1).max(256),
    description: z.string().min(8).max(1024),
    time_range: z.object({
      from: z.date(),
      to: z.date(),
    }),
    location: z.string().min(1),
  })

export type CreateEventSchema = z.infer<typeof createEventSchema>;
