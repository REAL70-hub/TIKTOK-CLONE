import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrendingClips - Comparte videos cortos',
  description: 'Plataforma de videos cortos estilo TikTok. Comparte, descubre y conecta con creadores.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-dark text-white">
        {children}
      </body>
    </html>
  )
}