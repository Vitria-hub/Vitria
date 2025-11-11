'use client';

import { useState } from 'react';
import Button from './Button';
import Textarea from './Textarea';
import RatingStars from './RatingStars';
import { trpc } from '@/lib/trpc';

export default function ReviewForm({ agencyId }: { agencyId: string }) {
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
    if (rating === 0) {
      alert('Por favor selecciona una calificación');
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

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
      <h3 className="font-bold text-lg">Deja tu reseña</h3>

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

      <Button type="submit" disabled={createReview.isPending || rating === 0}>
        {createReview.isPending ? 'Enviando...' : 'Enviar Reseña'}
      </Button>
    </form>
  );
}
