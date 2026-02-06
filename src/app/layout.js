import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: {
        default: 'AppRank Pro - ASO Keyword Ranking Tracker for Google Play',
        template: '%s | AppRank Pro',
    },
    description: 'Boost your app visibility with AppRank Pro. The ultimate ASO tool to track Google Play Store keyword rankings, monitor competitors, and optimize global app store performance.',
    applicationName: 'AppRank Pro',
    keywords: [
        'ASO tool',
        'app store optimization',
        'keyword rank tracker',
        'google play ranking',
        'android app seo',
        'app ranking checker',
        'mobile app marketing',
        'play store keywords',
        'app store keywords',
        'track app ranking'
    ],
    authors: [{ name: 'AppRank Pro Team' }],
    creator: 'AppRank Pro',
    publisher: 'AppRank Pro',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: 'AppRank Pro - #1 ASO Keyword Tracker',
        description: 'Track your Google Play Store keyword rankings and boost your organic downloads with AppRank Pro.',
        siteName: 'AppRank Pro',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AppRank Pro - ASO Keyword Tracker',
        description: 'Track Google Play Store rankings instantly.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen py-8 px-4 flex justify-center items-start">
                    <div className="w-full max-w-6xl">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}
