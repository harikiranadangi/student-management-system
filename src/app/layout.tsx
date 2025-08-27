// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/components/context/ProfileContext";

const inter = Inter({ subsets: ["latin"], fallback: ["Arial", "sans-serif"] });

export const metadata = {
  title: "Kotak Salesian School",
  description: "SCHOOL MANAGEMENT SYSTEM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
