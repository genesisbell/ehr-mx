import { z } from 'zod';
import { Cie10CodeSchema } from './cie10';

/**
 * Schema for a clinical note's structured content (NOM-004-SSA3-2012).
 * This is the payload that gets hashed and signed with e.firma.
 */
export const ClinicalNoteContentSchema = z.object({
  /** Tipo de nota clínica (NOM-004 §8) */
  type: z.enum([
    'ingreso',
    'evolucion',
    'egreso',
    'interconsulta',
    'urgencias',
    'quirurgica',
    'anestesia',
    'enfermeria',
  ]),

  /** Motivo de consulta o ingreso */
  chiefComplaint: z.string().min(1).max(2000),

  /** Diagnósticos con código CIE-10 */
  diagnoses: z
    .array(
      z.object({
        code: Cie10CodeSchema,
        description: z.string().min(1),
        type: z.enum(['principal', 'secundario', 'complicacion']),
      }),
    )
    .min(1),

  /** Exploración física */
  physicalExam: z
    .object({
      bloodPressure: z.string().optional(),  // e.g. "120/80"
      heartRate: z.number().int().positive().optional(),
      temperature: z.number().optional(),    // Celsius
      weight: z.number().positive().optional(), // kg
      height: z.number().positive().optional(), // cm
      notes: z.string().max(5000).optional(),
    })
    .optional(),

  /** Plan de tratamiento */
  treatmentPlan: z.string().max(5000).optional(),

  /** Pronóstico */
  prognosis: z.string().max(1000).optional(),

  /** Notas adicionales del médico */
  additionalNotes: z.string().max(5000).optional(),

  /** Timestamp ISO del momento de la nota (no del servidor) */
  noteDateTime: z.string().datetime({ offset: true }),
});

export type ClinicalNoteContent = z.infer<typeof ClinicalNoteContentSchema>;

/**
 * Schema for the signature request payload sent to the API.
 */
export const SignNoteRequestSchema = z.object({
  noteId: z.string().uuid(),
  /** base64-encoded .key file contents (transient — never persisted) */
  keyFileBase64: z.string().min(1),
  /** Password for the .key file */
  keyPassword: z.string().min(1),
});

export type SignNoteRequest = z.infer<typeof SignNoteRequestSchema>;
