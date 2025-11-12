import { z } from 'zod';

export const agencyListSchema = z.object({
  q: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  service: z.string().optional(),
  category: z.string().optional(),
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
  // Paso 1: Información Básica
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  logo_url: z.string().url('URL de logo inválida').optional().or(z.literal('')),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  whatsappNumber: z.string().min(8, 'Número de WhatsApp inválido').optional().or(z.literal('')),
  city: z.string().min(2, 'Ciudad requerida'),
  region: z.string().min(1, 'Región requerida'),
  
  // Paso 2: Servicios y Categoría
  services: z.array(z.string()).min(1, 'Selecciona al menos un servicio'),
  categories: z.array(z.string()).min(1, 'Selecciona al menos una categoría'),
  specialties: z.array(z.string()).optional(),
  
  // Paso 3: Detalles del Negocio
  employeesMin: z.number().min(1).optional(),
  employeesMax: z.number().min(1).optional(),
  priceRange: z.enum(['$', '$$', '$$$']),
  industries: z.array(z.string()).optional(),
});

export const createClientProfileSchema = z.object({
  businessName: z.string().min(2, 'El nombre del negocio debe tener al menos 2 caracteres'),
  businessInstagram: z.string().optional(),
  budgetRange: z.enum(['$', '$$', '$$$'], {
    required_error: 'Selecciona un rango de presupuesto'
  }),
  desiredCategories: z.array(z.string()).min(1, 'Selecciona al menos una categoría de servicio que buscas'),
  aboutBusiness: z.string().min(20, 'Cuéntanos un poco más sobre tu negocio (mínimo 20 caracteres)').optional(),
});

export const trackAgencyContactSchema = z.object({
  agencyId: z.string().uuid(),
  contactMethod: z.enum(['email', 'phone', 'website', 'form']),
  message: z.string().optional(),
});
