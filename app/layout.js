import './globals.css'
import Sidebar from './components/Sidebar'
import { FinanceProvider } from './FinanceContext'

export const metadata = {
  title: 'FIN-IQ | Financial Intelligence',
  description: 'AI-powered financial monitoring and predictive savings dashboard.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="flex min-h-screen bg-[#0a0b0e] text-gray-100">
        <FinanceProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            {children}
          </div>
        </FinanceProvider>
      </body>
    </html>
  )
}
