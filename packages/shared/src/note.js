"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignNoteRequestSchema = exports.ClinicalNoteContentSchema = void 0;
const zod_1 = require("zod");
const cie10_1 = require("./cie10");
/**
 * Schema for a clinical note's structured content (NOM-004-SSA3-2012).
 * This is the payload that gets hashed and signed with e.firma.
 */
exports.ClinicalNoteContentSchema = zod_1.z.object({
    /** Tipo de nota clínica (NOM-004 §8) */
    type: zod_1.z.enum([
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
    chiefComplaint: zod_1.z.string().min(1).max(2000),
    /** Diagnósticos con código CIE-10 */
    diagnoses: zod_1.z
        .array(zod_1.z.object({
        code: cie10_1.Cie10CodeSchema,
        description: zod_1.z.string().min(1),
        type: zod_1.z.enum(['principal', 'secundario', 'complicacion']),
    }))
        .min(1),
    /** Exploración física */
    physicalExam: zod_1.z
        .object({
        bloodPressure: zod_1.z.string().optional(), // e.g. "120/80"
        heartRate: zod_1.z.number().int().positive().optional(),
        temperature: zod_1.z.number().optional(), // Celsius
        weight: zod_1.z.number().positive().optional(), // kg
        height: zod_1.z.number().positive().optional(), // cm
        notes: zod_1.z.string().max(5000).optional(),
    })
        .optional(),
    /** Plan de tratamiento */
    treatmentPlan: zod_1.z.string().max(5000).optional(),
    /** Pronóstico */
    prognosis: zod_1.z.string().max(1000).optional(),
    /** Notas adicionales del médico */
    additionalNotes: zod_1.z.string().max(5000).optional(),
    /** Timestamp ISO del momento de la nota (no del servidor) */
    noteDateTime: zod_1.z.string().datetime({ offset: true }),
});
/**
 * Schema for the signature request payload sent to the API.
 */
exports.SignNoteRequestSchema = zod_1.z.object({
    noteId: zod_1.z.string().uuid(),
    /** base64-encoded .key file contents (transient — never persisted) */
    keyFileBase64: zod_1.z.string().min(1),
    /** Password for the .key file */
    keyPassword: zod_1.z.string().min(1),
});
//# sourceMappingURL=note.js.map