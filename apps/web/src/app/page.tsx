import { AuthButton } from '@/components/auth-button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="absolute top-4 right-4">
        <AuthButton />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">EHR México</h1>
        <p className="text-muted-foreground text-lg">
          Sistema de Expediente Clínico Electrónico
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          NOM-004-SSA3-2012 · NOM-024-SSA3-2012
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
        {[
          { label: 'API Backend', url: 'http://localhost:3001/health', desc: 'NestJS · Puerto 3001' },
          { label: 'Keycloak', url: 'http://localhost:8080', desc: 'Auth · Puerto 8080' },
          { label: 'Adminer', url: 'http://localhost:8081', desc: 'DB GUI · Puerto 8081' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border p-4 hover:bg-accent transition-colors"
          >
            <p className="font-semibold">{link.label}</p>
            <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
          </a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Ambiente de desarrollo — margaretsoft © {new Date().getFullYear()}
      </p>
    </main>
  );
}
