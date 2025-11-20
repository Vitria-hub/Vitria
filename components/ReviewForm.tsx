'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from './Button';
import Textarea from './Textarea';
import RatingStars from './RatingStars';
import { trpc } from '@/lib/trpc';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function ReviewForm({ agencyId }: { agencyId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const createReview = trpc.review.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setRating(0);
      setComment('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (rating === 0) {
      toast.warning('Por favor selecciona una calificación');
      return;
    }
    createReview.mutate({ agencyId, rating, comment: comment || undefined });
  };

  if (submitted) {
    return (
      <div className="bg-mint/20 border-2 border-mint rounded-lg p-6 text-center">
        <p className="text-dark font-semibold">¡Gracias por tu reseña!</p>
        <p className="text-sm text-dark/70 mt-2">
          Tu reseña está pendiente de aprobación y será visible pronto.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="font-bold text-lg">Deja tu reseña</h3>
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-dark/80 mb-2">
              Para dejar una reseña, necesitas tener una cuenta.
            </p>
            <p className="text-sm text-dark/60">
              Esto nos ayuda a mantener reseñas auténticas y verificadas.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push('/auth/login')} variant="primary" className="flex-1">
            Iniciar Sesión
          </Button>
          <Button onClick={() => router.push('/auth/registro')} variant="accent" className="flex-1">
            Crear Cuenta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
      <h3 className="font-bold text-lg">Deja tu reseña</h3>
      
      {createReview.error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            {createReview.error.message}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-dark mb-2">Calificación</label>
        <RatingStars rating={rating} interactive onRate={setRating} size="lg" />
      </div>

      <Textarea
        label="Comentario (opcional)"
        placeholder="Cuéntanos sobre tu experiencia..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />

      <Button type="submit" loading={createReview.isPending} disabled={rating === 0}>
        Enviar Reseña
      </Button>
    </form>
  );
}
