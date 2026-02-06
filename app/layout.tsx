import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import AppSidebar from "@/components/app-sidebar";
import Footer from "@/components/footer";
import "./globals.css";

import { MOCK_COLLECTIONS } from "@/mocks/collections";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Via",
  description: "Via is a free, lightweight, easy-to-use HTTP client.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={true}>
            <AppSidebar data={MOCK_COLLECTIONS} />
            <main className="flex w-full flex-1 flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </main>
            <div className="fixed right-0 bottom-0 p-4">
              <ModeToggle />
            </div>
            <Toaster visibleToasts={3} richColors />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
