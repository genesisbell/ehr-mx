'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Role } from '@ehr-mx/shared';
import { PatientForm } from '@/components/patient-form';
import {
  useCreatePatient,
  useCreateProvisionalPatient,
} from '@/lib/queries/patients';
import { useTranslations } from '@/i18n/use-translations';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewPatientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const t = useTranslations('patients');
  const tg = useTranslations('general');

  const createFull = useCreatePatient();
  const createProvisional = useCreateProvisionalPatient();

  const role = session?.role;
  const modeParam = searchParams.get('mode');

  // Determine form mode based on role
  const mode =
    modeParam === 'provisional' ||
    role === Role.RECEPTION ||
    role === Role.NURSE
      ? 'provisional'
      : 'full';

  const isSubmitting =
    createFull.isPending || createProvisional.isPending;

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (mode === 'provisional') {
        await createProvisional.mutateAsync(data as never);
      } else {
        await createFull.mutateAsync(data as never);
      }
      toast.success(t.created);
      router.push('/patients');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.duplicateCurp;
      toast.error(message);
    }
  };

  const title =
    mode === 'provisional' ? t.newProvisionalPatient : t.newPatient;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="ghost" size="sm">
            &larr; {tg.back}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <PatientForm
        mode={mode === 'provisional' ? 'provisional' : 'full'}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
