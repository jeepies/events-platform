import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1).max(256),
  description: z.string().min(8).max(1024),
  time_range: z.object({
    from: z.date(),
    to: z.date(),
  }),
  location: z.string().min(1),
});

export const updateEventSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  description: z.string().min(8).max(1024).optional(),
  time_range: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
  location: z.string().min(1).optional(),
  id: z.string(),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;
export type UpdateEventSchema = z.infer<typeof updateEventSchema>;
