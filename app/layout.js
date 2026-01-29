import './globals.css'

export const metadata = {
  title: 'AI Portfolio Manager',
  description: 'Intelligent trading powered by AI analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}