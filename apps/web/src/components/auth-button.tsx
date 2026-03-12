'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

const KEYCLOAK_ISSUER =
  process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/ehr-dev';

/**
 * Federated logout: sign out of NextAuth, then redirect to Keycloak's
 * end_session_endpoint so the SSO session is also terminated.
 */
async function handleSignOut(idToken?: string) {
  // 1. Sign out of NextAuth (clears the session cookie, no redirect)
  await signOut({ redirect: false });

  // 2. Redirect to Keycloak logout to kill the SSO session
  const logoutUrl = new URL(`${KEYCLOAK_ISSUER}/protocol/openid-connect/logout`);
  if (idToken) {
    logoutUrl.searchParams.set('id_token_hint', idToken);
  }
  logoutUrl.searchParams.set('post_logout_redirect_uri', window.location.origin);
  window.location.href = logoutUrl.toString();
}

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="font-medium">{session.user?.name}</span>
          {session.role && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {session.role}
            </span>
          )}
        </div>
        <button
          onClick={() => handleSignOut(session.idToken)}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('keycloak')}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      Sign in
    </button>
  );
}
