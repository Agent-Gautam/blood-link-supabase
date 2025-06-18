// layout.tsx
import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { DropletIcon } from "lucide-react";
import { Toaster } from "sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BloodLink - Connect & Save Lives",
  description:
    "A platform to connect blood donors and organizations, powered by Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-foreground/10 h-16 transition-all duration-300">
              <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-full">
                <Link href="/" className="flex items-center space-x-2 group">
                  <DropletIcon className="h-8 w-8 text-bloodlink-red transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-xl font-extrabold text-bloodlink-gray">
                    Blood<span className="text-bloodlink-red">Link</span>
                  </span>
                </Link>
                <div className="flex items-center space-x-4">
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 w-full flex flex-col gap-12">
              {children}
            </div>

            {/* Footer */}
            <footer aria-label="Footer" className="w-full bg-gradient-to-r from-blue-50 via-white to-red-50 border-t border-foreground/10 py-10 px-4 sm:px-6 lg:px-8 mt-8">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                  <p className="text-base text-gray-700 font-semibold">
                    &copy; {new Date().getFullYear()} BloodLink. All rights reserved.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Made with <span aria-label="love" role="img">❤️</span> for a healthier world.
                  </p>
                </div>
                <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
                  <Link href="/about" className="text-sm text-gray-700 hover:text-red-600 transition-colors font-medium">About</Link>
                  <Link href="/contact" className="text-sm text-gray-700 hover:text-red-600 transition-colors font-medium">Contact</Link>
                  <Link href="/privacy" className="text-sm text-gray-700 hover:text-red-600 transition-colors font-medium">Privacy Policy</Link>
                </nav>
              </div>
            </footer>

            <Toaster />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
