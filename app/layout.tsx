import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { ruRU } from "@clerk/localizations";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { FormProvider } from "@/components/providers/FormProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Эхо - формы",
  description: "Создавайте и делитесь онлайн формами с помощью Эхо",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ruRU}>
      <FormProvider>
        <html lang="ru" suppressHydrationWarning>
          <head />
          <body className={inter.className}>
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
      </FormProvider>
    </ClerkProvider>
  );
}
