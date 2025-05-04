import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ["latin"], fallback: ["Arial", "sans-serif"] });

export const metadata: Metadata = {
  title: "Kotak Salesian School",
  description: "SCHOOL MANAGEMENT SYSTEM",
  icons: {
    icon: "/logo.png", // This ensures Next.js picks up the favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="layout-container">
            <main>
              {children}
            </main>
          </div>
          <ToastContainer position="bottom-right" theme="dark" />
          <Analytics /> {/* Add Vercel Analytics here */}
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
