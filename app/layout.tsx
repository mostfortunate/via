import type { Metadata } from "next";
import { Inter, Lora, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import AppSidebar from "@/components/app-sidebar";
import Footer from "@/components/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
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
        className={`${inter.variable} ${lora.variable} ${ibmPlexMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
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
