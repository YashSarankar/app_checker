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
                    {/* Global Navigation - Kept empty as per user request for home screen */}
                    {children}
                </div>
            </body>
        </html>
    )
}
