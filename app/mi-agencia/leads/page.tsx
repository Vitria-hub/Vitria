'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/useAuth';
import { User, Briefcase, DollarSign, MessageSquare, Calendar, Mail, Phone, Globe, FileText } from 'lucide-react';

export default function AgencyLeadsPage() {
  const { userData } = useAuth();
  const [page, setPage] = useState(1);

  const { data: agency } = trpc.agency.myAgency.useQuery(undefined, {
    enabled: !!userData,
  });

  const { data: leadsData, isLoading } = trpc.contact.listForAgency.useQuery(
    {
      agencyId: agency?.id || '',
      page,
      limit: 20,
    },
    {
      enabled: !!agency?.id,
    }
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8">Leads Recibidos</h1>
        <div className="text-center py-12">
          <p className="text-dark/60">Cargando leads...</p>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8">Leads Recibidos</h1>
        <div className="text-center py-12">
          <p className="text-dark/60">No tienes una agencia registrada.</p>
        </div>
      </div>
    );
  }

  const contactMethodIcons = {
    email: Mail,
    phone: Phone,
    website: Globe,
    form: FileText,
  };

  const contactMethodLabels = {
    email: 'Email',
    phone: 'Teléfono',
    website: 'Sitio Web',
    form: 'Formulario',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Leads Recibidos</h1>
        <p className="text-dark/60">
          Clientes potenciales que han contactado a tu agencia
        </p>
      </div>

      <div className="mb-6 bg-white rounded-lg border-2 border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-dark/60 mb-1">Total de Leads</p>
            <p className="text-3xl font-bold text-primary">
              {leadsData?.total || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-dark/60 mb-1">Leads este Mes</p>
            <p className="text-3xl font-bold text-accent">
              {leadsData?.contacts?.filter((c: any) => {
                const contactDate = new Date(c.created_at);
                const now = new Date();
                return (
                  contactDate.getMonth() === now.getMonth() &&
                  contactDate.getFullYear() === now.getFullYear()
                );
              }).length || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-dark/60 mb-1">Método Preferido</p>
            <p className="text-xl font-bold text-dark">
              {leadsData?.contacts && leadsData.contacts.length > 0
                ? contactMethodLabels[
                    Object.entries(
                      leadsData.contacts.reduce((acc: any, c: any) => {
                        acc[c.contact_method] = (acc[c.contact_method] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort((a: any, b: any) => b[1] - a[1])[0][0] as keyof typeof contactMethodLabels
                  ]
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {!leadsData?.contacts || leadsData.contacts.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-lilac/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-dark mb-2">Aún no tienes leads</h3>
          <p className="text-dark/60 max-w-md mx-auto">
            Cuando los clientes contacten tu agencia, aparecerán aquí con toda su información.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leadsData.contacts.map((contact: any) => {
            const MethodIcon = contactMethodIcons[contact.contact_method as keyof typeof contactMethodIcons];
            
            return (
              <div
                key={contact.id}
                className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-primary transition"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-dark">
                            {contact.client?.full_name || 'Cliente'}
                          </h3>
                          <p className="text-sm text-dark/60">{contact.client?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-dark/60">
                        <Calendar className="w-4 h-4" />
                        {new Date(contact.created_at).toLocaleDateString('es-CL', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {contact.business_name && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-xs text-dark/60">Negocio</p>
                            <p className="font-semibold text-dark">{contact.business_name}</p>
                          </div>
                        </div>
                      )}
                      
                      {contact.budget_range && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-xs text-dark/60">Presupuesto</p>
                            <p className="font-semibold text-dark">{contact.budget_range}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <MethodIcon className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-xs text-dark/60">Método de Contacto</p>
                          <p className="font-semibold text-dark">
                            {contactMethodLabels[contact.contact_method as keyof typeof contactMethodLabels]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {contact.desired_categories && contact.desired_categories.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-dark/60 mb-2">Busca servicios de:</p>
                        <div className="flex flex-wrap gap-2">
                          {contact.desired_categories.map((category: string) => (
                            <span
                              key={category}
                              className="px-3 py-1 bg-lilac/20 text-primary rounded-full text-sm font-medium"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {contact.message && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-xs font-semibold text-dark/60">Mensaje:</p>
                        </div>
                        <p className="text-dark/80 text-sm leading-relaxed pl-6">
                          {contact.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {leadsData.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-medium text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition"
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: leadsData.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      pageNum === page
                        ? 'bg-primary text-white'
                        : 'bg-white border-2 border-gray-200 text-dark hover:border-primary'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === leadsData.totalPages}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-medium text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
