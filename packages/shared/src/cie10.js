"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cie10CodeSchema = void 0;
const zod_1 = require("zod");
/**
 * CIE-10 (ICD-10) diagnosis code.
 * Format: 1 letter + 2 digits + optional dot + 1-2 chars
 * Examples: J06.9, K92.1, Z00
 */
exports.Cie10CodeSchema = zod_1.z
    .string()
    .regex(/^[A-Z][0-9]{2}(\.[0-9A-Z]{1,2})?$/, 'Código CIE-10 inválido')
    .describe('Código de diagnóstico CIE-10');
//# sourceMappingURL=cie10.js.map