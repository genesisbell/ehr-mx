import { z } from 'zod';
/**
 * CIE-10 (ICD-10) diagnosis code.
 * Format: 1 letter + 2 digits + optional dot + 1-2 chars
 * Examples: J06.9, K92.1, Z00
 */
export declare const Cie10CodeSchema: z.ZodString;
export type Cie10Code = z.infer<typeof Cie10CodeSchema>;
export interface Cie10Entry {
    code: Cie10Code;
    description: string;
}
//# sourceMappingURL=cie10.d.ts.map