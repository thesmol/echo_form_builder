import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { ruRU } from "@clerk/localizations";
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Эхо - формы",
  description: "Создавайте и делитесь онлайн формами с помощью Эхо",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider localization={ruRU}>
      <html lang="ru" suppressHydrationWarning>
        <head />
        <body className={inter.className}>
          <NextTopLoader showSpinner = {false} color = {"#3730a3"}/>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
