'use client';

import { AuthButton } from './auth-button';

export function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-end border-b bg-card px-6">
      <AuthButton />
    </header>
  );
}
