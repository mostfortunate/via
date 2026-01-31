import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import Footer from "@/components/footer";
import "./globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-code",
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
        className={`${firaCode.className} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-1">{children}</div>
          <Footer />
          <div className="fixed right-0 bottom-0 p-4">
            <ModeToggle />
          </div>
          <Toaster visibleToasts={3} richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
