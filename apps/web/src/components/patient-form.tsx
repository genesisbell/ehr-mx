'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreatePatientSchema,
  CreateProvisionalPatientSchema,
  UpdatePatientSchema,
  type CreatePatientInput,
  type CreateProvisionalPatientInput,
  type UpdatePatientInput,
} from '@ehr-mx/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/i18n/use-translations';

type PatientFormMode = 'provisional' | 'full' | 'edit';

interface PatientFormProps {
  mode: PatientFormMode;
  defaultValues?: Partial<CreatePatientInput>;
  onSubmit: (data: CreatePatientInput | CreateProvisionalPatientInput | UpdatePatientInput) => void;
  isSubmitting: boolean;
}

function getSchema(mode: PatientFormMode) {
  switch (mode) {
    case 'provisional':
      return CreateProvisionalPatientSchema;
    case 'full':
      return CreatePatientSchema;
    case 'edit':
      return UpdatePatientSchema;
  }
}

export function PatientForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
}: PatientFormProps) {
  const t = useTranslations('patients');
  const tg = useTranslations('general');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getSchema(mode)),
    defaultValues: defaultValues ?? {},
  });

  const showFullFields = mode === 'full' || mode === 'edit';
  const isCurpDisabled = mode === 'edit' && !!defaultValues?.curp;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">{tg.name} *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder={tg.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paternalSurname">{t.paternalSurname} *</Label>
        <Input
          id="paternalSurname"
          {...register('paternalSurname')}
          placeholder={t.paternalSurname}
        />
        {errors.paternalSurname && (
          <p className="text-sm text-destructive">
            {errors.paternalSurname.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="maternalSurname">
          {t.maternalSurname} ({tg.optional})
        </Label>
        <Input
          id="maternalSurname"
          {...register('maternalSurname')}
          placeholder={t.maternalSurname}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          {t.phone} ({tg.optional})
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="5512345678"
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message as string}</p>
        )}
      </div>

      {showFullFields && (
        <>
          <div className="space-y-2">
            <Label htmlFor="curp">{t.curp} *</Label>
            <Input
              id="curp"
              {...register('curp')}
              placeholder="GARC900101HDFRRL09"
              maxLength={18}
              className="uppercase"
              disabled={isCurpDisabled}
            />
            {errors.curp && (
              <p className="text-sm text-destructive">{errors.curp.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">{t.birthDate} *</Label>
            <Input
              id="birthDate"
              type="date"
              {...register('birthDate')}
            />
            {errors.birthDate && (
              <p className="text-sm text-destructive">
                {errors.birthDate.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t.sex} *</Label>
            <Select
              defaultValue={defaultValues?.sex}
              onValueChange={(value) => setValue('sex', value as 'M' | 'F', { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.sex} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">{t.male}</SelectItem>
                <SelectItem value="F">{t.female}</SelectItem>
              </SelectContent>
            </Select>
            {errors.sex && (
              <p className="text-sm text-destructive">{errors.sex.message as string}</p>
            )}
          </div>
        </>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? tg.loading : tg.save}
        </Button>
      </div>
    </form>
  );
}
