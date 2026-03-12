import type { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'ehr-web',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
      issuer: process.env.KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/ehr-dev',
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, account }) {
      // On initial sign-in, persist the Keycloak tokens
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;

        // Extract role from the access token's realm_access claim
        try {
          const payload = JSON.parse(
            Buffer.from(account.access_token!.split('.')[1], 'base64').toString(),
          );
          const roles: string[] = payload.realm_access?.roles ?? [];
          // Priority: admin > doctor > nurse > reception
          if (roles.includes('admin')) token.role = 'ADMIN';
          else if (roles.includes('doctor')) token.role = 'DOCTOR';
          else if (roles.includes('nurse')) token.role = 'NURSE';
          else if (roles.includes('reception')) token.role = 'RECEPTION';
        } catch {
          // If token parsing fails, skip role extraction
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.role = token.role;
      session.error = token.error;
      return session;
    },
  },

  pages: {
    signIn: undefined, // Use default next-auth sign-in (redirects to Keycloak)
  },
};
