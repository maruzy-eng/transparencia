"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { SiteSettingRecord } from "@/lib/admin/settings-queries";
import { buildSiteSettings } from "@/lib/transparency/settings-types";

interface LogoUploaderProps {
  settings: SiteSettingRecord[];
}

export function LogoUploader({ settings }: LogoUploaderProps) {
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const siteSettings = buildSiteSettings(map);

  return (
    <div className="space-y-6">
      <Card className="border-[#E2E8F0] bg-white p-6 shadow-none">
        <h2 className="text-base font-semibold text-[#0F172A]">
          Textos gerais
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <form
            action="/api/admin/settings"
            method="POST"
            className="space-y-3"
          >
            <Field label="Nome do portal">
              <Input
                name="value"
                defaultValue={siteSettings.portalName}
                required
              />
            </Field>
            <input type="hidden" name="key" value="portal.name" />
            <Button type="submit" size="sm">
              Salvar nome
            </Button>
          </form>
          <form
            action="/api/admin/settings"
            method="POST"
            className="space-y-3"
          >
            <Field label="Texto curto do footer">
              <Input
                name="value"
                defaultValue={siteSettings.footerText}
                required
              />
            </Field>
            <input type="hidden" name="key" value="portal.footer_text" />
            <Button type="submit" size="sm">
              Salvar footer
            </Button>
          </form>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <LogoUploadCard
          title="Logo principal"
          description="Usado no header do portal."
          currentUrl={siteSettings.logoUrl}
          variant="main"
        />
        <LogoUploadCard
          title="Logo compacto"
          description="Usado no footer e espaços menores."
          currentUrl={siteSettings.logoCompactUrl ?? siteSettings.logoUrl}
          variant="compact"
        />
      </div>
    </div>
  );
}

function LogoUploadCard({
  title,
  description,
  currentUrl,
  variant,
}: {
  title: string;
  description: string;
  currentUrl: string | null;
  variant: "main" | "compact";
}) {
  return (
    <Card className="border-[#E2E8F0] bg-white p-6 shadow-none">
      <h3 className="text-sm font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-1 text-sm text-[#64748B]">{description}</p>

      <div className="mt-4 flex h-24 items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-[#FAFBFC] p-4">
        {currentUrl ? (
          <Image
            src={currentUrl}
            alt={title}
            width={variant === "compact" ? 120 : 160}
            height={48}
            className="max-h-16 w-auto object-contain"
          />
        ) : (
          <p className="text-sm text-[#94A3B8]">Nenhum logo enviado</p>
        )}
      </div>

      <form
        action="/api/admin/settings/logo"
        method="POST"
        encType="multipart/form-data"
        className="mt-4 space-y-3"
      >
        <input type="hidden" name="variant" value={variant} />
        <Field label="Upload (PNG, JPG, WebP, SVG)">
          <Input name="file" type="file" accept="image/*" required />
        </Field>
        <Button type="submit" size="sm">
          Fazer upload
        </Button>
      </form>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
