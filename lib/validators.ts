import { z } from 'zod';

export const agencyListSchema = z.object({
  q: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  service: z.string().optional(),
  sizeMin: z.number().optional(),
  sizeMax: z.number().optional(),
  priceRange: z.enum(['$', '$$', '$$$']).optional(),
  sort: z.enum(['rating', 'reviews', 'premium', 'recent']).default('premium'),
  page: z.number().default(1),
  limit: z.number().default(12),
});

export const agencyBySlugSchema = z.object({
  slug: z.string(),
});

export const createReviewSchema = z.object({
  agencyId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const trackMetricSchema = z.object({
  agencyId: z.string().uuid(),
  event: z.enum(['view', 'profile_click', 'contact_click', 'lead']),
});

export const createCheckoutSchema = z.object({
  plan: z.enum(['premium']),
  agencyId: z.string().uuid(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  agencyId: z.string().uuid(),
});

export const createAgencySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
});
