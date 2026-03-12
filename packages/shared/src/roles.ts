export const Role = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTION: 'RECEPTION',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

/** Roles that can create/sign clinical notes (NOM-004) */
export const CLINICAL_ROLES: Role[] = [Role.DOCTOR, Role.NURSE];

/** Roles with full system access */
export const ADMIN_ROLES: Role[] = [Role.ADMIN];
