'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Plus, Trash2, AppWindow, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AppSelectionPage() {
    const router = useRouter()
    const [savedApps, setSavedApps] = useState([])

    useEffect(() => {
        loadSavedApps()

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadSavedApps()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('focus', loadSavedApps)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('focus', loadSavedApps)
        }
    }, [])

    const loadSavedApps = () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('savedApps')
            if (saved) {
                setSavedApps(JSON.parse(saved))
            }
        }
    }

    const removeApp = (appId, e) => {
        e.preventDefault()
        e.stopPropagation()
        if (typeof window !== 'undefined') {
            const updated = savedApps.filter(a => a.appId !== appId)
            setSavedApps(updated)
            localStorage.setItem('savedApps', JSON.stringify(updated))
        }
    }

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Apple-style Header */}
                <header className="mb-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-semibold text-[var(--text-main)] mb-2 tracking-tight">
                                Apps
                            </h1>
                            <p className="text-[var(--text-muted)] text-base">
                                {savedApps.length} {savedApps.length === 1 ? 'app' : 'apps'} tracked
                            </p>
                        </div>
                        <Link
                            href="/add-app"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add App
                        </Link>
                    </div>
                </header>

                {/* Apps Grid */}
                <AnimatePresence mode="wait">
                    {savedApps.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24"
                        >
                            <div className="w-20 h-20 bg-[var(--input-bg)] rounded-2xl flex items-center justify-center mb-6">
                                <AppWindow className="w-10 h-10 text-[var(--text-muted)]" />
                            </div>
                            <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-2">
                                No Apps Yet
                            </h2>
                            <p className="text-[var(--text-muted)] mb-8 text-center max-w-sm">
                                Add your first app to start tracking keyword rankings
                            </p>
                            <Link
                                href="/add-app"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                                Add Your First App
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedApps.map((app, index) => (
                                <motion.div
                                    key={app.appId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={`/tracker?appId=${app.appId}&title=${encodeURIComponent(app.title)}&icon=${encodeURIComponent(app.icon)}&developer=${encodeURIComponent(app.developer)}`}
                                    >
                                        <div className="glass-card p-5 hover:shadow-md cursor-pointer group transition-all duration-200 relative">
                                            {/* Remove Button */}
                                            <button
                                                onClick={(e) => removeApp(app.appId, e)}
                                                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-500 hover:text-white lg:opacity-0 lg:group-hover:opacity-100 transition-all z-10 shadow-sm"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            {/* App Content */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <img
                                                    src={app.icon}
                                                    alt={app.title}
                                                    className="w-14 h-14 rounded-xl shadow-sm"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-[var(--text-main)] text-base truncate mb-0.5">
                                                        {app.title}
                                                    </h3>
                                                    <p className="text-sm text-[var(--text-muted)] truncate">
                                                        {app.developer}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Package ID */}
                                            <div className="bg-[var(--input-bg)] rounded-lg px-3 py-2 mb-3">
                                                <p className="text-xs font-mono text-[var(--text-muted)] truncate">
                                                    {app.appId}
                                                </p>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[var(--text-muted)] font-medium">View Details</span>
                                                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
