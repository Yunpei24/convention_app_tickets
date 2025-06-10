import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Système d'Enregistrement avec QR Code",
  description: "Application d'enregistrement de personnes avec génération de QR code et scan",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
            <header className="border-b bg-white shadow-sm">
              <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl flex items-center gap-2 text-blue-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-qr-code"
                  >
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                    <path d="M21 12v.01" />
                    <path d="M12 21v-1" />
                  </svg>
                  QR Register
                </Link>
                <nav className="flex gap-4">
                  <Link href="/register" className="text-sm hover:text-blue-700 transition-colors">
                    Enregistrement
                  </Link>
                  <Link href="/scanner" className="text-sm hover:text-blue-700 transition-colors">
                    Scanner
                  </Link>
                  <Link href="/persons" className="text-sm hover:text-blue-700 transition-colors">
                    Liste
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 bg-white">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} QR Register. Tous droits réservés.
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
