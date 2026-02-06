'use client'

import React from 'react'

export default function AdUnit({ slot, format = 'auto', style = {} }) {
    return (
        <div className="ad-container glass-card p-4 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100" style={style}>
            <div className="text-center w-full">
                <p className="text-xs text-gray-400 mb-2">Advertisement</p>
                <div className="text-sm text-gray-500 min-h-[50px] flex items-center justify-center">
                    {/* Real AdSense Unit */}
                    <ins className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client="ca-pub-9441953606119572"
                        data-ad-slot={slot}
                        data-ad-format={format}
                        data-full-width-responsive="true"></ins>

                    {/* We need to trigger the ad load after component mounts */}
                    <script dangerouslySetInnerHTML={{
                        __html: `(adsbygoogle = window.adsbygoogle || []).push({});`
                    }} />
                </div>
            </div>
        </div>
    )
}

// Sidebar Ad Component (300x250)
export function SidebarAd() {
    return (
        <AdUnit
            slot="sidebar-ad"
            format="rectangle"
            style={{ minHeight: '250px', maxWidth: '300px' }}
        />
    )
}

// Inline Ad Component (Responsive)
export function InlineAd() {
    return (
        <AdUnit
            slot="inline-ad"
            format="auto"
            style={{ minHeight: '100px' }}
        />
    )
}

// Banner Ad Component (728x90 or responsive)
export function BannerAd() {
    return (
        <AdUnit
            slot="banner-ad"
            format="horizontal"
            style={{ minHeight: '90px', maxHeight: '120px' }}
        />
    )
}
