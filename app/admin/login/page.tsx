import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { CheckmateLogo } from "@/components/transparency/checkmate-logo";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getAdminEnvErrorMessage, getMissingAdminEnvVars } from "@/lib/env/server";

export const dynamic = "force-dynamic";

interface AdminLoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const nextPath = params.next ?? "/admin/dashboard";
  const envError = getAdminEnvErrorMessage();
  const missingEnvVars = getMissingAdminEnvVars();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/transparency" className="mb-6">
            <CheckmateLogo />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            Acesso administrativo
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Entre com suas credenciais para gerenciar o portal.
          </p>
        </div>

        {envError ? (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-left text-sm text-[#92400E]"
          >
            <p className="font-medium">Painel admin não configurado</p>
            <p className="mt-1">{envError}</p>
            <ul className="mt-2 list-inside list-disc text-xs text-[#B45309]">
              {missingEnvVars.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
          <LoginForm nextPath={nextPath} disabled={Boolean(envError)} />
        </div>
      </div>
    </div>
  );
}
