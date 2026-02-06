'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] py-12 px-6">
            <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/30 dark:bg-black/20 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-blue-500 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to App
                </Link>

                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                <section className="space-y-6 text-[var(--text-muted)] leading-relaxed">
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-main)] mb-3">1. Introduction</h2>
                        <p>Welcome to AppRank Pro (https://rank.sarankar.com). We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect and use information when you use our service.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-main)] mb-3">2. Data Collection</h2>
                        <p>We do not collect personal identification information from our users. We may collect non-personal data such as search queries for app tracking purposes. All tracked app data is stored locally on your device unless otherwise specified.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-main)] mb-3">3. Google AdSense & Cookies</h2>
                        <p>We use Google AdSense to serve advertisements on our website. Google, as a third-party vendor, uses cookies to serve ads on your site. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</p>
                        <p className="mt-2 text-sm italic">Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-main)] mb-3">4. Third-Party Links</h2>
                        <p>Our website may contain links to third-party stores (Google Play Store) and other websites. We have no control over the privacy policies of these third-party websites.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-main)] mb-3">5. Data Analysis</h2>
                        <p>We use search data purely for the purpose of providing keyword ranking reports. This information is not shared with third parties for marketing purposes.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-main)] mb-3">6. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at: support@sarankar.com</p>
                    </div>

                    <div className="pt-8 border-t border-white/10 text-sm italic">
                        <p>Last updated: February 6, 2026</p>
                    </div>
                </section>
            </div>
        </div>
    )
}
