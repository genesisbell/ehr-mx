import { z } from 'zod';
import { CurpSchema } from './curp';

export const PatientStatus = {
  PROVISIONAL: 'PROVISIONAL',
  COMPLETE: 'COMPLETE',
} as const;

export type PatientStatus = (typeof PatientStatus)[keyof typeof PatientStatus];

const SexSchema = z.enum(['M', 'F']);

/**
 * Schema for creating a provisional patient (RECEPTION / NURSE).
 * Only requires name and paternal surname.
 */
export const CreateProvisionalPatientSchema = z.object({
  name: z.string().min(1).max(100),
  paternalSurname: z.string().min(1).max(100),
  maternalSurname: z.string().max(100).optional(),
  phone: z.string().min(10).max(15).optional(),
});

export type CreateProvisionalPatientInput = z.infer<
  typeof CreateProvisionalPatientSchema
>;

/**
 * Schema for creating a complete patient (DOCTOR).
 * Requires all fields including CURP, birthDate, and sex.
 */
export const CreatePatientSchema = CreateProvisionalPatientSchema.extend({
  curp: CurpSchema,
  birthDate: z.string().date(),
  sex: SexSchema,
});

export type CreatePatientInput = z.infer<typeof CreatePatientSchema>;

/**
 * Schema for updating a patient (DOCTOR).
 * All fields optional — allows completing a provisional patient.
 */
export const UpdatePatientSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  paternalSurname: z.string().min(1).max(100).optional(),
  maternalSurname: z.string().max(100).optional(),
  phone: z.string().min(10).max(15).optional(),
  curp: CurpSchema.optional(),
  birthDate: z.string().date().optional(),
  sex: SexSchema.optional(),
});

export type UpdatePatientInput = z.infer<typeof UpdatePatientSchema>;

/**
 * Schema for patient list query parameters.
 */
export const PatientSearchParamsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['PROVISIONAL', 'COMPLETE']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PatientSearchParams = z.infer<typeof PatientSearchParamsSchema>;
