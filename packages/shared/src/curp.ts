import { z } from 'zod';

/**
 * CURP — Clave Única de Registro de Población (Mexican national ID).
 * 18-char alphanumeric: 4 letters + YYMMDD + H/M + state code + 3 consonants + check digit + century digit
 */
export const CURP_REGEX =
  /^[A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CH|CL|CM|CS|DF|DG|GR|GT|HG|JC|MC|MN|MS|NE|NL|NT|OC|PL|QR|QT|SL|SP|SR|TC|TL|TS|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$/;

export const CurpSchema = z
  .string()
  .length(18, 'CURP must be exactly 18 characters')
  .transform((v) => v.toUpperCase())
  .pipe(z.string().regex(CURP_REGEX, 'Invalid CURP format'));

export type Curp = z.infer<typeof CurpSchema>;

export function validateCurp(curp: string): boolean {
  return CURP_REGEX.test(curp.toUpperCase());
}
