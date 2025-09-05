import { z } from 'zod';

export const resumeOnlySchema = z.object({
  content: z.string().min(10, 'Resume content too short').max(50000, 'Resume content too long')
});

export const jobOnlySchema = z.object({
  content: z.string().min(10, 'Job description too short').max(20000, 'Job description too long')
});

export const bothSchema = z.object({
  resume: z.object({
    content: z.string().min(10, 'Resume content too short').max(50000, 'Resume content too long')
  }),
  jobDescription: z.object({
    content: z.string().min(10, 'Job description too short').max(20000, 'Job description too long')
  })
});