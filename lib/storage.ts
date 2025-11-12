import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

const AGENCY_LOGOS_BUCKET = 'agency-logos';

export async function uploadAgencyLogo(file: File, agencySlug: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${agencySlug}-${Date.now()}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { data, error } = await supabaseClient.storage
    .from(AGENCY_LOGOS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }

  const { data: { publicUrl } } = supabaseClient.storage
    .from(AGENCY_LOGOS_BUCKET)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteAgencyLogo(logoUrl: string): Promise<void> {
  const path = logoUrl.split('/').slice(-2).join('/');
  
  const { error } = await supabaseClient.storage
    .from(AGENCY_LOGOS_BUCKET)
    .remove([path]);

  if (error) {
    console.error('Error deleting logo:', error);
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Solo se permiten imágenes en formato JPG, PNG o WebP'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'La imagen no debe superar los 5MB'
    };
  }

  return { valid: true };
}
