import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@ehr-mx/shared';
import type { Role as PrismaRole } from '@ehr-mx/database';

/** Priority-ordered mapping from Keycloak realm role name → local Role enum */
const KEYCLOAK_ROLE_MAP: Record<string, Role> = {
  admin: Role.ADMIN,
  doctor: Role.DOCTOR,
  nurse: Role.NURSE,
  reception: Role.RECEPTION,
};

const ROLE_PRIORITY: Role[] = [
  Role.ADMIN,
  Role.DOCTOR,
  Role.NURSE,
  Role.RECEPTION,
];

@Injectable()
export class UserSyncService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Upsert a local User record from Keycloak JWT claims.
   * Called on every authenticated request by the JWT strategy.
   */
  async syncUser(
    keycloakId: string,
    keycloakRoles: string[],
    email?: string,
  ) {
    const role = this.mapRole(keycloakRoles);

    return this.prisma.user.upsert({
      where: { keycloakId },
      update: { role: role as PrismaRole },
      create: {
        keycloakId,
        role: role as PrismaRole,
      },
    });
  }

  /**
   * Map Keycloak realm_access.roles to the highest-priority local Role.
   * Defaults to RECEPTION if no known role is found.
   */
  private mapRole(keycloakRoles: string[]): Role {
    const lowerRoles = keycloakRoles.map((r) => r.toLowerCase());

    for (const role of ROLE_PRIORITY) {
      const keycloakName = Object.entries(KEYCLOAK_ROLE_MAP).find(
        ([, v]) => v === role,
      )?.[0];
      if (keycloakName && lowerRoles.includes(keycloakName)) {
        return role;
      }
    }

    return Role.RECEPTION;
  }
}
