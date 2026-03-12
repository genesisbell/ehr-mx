import { Role } from '@ehr-mx/shared';

export interface RequestUser {
  /** Local DB user ID */
  userId: string;
  /** Keycloak subject (sub claim) */
  keycloakId: string;
  /** Mapped local role */
  role: Role;
  /** Email from Keycloak token */
  email?: string;
  /** Full name from Keycloak token */
  name?: string;
}
