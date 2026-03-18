import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";
import AuthGuard from "@/components/auth/AuthGuard";
import NextAuthSessionProvider from "@/components/auth/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

import { getTenantConfig } from '@/lib/tenant/getTenant';
import { TenantProvider } from '@/components/tenant/TenantProvider';

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig();
  return {
    title: `${tenant.name} — Job Discovery Platform`,
    description: `Find your next dream role with ${tenant.name}.`,
    keywords: ['AI jobs', 'remote jobs', 'job discovery'],
    openGraph: {
      title: `${tenant.name} — Job Discovery`,
      description: 'AI-Native Jobs. Global Coverage.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tenant.name,
    },
  };
}

// Helper to calculate lighter/darker shades from a hex.
// For now, we will simply inject the primary color as the base "indigo"
// since the entire UI is built around tailwind's indigo.

import { AuthModalProvider } from '@/lib/auth/AuthModalContext';

import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenantConfig();
  const primary = tenant.settings.primaryColor || '#4f46e5';

  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-indigo-400: ${primary}cc;
              --color-indigo-500: ${primary};
              --color-indigo-600: ${primary}e6;
              --color-indigo-700: ${primary}b3;
            }
          `
        }} />
        <TenantProvider tenant={tenant}>
          <NextAuthSessionProvider>
            <AuthModalProvider>
              <AuthGuard>
                <div className="relative min-h-screen flex flex-col">
                  <ClientLayoutWrapper>
                    {children}
                  </ClientLayoutWrapper>
                </div>
                <Toaster position="top-center" richColors />
              </AuthGuard>
            </AuthModalProvider>
          </NextAuthSessionProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
