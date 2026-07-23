import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/pwa-register";
import { publicEnv } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.appUrl()),
  applicationName: "DermaGlow",
  title: {
    default: "DermaGlow - AI skincare analysis and routines",
    template: "%s - DermaGlow",
  },
  description:
    "A calm, personalized skincare analysis. Get your hydration and oiliness read, a morning and evening routine, and region-aware product picks in minutes. No account needed.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DermaGlow",
  },
  // Favicon comes from the app/icon.svg file convention (the nav logo mark).
  openGraph: {
    title: "DermaGlow - AI skincare analysis and routines",
    description:
      "Personalized skincare analysis with region-aware product recommendations.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#141110" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
