'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, Loader2, Hash, Trophy, Star, Download } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { SidebarAd, InlineAd, BannerAd } from '@/components/AdUnit'

function TrackerContent() {
    const searchParams = useSearchParams()
    const appId = searchParams.get('appId')
    const initialTitle = searchParams.get('title')
    const initialIcon = searchParams.get('icon')
    const initialDeveloper = searchParams.get('developer')

    const [keyword, setKeyword] = useState('')
    const [country, setCountry] = useState('us')
    const [isCheckingRank, setIsCheckingRank] = useState(false)
    const [rankResult, setRankResult] = useState(null)
    const [appDetails, setAppDetails] = useState(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [history, setHistory] = useState([])

    // Countries list for ASO
    const countries = [
        { code: 'us', name: 'United States' },
        { code: 'in', name: 'India' },
        { code: 'gb', name: 'United Kingdom' },
        { code: 'de', name: 'Germany' },
        { code: 'jp', name: 'Japan' },
        { code: 'kr', name: 'South Korea' },
        { code: 'fr', name: 'France' },
        { code: 'br', name: 'Brazil' },
        { code: 'id', name: 'Indonesia' },
        { code: 'es', name: 'Spain' },
    ]

    useEffect(() => {
        if (appId) {
            fetchAppDetails()
            loadHistory()
        }
    }, [appId])

    const fetchAppDetails = async (forceRefresh = false) => {
        if (typeof window !== 'undefined' && !forceRefresh) {
            const cached = localStorage.getItem(`details_${appId}`)
            if (cached) {
                const { data, timestamp } = JSON.parse(cached)
                const isFresh = Date.now() - timestamp < 24 * 60 * 60 * 1000 // 24 hours
                if (isFresh) {
                    setAppDetails(data)
                    return
                }
            }
        }

        setIsLoadingDetails(true)
        try {
            const { data } = await axios.get(`/api/apps/details?appId=${appId}`)
            setAppDetails(data)
            if (typeof window !== 'undefined') {
                localStorage.setItem(`details_${appId}`, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }))
            }
        } catch (error) {
            console.error('Failed to fetch details')
        } finally {
            setIsLoadingDetails(false)
        }
    }

    const loadHistory = () => {
        if (typeof window !== 'undefined') {
            const savedHistory = localStorage.getItem(`history_${appId}`)
            if (savedHistory) setHistory(JSON.parse(savedHistory))
        }
    }

    const saveToHistory = (result) => {
        if (typeof window !== 'undefined') {
            const newEntry = { ...result, id: Date.now(), timestamp: new Date().toISOString() }
            const updatedHistory = [newEntry, ...history].slice(0, 10)
            setHistory(updatedHistory)
            localStorage.setItem(`history_${appId}`, JSON.stringify(updatedHistory))
        }
    }

    const checkRank = async (e, customTerm = null, forceRefresh = false) => {
        if (e) e.preventDefault()

        const termToCheck = customTerm || keyword.trim()
        if (!appId || !termToCheck) return

        if (customTerm) setKeyword(termToCheck)

        // Check freshness (include country in check)
        if (!forceRefresh) {
            const existingEntry = history.find(h =>
                h.term.toLowerCase() === termToCheck.toLowerCase() &&
                (h.region || 'us') === country
            )
            if (existingEntry) {
                const isFresh = Date.now() - new Date(existingEntry.timestamp).getTime() < 60 * 60 * 1000 // 1 hour
                if (isFresh) {
                    setRankResult(existingEntry)
                    return
                }
            }
        }

        setIsCheckingRank(true)
        setRankResult(null)
        try {
            const { data } = await axios.post('/api/keywords', {
                appId,
                term: termToCheck,
                country: country,
                lang: 'en' // Simplify to English for now, or map countries to languages later
            })
            setRankResult(data)
            saveToHistory(data)
        } catch (error) {
            console.error('Failed to check rank')
        } finally {
            setIsCheckingRank(false)
        }
    }

    if (!appId) return (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
            <p className="font-medium text-sm">No app selected</p>
            <Link href="/" className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">Return Home</Link>
        </div>
    )

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Apps
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                        <img
                            src={appDetails?.icon || initialIcon}
                            className="w-24 h-24 rounded-2xl shadow-md border border-[var(--card-border)]"
                            alt={appDetails?.title || initialTitle}
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                                {appDetails?.title || initialTitle}
                            </h1>
                            <p className="text-[var(--text-muted)] text-lg mb-4">{appDetails?.developer || initialDeveloper}</p>

                            {/* Stats */}
                            <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                        <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)] font-medium">Rating</p>
                                        <p className="font-semibold text-[var(--text-main)]">{appDetails?.score?.toFixed(1) || '—'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Download className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)] font-medium">Installs</p>
                                        <p className="font-semibold text-[var(--text-main)]">{appDetails?.installs || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Horizontal Ad - High Visibility */}
                <div className="mb-6">
                    <BannerAd />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Keyword Tracker */}
                        <div className="glass-card p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-[var(--text-main)] flex items-center gap-2">
                                    <Hash className="w-5 h-5 text-blue-600" />
                                    Keyword Ranking
                                </h2>

                                {/* Country Selector */}
                                <select
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="p-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--text-main)] outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    {countries.map(c => (
                                        <option key={c.code} value={c.code}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <form onSubmit={checkRank} className="relative mb-6">
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="Enter keyword to check rank..."
                                            className="pro-input w-full"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isCheckingRank || !keyword.trim()}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-[var(--input-bg)] disabled:text-[var(--text-muted)] text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20 h-[42px] flex items-center justify-center"
                                    >
                                        {isCheckingRank ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check"}
                                    </button>
                                </div>
                            </form>

                            <p className="text-sm text-[var(--text-muted)] bg-[var(--input-bg)] p-3 rounded-lg inline-block">
                                💡 Checking top 250 apps in <b>{countries.find(c => c.code === country)?.name}</b>
                            </p>
                        </div>

                        {/* Rank Result */}
                        <AnimatePresence mode="wait">
                            {rankResult && (
                                <motion.div
                                    key={rankResult.term + rankResult.region}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="glass-card p-8 text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

                                    <p className="text-sm font-medium text-[var(--text-muted)] mb-4 uppercase tracking-wide">
                                        Current Position for "{rankResult.term}" in {rankResult.region?.toUpperCase() || 'US'}
                                    </p>

                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        {rankResult.position !== '250+' && (
                                            <Trophy className="w-10 h-10 text-yellow-500" />
                                        )}
                                        <div className="text-7xl font-bold text-[var(--text-main)] tracking-tighter">
                                            {rankResult.position === '250+' ? '250+' : `#${rankResult.position}`}
                                        </div>
                                    </div>

                                    <p className={`text-base font-medium ${rankResult.position === '250+' ? "text-red-500" : "text-green-500"}`}>
                                        {rankResult.position === '250+' ? "Not found in top 250" : "Great visibility!"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Non-intrusive Inline Ad */}
                        {rankResult && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <InlineAd />
                            </motion.div>
                        )}

                        {/* Recent History - Moved from sidebar */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-[var(--text-main)]">Recent History</h3>
                                <span className="text-xs text-[var(--text-muted)] bg-[var(--input-bg)] px-2 py-1 rounded-full">{history.length}</span>
                            </div>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {history.map((entry) => (
                                    <div
                                        key={entry.id}
                                        onClick={() => {
                                            if (entry.region) setCountry(entry.region)
                                            checkRank(null, entry.term)
                                        }}
                                        className="p-3 bg-[var(--input-bg)] hover:bg-[var(--card-border)] rounded-xl cursor-pointer transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-[var(--text-main)] truncate flex-1 group-hover:text-blue-600 transition-colors">
                                                {entry.term}
                                            </span>
                                            <span className={`text-sm font-bold ml-2 ${entry.position === '250+' ? 'text-[var(--text-muted)]' : 'text-blue-600'}`}>
                                                {entry.position === '250+' ? '—' : `#${entry.position}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                                            <span className="uppercase">{entry.region || 'US'}</span>
                                            <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                                {history.length === 0 && (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-[var(--input-bg)] rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Hash className="w-5 h-5 text-[var(--text-muted)]" />
                                        </div>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            No keywords checked yet
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function KeywordTrackerPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
            </div>
        }>
            <TrackerContent />
        </Suspense>
    )
}
