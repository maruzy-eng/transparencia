import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Checkmate Property",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="admin-theme min-h-screen admin-page-bg">{children}</div>;
}
