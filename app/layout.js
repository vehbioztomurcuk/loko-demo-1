import './globals.css'

export const metadata = {
  title: 'Lokomotif AI - Role Play Tool',
  description: 'AI-powered role play tool for job interview practice',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}