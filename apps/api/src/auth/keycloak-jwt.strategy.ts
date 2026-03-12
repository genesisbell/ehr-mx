import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { UserSyncService } from './user-sync.service';
import { RequestUser } from './interfaces/request-user.interface';

interface KeycloakJwtPayload {
  sub: string;
  realm_access?: { roles?: string[] };
  preferred_username?: string;
  email?: string;
  name?: string;
}

@Injectable()
export class KeycloakJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userSyncService: UserSyncService) {
    const keycloakUrl = process.env.KEYCLOAK_URL ?? 'http://localhost:8080';
    const realm = process.env.KEYCLOAK_REALM ?? 'ehr-dev';
    const issuer = `${keycloakUrl}/realms/${realm}`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
      }),
      issuer,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: KeycloakJwtPayload): Promise<RequestUser> {
    const keycloakRoles = payload.realm_access?.roles ?? [];

    const user = await this.userSyncService.syncUser(
      payload.sub,
      keycloakRoles,
      payload.email,
    );

    return {
      userId: user.id,
      keycloakId: payload.sub,
      role: user.role,
      email: payload.email,
      name: payload.name,
    };
  }
}
