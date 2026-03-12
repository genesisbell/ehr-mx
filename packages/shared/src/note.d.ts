import { z } from 'zod';
/**
 * Schema for a clinical note's structured content (NOM-004-SSA3-2012).
 * This is the payload that gets hashed and signed with e.firma.
 */
export declare const ClinicalNoteContentSchema: z.ZodObject<{
    /** Tipo de nota clínica (NOM-004 §8) */
    type: z.ZodEnum<["ingreso", "evolucion", "egreso", "interconsulta", "urgencias", "quirurgica", "anestesia", "enfermeria"]>;
    /** Motivo de consulta o ingreso */
    chiefComplaint: z.ZodString;
    /** Diagnósticos con código CIE-10 */
    diagnoses: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        description: z.ZodString;
        type: z.ZodEnum<["principal", "secundario", "complicacion"]>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        type: "principal" | "secundario" | "complicacion";
        description: string;
    }, {
        code: string;
        type: "principal" | "secundario" | "complicacion";
        description: string;
    }>, "many">;
    /** Exploración física */
    physicalExam: z.ZodOptional<z.ZodObject<{
        bloodPressure: z.ZodOptional<z.ZodString>;
        heartRate: z.ZodOptional<z.ZodNumber>;
        temperature: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        bloodPressure?: string | undefined;
        heartRate?: number | undefined;
        temperature?: number | undefined;
        weight?: number | undefined;
        height?: number | undefined;
        notes?: string | undefined;
    }, {
        bloodPressure?: string | undefined;
        heartRate?: number | undefined;
        temperature?: number | undefined;
        weight?: number | undefined;
        height?: number | undefined;
        notes?: string | undefined;
    }>>;
    /** Plan de tratamiento */
    treatmentPlan: z.ZodOptional<z.ZodString>;
    /** Pronóstico */
    prognosis: z.ZodOptional<z.ZodString>;
    /** Notas adicionales del médico */
    additionalNotes: z.ZodOptional<z.ZodString>;
    /** Timestamp ISO del momento de la nota (no del servidor) */
    noteDateTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "ingreso" | "evolucion" | "egreso" | "interconsulta" | "urgencias" | "quirurgica" | "anestesia" | "enfermeria";
    chiefComplaint: string;
    diagnoses: {
        code: string;
        type: "principal" | "secundario" | "complicacion";
        description: string;
    }[];
    noteDateTime: string;
    physicalExam?: {
        bloodPressure?: string | undefined;
        heartRate?: number | undefined;
        temperature?: number | undefined;
        weight?: number | undefined;
        height?: number | undefined;
        notes?: string | undefined;
    } | undefined;
    treatmentPlan?: string | undefined;
    prognosis?: string | undefined;
    additionalNotes?: string | undefined;
}, {
    type: "ingreso" | "evolucion" | "egreso" | "interconsulta" | "urgencias" | "quirurgica" | "anestesia" | "enfermeria";
    chiefComplaint: string;
    diagnoses: {
        code: string;
        type: "principal" | "secundario" | "complicacion";
        description: string;
    }[];
    noteDateTime: string;
    physicalExam?: {
        bloodPressure?: string | undefined;
        heartRate?: number | undefined;
        temperature?: number | undefined;
        weight?: number | undefined;
        height?: number | undefined;
        notes?: string | undefined;
    } | undefined;
    treatmentPlan?: string | undefined;
    prognosis?: string | undefined;
    additionalNotes?: string | undefined;
}>;
export type ClinicalNoteContent = z.infer<typeof ClinicalNoteContentSchema>;
/**
 * Schema for the signature request payload sent to the API.
 */
export declare const SignNoteRequestSchema: z.ZodObject<{
    noteId: z.ZodString;
    /** base64-encoded .key file contents (transient — never persisted) */
    keyFileBase64: z.ZodString;
    /** Password for the .key file */
    keyPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    noteId: string;
    keyFileBase64: string;
    keyPassword: string;
}, {
    noteId: string;
    keyFileBase64: string;
    keyPassword: string;
}>;
export type SignNoteRequest = z.infer<typeof SignNoteRequestSchema>;
//# sourceMappingURL=note.d.ts.map