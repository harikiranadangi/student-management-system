"use client";

import { ThemeProvider } from "next-themes";
import { ProfileProvider } from "@/components/context/ProfileContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ProfileProvider>{children}</ProfileProvider>
      <ToastContainer position="bottom-right" theme="dark" />
    </ThemeProvider>
  );
}
