import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'AppRank Tracker',
    description: 'Track your Google Play Store keyword rankings with ease.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <nav className="flex items-center justify-between mb-12">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            AppRank
                        </h1>
                    </nav>
                    {children}
                </div>
            </body>
        </html>
    )
}
