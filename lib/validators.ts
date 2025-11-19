import { z } from 'zod';

// Validador flexible para URLs opcionales - acepta con o sin https://, con o sin www.
const optionalUrlSchema = z.preprocess(
  (val) => {
    // Si es undefined, null, o string vacío, retornar undefined
    if (!val || (typeof val === 'string' && val.trim() === '')) {
      return undefined;
    }
    
    // Si es un string, normalizarlo
    if (typeof val === 'string') {
      let normalized = val.trim();
      
      // Si no tiene protocolo, agregar https://
      if (!normalized.match(/^https?:\/\//i)) {
        normalized = 'https://' + normalized;
      }
      
      return normalized;
    }
    
    return val;
  },
  z.string().url({ message: 'URL inválida. Ejemplos válidos: vitria.cl, www.vitria.cl, https://vitria.cl' }).optional()
);

export const agencyListSchema = z.object({
  q: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  service: z.string().optional(),
  category: z.string().optional(),
  sizeMin: z.number().optional(),
  sizeMax: z.number().optional(),
  priceRange: z.enum(['1-3M', '3-5M', '5M+']).optional(),
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
  logo_url: optionalUrlSchema,
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  website: optionalUrlSchema,
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  whatsappNumber: z.string().optional().refine(
    (val) => !val || val === '' || val.length >= 8,
    { message: 'Número de WhatsApp inválido' }
  ),
  city: z.string().min(2, 'Ciudad requerida'),
  region: z.string().min(1, 'Región requerida'),
  
  // Paso 2: Servicios y Categoría
  services: z.array(z.string()).optional(),
  categories: z.array(z.string()).min(1, 'Selecciona al menos una categoría'),
  specialties: z.array(z.string()).optional(),
  
  // Paso 3: Detalles del Negocio
  employeesMin: z.number().min(1).optional(),
  employeesMax: z.number().min(1).optional(),
  priceRange: z.enum(['1-3M', '3-5M', '5M+']),
  industries: z.array(z.string()).optional(),
});

export const createClientProfileSchema = z.object({
  businessName: z.string().min(2, 'El nombre del negocio debe tener al menos 2 caracteres'),
  businessInstagram: z.string().optional(),
  budgetRange: z.enum(['1-3M', '3-5M', '5M+'], {
    required_error: 'Selecciona un rango de presupuesto'
  }),
  desiredCategories: z.array(z.string()).min(1, 'Selecciona al menos una categoría de servicio que buscas'),
  aboutBusiness: z.string().optional(),
});

export const trackAgencyContactSchema = z.object({
  agencyId: z.string().uuid(),
  contactMethod: z.enum(['email', 'phone', 'website', 'form']),
  message: z.string().optional(),
});

export const approveAgencySchema = z.object({
  agencyId: z.string().uuid(),
});

export const rejectAgencySchema = z.object({
  agencyId: z.string().uuid(),
  rejectionReason: z.string().min(10, 'La razón del rechazo debe tener al menos 10 caracteres'),
});

export const updateAgencySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  logo_url: optionalUrlSchema,
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres').optional(),
  website: optionalUrlSchema,
  email: z.string().email('Email inválido').optional(),
  phone: z.string().min(8, 'Teléfono inválido').optional(),
  whatsappNumber: z.string().optional().refine(
    (val) => !val || val === '' || val.length >= 8,
    { message: 'Número de WhatsApp inválido' }
  ),
  city: z.string().min(2, 'Ciudad requerida').optional(),
  region: z.string().min(1, 'Región requerida').optional(),
  services: z.array(z.string()).optional(),
  categories: z.array(z.string()).min(1, 'Selecciona al menos una categoría').optional(),
  specialties: z.array(z.string()).optional(),
  employeesMin: z.number().min(1).optional(),
  employeesMax: z.number().min(1).optional(),
  priceRange: z.enum(['1-3M', '3-5M', '5M+']).optional(),
  industries: z.array(z.string()).optional(),
});

export const adminCreateReviewSchema = z.object({
  agencyId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
  authorName: z.string().min(2, 'El nombre del autor debe tener al menos 2 caracteres'),
});
