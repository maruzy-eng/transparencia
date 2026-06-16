import type { Metadata } from "next";

import { TransparencyShell } from "@/components/transparency/transparency-shell";
import { getTransparencyPageContent } from "@/lib/transparency/content";
import { getTransparencySiteSettings } from "@/lib/transparency/settings";

export const metadata: Metadata = {
  title: "Portal de Transparência | Checkmate Property",
  description:
    "Acompanhe imóveis, andamento, valores e atualizações dos projetos Checkmate Property.",
};

export default async function TransparencyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, pageContent] = await Promise.all([
    getTransparencySiteSettings(),
    getTransparencyPageContent(),
  ]);

  return (
    <div className="transparency-theme min-h-screen">
      <TransparencyShell
        settings={settings}
        footerContent={pageContent.footer}
      >
        {children}
      </TransparencyShell>
    </div>
  );
}
