'use client'

import { useState } from 'react'
import axios from 'axios'
import { Search, Loader2, ArrowLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddAppPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState(null)

    const saveApp = (app) => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('savedApps')
            const savedApps = saved ? JSON.parse(saved) : []

            const existing = savedApps.find(a => a.appId === app.appId)
            if (!existing) {
                const updated = [...savedApps, app]
                localStorage.setItem('savedApps', JSON.stringify(updated))
            }

            router.push(`/tracker?appId=${app.appId}&title=${encodeURIComponent(app.title)}&icon=${encodeURIComponent(app.icon)}&developer=${encodeURIComponent(app.developer)}`)
        }
    }

    const processSearch = async (e) => {
        e.preventDefault()
        const term = searchTerm.trim()
        if (!term) return

        setError(null)
        setSearchResults([])

        // Check if URL
        if (term.includes('play.google.com')) {
            try {
                const url = new URL(term);
                const id = url.searchParams.get('id');
                if (id) {
                    fetchAndSaveApp(id)
                    return;
                }
            } catch (e) { }
        }

        // Check if Package ID
        if (term.includes('.') && !term.includes(' ')) {
            fetchAndSaveApp(term)
            return;
        }

        // Search
        setIsSearching(true)
        try {
            const { data } = await axios.get(`/api/apps/search?term=${term}`)
            if (data.length === 0) {
                setError('No apps found. Try a different search term.')
            } else {
                setSearchResults(data)
            }
        } catch (error) {
            setError('Search failed. Please try again.')
        } finally {
            setIsSearching(false)
        }
    }

    const fetchAndSaveApp = async (appId) => {
        setIsSearching(true)
        try {
            const { data } = await axios.get(`/api/apps/details?appId=${appId}`)
            saveApp({
                appId: data.appId,
                title: data.title,
                icon: data.icon,
                developer: data.developer
            })
        } catch (error) {
            setError('Failed to fetch app details. Please check the package ID or URL.')
            setIsSearching(false)
        }
    }

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>

                    <h1 className="text-4xl font-semibold text-[var(--text-main)] mb-2 tracking-tight">
                        Add App
                    </h1>
                    <p className="text-[var(--text-muted)] text-base">
                        Search by name, package ID, or Play Store URL
                    </p>
                </header>

                {/* Search */}
                <div className="mb-8">
                    <form onSubmit={processSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for an app..."
                            className="pro-input pl-12 pr-24 py-3.5 text-base w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={isSearching || !searchTerm.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-[var(--input-bg)] disabled:text-[var(--text-muted)] text-white rounded-md font-medium text-sm transition-colors"
                        >
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                        </button>
                    </form>

                    {/* Helper */}
                    <div className="mt-4 p-4 bg-[var(--input-bg)] rounded-lg">
                        <p className="text-sm text-[var(--text-muted)] mb-2 font-medium">Examples:</p>
                        <ul className="space-y-1 text-sm text-[var(--text-muted)]">
                            <li>• App name: <code className="text-[var(--text-main)] bg-[var(--card-bg)] px-1.5 py-0.5 rounded">Instagram</code></li>
                            <li>• Package ID: <code className="text-[var(--text-main)] bg-[var(--card-bg)] px-1.5 py-0.5 rounded">com.instagram.android</code></li>
                            <li>• Play Store URL</li>
                        </ul>
                    </div>
                </div>

                {/* Error */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                        >
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {searchResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4">
                                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                            </h2>

                            <div className="space-y-3">
                                {searchResults.map((app, index) => (
                                    <motion.div
                                        key={app.appId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => saveApp(app)}
                                        className="glass-card p-4 cursor-pointer hover:shadow-md transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={app.icon}
                                                className="w-14 h-14 rounded-xl shadow-sm"
                                                alt={app.title}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-[var(--text-main)] text-base mb-0.5 truncate">
                                                    {app.title}
                                                </h3>
                                                <p className="text-sm text-[var(--text-muted)] truncate mb-1">
                                                    {app.developer}
                                                </p>
                                                <p className="text-xs font-mono text-[var(--text-muted)] truncate">
                                                    {app.appId}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
