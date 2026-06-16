import "server-only";

const ADMIN_REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_AUTH_SECRET",
] as const;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.local.example`,
    );
  }

  return value;
}

export function getMissingAdminEnvVars(): string[] {
  return ADMIN_REQUIRED_ENV.filter((name) => !process.env[name]?.trim());
}

export function getAdminEnvErrorMessage(): string | null {
  const missing = getMissingAdminEnvVars();

  if (missing.length === 0) {
    return null;
  }

  return `Configuração do painel incompleta. Adicione ao .env.local: ${missing.join(", ")}. Consulte .env.local.example e reinicie o servidor.`;
}

export function assertAdminEnvConfigured(): void {
  const message = getAdminEnvErrorMessage();
  if (message) {
    throw new Error(message);
  }
}

export function getSupabaseUrl(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getAdminAuthSecret(): string {
  return requireEnv("ADMIN_AUTH_SECRET");
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
