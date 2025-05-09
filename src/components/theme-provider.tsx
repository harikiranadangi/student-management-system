'use client';

import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "react-toastify/dist/ReactToastify.css";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white text-black dark:bg-gray-900 dark:text-white">
        {children}
      </main>
      <footer className="p-4 text-center bg-gray-100 dark:bg-gray-800">
        <p>© {new Date().getFullYear()} Kotak Salesian School. All rights reserved.</p>
      </footer>

      <ToastContainer position="bottom-right" theme="dark" />
      {process.env.NODE_ENV === "production" && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </>
  );
}
