import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], fallback: ["Arial", "sans-serif"] });

export const metadata = {
  title: "Kotak Salesian School",
  description: "SCHOOL MANAGEMENT SYSTEM",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          <header>
            <nav> {/* Your navigation */} </nav>
          </header>

          <div className="flex-1">
            <main>{children}</main>
          </div>

          <footer className="p-4 text-center bg-gray-100">
            <p>© {new Date().getFullYear()} Kotak Salesian School. All rights reserved.</p>
          </footer>

          <ToastContainer position="bottom-right" theme="dark" />
          
          {process.env.NODE_ENV === "production" && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
