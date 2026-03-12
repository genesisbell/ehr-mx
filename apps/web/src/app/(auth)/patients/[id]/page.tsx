'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Role } from '@ehr-mx/shared';
import { usePatient, useUpdatePatient } from '@/lib/queries/patients';
import { PatientForm } from '@/components/patient-form';
import { useTranslations } from '@/i18n/use-translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations('patients');
  const tg = useTranslations('general');

  const { data: patient, isLoading } = usePatient(id);
  const updateMutation = useUpdatePatient(id);

  const [isEditing, setIsEditing] = useState(false);

  const role = session?.role;
  const canEdit = role === Role.DOCTOR;
  const isProvisional = patient?.status === 'PROVISIONAL';

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await updateMutation.mutateAsync(data as never);
      toast.success(t.updated);
      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.duplicateCurp;
      toast.error(message);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">{tg.loading}</p>;
  }

  if (!patient) {
    return <p className="text-muted-foreground">{t.notFound}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="ghost" size="sm">
            &larr; {tg.back}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t.patientDetails}</h1>
        <Badge variant={isProvisional ? 'secondary' : 'default'}>
          {isProvisional ? t.provisional : t.complete}
        </Badge>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {isProvisional ? t.completePatient : t.editPatient}
          </h2>
          <PatientForm
            mode="edit"
            defaultValues={{
              name: patient.name,
              paternalSurname: patient.paternalSurname,
              maternalSurname: patient.maternalSurname ?? undefined,
              phone: patient.phone ?? undefined,
              curp: patient.curp ?? undefined,
              birthDate: patient.birthDate
                ? new Date(patient.birthDate).toISOString().split('T')[0]
                : undefined,
              sex: (patient.sex as 'M' | 'F') ?? undefined,
            }}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
          />
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            {tg.cancel}
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.patientDetails}</CardTitle>
            {canEdit && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                {isProvisional ? t.completePatient : tg.edit}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label={tg.name} value={patient.name} />
              <Field label={t.paternalSurname} value={patient.paternalSurname} />
              <Field
                label={t.maternalSurname}
                value={patient.maternalSurname}
              />
              <Field label={t.phone} value={patient.phone} />
              <Field label={t.curp} value={patient.curp} mono />
              <Field
                label={t.birthDate}
                value={
                  patient.birthDate
                    ? new Date(patient.birthDate).toLocaleDateString('es-MX')
                    : null
                }
              />
              <Field
                label={t.sex}
                value={
                  patient.sex === 'M'
                    ? t.male
                    : patient.sex === 'F'
                      ? t.female
                      : null
                }
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <Field
                label={tg.createdAt}
                value={new Date(patient.createdAt).toLocaleString('es-MX')}
              />
              <Field
                label={tg.updatedAt}
                value={new Date(patient.updatedAt).toLocaleString('es-MX')}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={mono ? 'font-mono' : ''}>{value ?? '—'}</p>
    </div>
  );
}
