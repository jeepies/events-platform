import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1).max(256),
  description: z.string().min(8).max(1024),
  start_time: z.string(),
  end_time: z.string(),
  location: z.string().min(1),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;
